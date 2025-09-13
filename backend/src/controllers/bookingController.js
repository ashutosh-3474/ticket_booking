// controllers/helpers.js
const Show = require("../models/show");
const Booking = require("../models/booking");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const RESERVATION_TTL_MS = 2 * 60 * 1000; // 2 minutes

// ----------------- HELPER -----------------
exports.removeExpiredReservedSeats = async (showId) => {
    const cutoff = new Date(Date.now() - RESERVATION_TTL_MS);
    console.log(`[CLEANUP] Removing expired reservations before ${cutoff.toISOString()}`);
    const result = await Show.updateOne(
        { _id: showId },
        { $pull: { reservedSeats: { reservedAt: { $lt: cutoff } } } }
    );
    console.log(`[CLEANUP] Removed expired reserved seats ->`, result);
};

// ----------------- RESERVE SEAT -----------------
exports.reserveSeat = async (req, res) => {
    try {
        const { showId } = req.params;
        const { seatNumber } = req.body;
        const userId = req.user._id;

        console.log(`\n[RESERVE] User ${userId} trying to reserve seat ${seatNumber} for show ${showId}`);

        if (!seatNumber) return res.status(400).json({ message: "seatNumber required" });

        // cleanup expired reservations
        await exports.removeExpiredReservedSeats(showId);

        const filter = {
            _id: showId,
            "bookedSeats.seatNumber": { $ne: seatNumber },
            "reservedSeats.seatNumber": { $ne: seatNumber },
            $expr: {
                $lt: [
                    {
                        $size: {
                            $filter: {
                                input: "$reservedSeats",
                                as: "r",
                                cond: { $eq: ["$$r.user", new ObjectId(userId)] }
                            }
                        }
                    },
                    6
                ]
            }
        };

        const update = {
            $push: {
                reservedSeats: { seatNumber, user: new ObjectId(userId), reservedAt: new Date() }
            }
        };

        console.log("[RESERVE] Running atomic update...");
        const updated = await Show.findOneAndUpdate(filter, update, { new: true });

        if (!updated) {
            console.warn("[RESERVE] Failed atomic update. Checking reasons...");
            const show = await Show.findById(showId);
            if (!show) return res.status(404).json({ message: "Show not found" });

            if (show.bookedSeats.some(s => s.seatNumber === seatNumber)) {
                return res.status(409).json({ message: "Seat already booked" });
            }
            if (show.reservedSeats.some(s => s.seatNumber === seatNumber)) {
                return res.status(409).json({ message: "Seat temporarily reserved by another user" });
            }
            const userReservedCount = show.reservedSeats.filter(s => String(s.user) === String(userId)).length;
            if (userReservedCount >= 6) {
                return res.status(400).json({ message: "You cannot reserve more than 6 seats for this show" });
            }
            return res.status(409).json({ message: "Could not reserve seat" });
        }

        console.log("[RESERVE] Seat reserved successfully:", { seatNumber, userId });
        return res.json({ message: "Seat reserved", seatNumber, reservedAt: new Date() });
    } catch (err) {
        console.error("reserveSeat error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// ----------------- RELEASE SEAT -----------------
exports.releaseSeat = async (req, res) => {
    try {
        const { showId } = req.params;
        const { seatNumber } = req.body;
        const userId = req.user._id;

        console.log(`\n[RELEASE] User ${userId} releasing seat ${seatNumber} for show ${showId}`);

        if (!seatNumber) return res.status(400).json({ message: "seatNumber required" });

        const updated = await Show.findOneAndUpdate(
            { _id: showId },
            { $pull: { reservedSeats: { seatNumber: seatNumber, user: new ObjectId(userId) } } },
            { new: true }
        );

        if (!updated) {
            console.warn("[RELEASE] Show not found or seat not reserved by user");
            return res.status(404).json({ message: "Show not found or seat not reserved by you" });
        }

        console.log("[RELEASE] Seat released:", { seatNumber, userId });
        return res.json({ message: "Seat released", seatNumber });
    } catch (err) {
        console.error("releaseSeat error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


// controllers/reservationController.js

exports.releaseAllUserSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const userId = req.user._id;
    console.log(`\n[RELEASE-ALL] User ${userId} releasing all reserved seats for show ${showId}`);

    const updated = await Show.findOneAndUpdate(
      { _id: showId },
      { $pull: { reservedSeats: { user: userId } } },
      { new: true }
    );

    return res.json({ message: "All your reserved seats released" });
  } catch (err) {
    console.error("releaseAllUserSeats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ----------------- BOOK SEATS -----------------
exports.bookSeats = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { showId } = req.params;
        const { seats } = req.body;
        const userId = req.user._id;

        console.log(`\n[BOOK] User ${userId} attempting to book seats ${JSON.stringify(seats)} for show ${showId}`);

        if (!Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ message: "No seats provided" });
        }
        if (seats.length > 6) {
            return res.status(400).json({ message: "Cannot book more than 6 seats at once" });
        }

        const cutoff = new Date(Date.now() - RESERVATION_TTL_MS);
        console.log("[BOOK] Cleaning expired reservations before booking...");
        await Show.updateOne(
            { _id: showId },
            { $pull: { reservedSeats: { reservedAt: { $lt: cutoff } } } }
        ).session(session);

        const show = await Show.findById(showId).session(session);
        if (!show) {
            console.warn("[BOOK] Show not found:", showId);
            return res.status(404).json({ message: "Show not found" });
        }

        const now = new Date();
        const reservedByUser = show.reservedSeats.filter(
            r => String(r.user) === String(userId) && (now - r.reservedAt) < RESERVATION_TTL_MS
        );
        const reservedSeatNumbers = reservedByUser.map(r => r.seatNumber);
        const missing = seats.filter(s => reservedSeatNumbers.indexOf(s) === -1);

        if (missing.length > 0) {
            console.warn("[BOOK] Some seats missing/expired:", missing);
            return res.status(409).json({ message: "Some seats are not reserved by you or expired", seats: missing });
        }

        const alreadyBooked = seats.filter(s => show.bookedSeats.some(b => b.seatNumber === s));
        if (alreadyBooked.length > 0) {
            console.warn("[BOOK] Some seats already booked:", alreadyBooked);
            return res.status(409).json({ message: "Some seats already booked", seats: alreadyBooked });
        }

        console.log("[BOOK] Moving seats from reserved -> booked...");
        const bookedPush = seats.map(s => ({ seatNumber: s }));
        await Show.updateOne(
            { _id: showId },
            {
                $push: { bookedSeats: { $each: bookedPush } },
                $pull: { reservedSeats: { user: new ObjectId(userId), seatNumber: { $in: seats } } }
            }
        ).session(session);

        console.log("[BOOK] Creating booking record...");
        const booking = await Booking.create(
            [{ user: userId, show: showId, seats }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        console.log("[BOOK] Booking confirmed:", booking[0]);
        return res.status(201).json({ message: "Booking confirmed", booking: booking[0] });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("bookSeats error:", err);
        return res.status(500).json({ message: err.message || "Booking failed" });
    }
};
