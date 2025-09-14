# 🎬 Movie Booking App

## Project Overview
This is a **Movie Booking Web Application** where users can browse movies, select cinemas and showtimes, choose seats, and book tickets online.  
Admins can manage movies, cinemas, and show schedules.  
The app simulates a real-world movie booking system with features like seat reservation, booking history, and admin control.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Workflow](#workflow)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Sample Data](#sample-data)
- [Screenshots / Demo](#screenshots--demo)
- [Future Improvements](#future-improvements)
- [Author](#author)

---



## Features

**User Features:**  
- Browse cinemas and movies  
- View showtimes and available seats  
- Select and book seats (up to 6 per booking)  
- View booking history  

**Admin Features:**  
- Add, update, and delete movies  
- Add, update, and delete cinemas  
- Schedule and manage shows with cinema, screen, and start time  
- View all bookings  

---

## Workflow

**User Workflow:**  
1. Open the app → browse cinemas → select cinema  
2. Choose a movie → select showtime  
3. Pick seats → book tickets → view booking history  

**Admin Workflow:**  
1. Login as admin  
2. Add/Update/Delete movies and cinemas  
3. Schedule shows with screen and time  
4. View all bookings  

---


## Tech Stack
- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **API Calls:** Axios  
- **Routing:** React Router  
---

## Database Schema

![Database Schema](./assets/schema.png)


### Users
| Field | Type | Description |
|-------|------|-------------|
| name | String | User's name (required) |
| email | String | User's email (required, unique) |
| password | String | User password (required) |
| role | String | "user" or "admin" (default: "user") |
| createdAt / updatedAt | Date | Auto timestamps |

### Movies
| Field | Type | Description |
|-------|------|-------------|
| title | String | Movie title (required) |
| description | String | Movie description |
| duration | Number | Duration in minutes |
| language | String | Language of movie |
| genre | String | Movie genre |
| releaseDate | Date | Release date of movie |
| posterUrl | String | URL of movie poster |

### Cinemas
| Field | Type | Description |
|-------|------|-------------|
| name | String | Cinema name (required) |
| location | String | Cinema location (required) |
| numberOfScreens | Number | Total screens in cinema (min 1, required) |

### Shows
| Field | Type | Description |
|-------|------|-------------|
| cinemaId | ObjectId | Reference to Cinema (required) |
| movieId | ObjectId | Reference to Movie (required) |
| screenNumber | Number | Screen number in cinema (required) |
| startTime | Date | Start time of show (required) |
| bookedSeats | Array | Array of booked seat numbers |
| reservedSeats | Array | Array of seat objects with user reference and reservedAt timestamp |

**Seat Object (for reservedSeats)**
| Field | Type | Description |
|-------|------|-------------|
| seatNumber | Number | Seat number |
| user | ObjectId | User who reserved |
| reservedAt | Date | Timestamp of reservation |

### Bookings
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Reference to User (required) |
| show | ObjectId | Reference to Show (required) |
| seats | Array | Array of seat numbers booked |
| createdAt | Date | Booking timestamp |

---

## Setup Instructions
1. **Clone the repository**  
`git clone https://github.com/ashutosh-3474/ticket_booking.git`  
`cd <ticket_booking>`  

2. **Install Backend dependencies**  
`cd backend`  
`npm install`  

3. **Install Frontend dependencies**  
`cd ../frontend`  
`npm install`  

4. **Setup Environment Variables** (see next section)  

5. **Run the backend**  
`cd ../backend`  
`npm run dev`  
Backend will be running at: http://localhost:5000

6. **Run the frontend**  
`cd ../frontend`  
`npm run dev`  
Frontend will be running at: http://localhost:5173

7. **Open in browser**  
`http://localhost:5173`



---

## Environment Variables
**Backend (`/backend/.env`):**  
`PORT=5000`  
`MONGO_URI=<your mongoDB URL>`  
`JWT_SECRET=your_jwt_secret`  

**Frontend (`/frontend/.env`):**  
`VITE_API_BASE_URL=http://localhost:5000/api`  

---

## Sample Data

**Movies:**  
```json
[
  { "title": "Avengers", "duration": 180, "language": "English", "genre": "Action" },
  { "title": "Inception", "duration": 150, "language": "English", "genre": "Sci-Fi" }
]
```
**Cinemas:**

```json
[
  { "name": "PVR Cinemas", "location": "Mumbai", "numberOfScreens": 6 },
  { "name": "Cinepolis", "location": "Delhi", "numberOfScreens": 4 }
]
```
## Shows

```json
[
  {
    "cinemaId": "<cinema_id>",
    "movieId": "<movie_id>",
    "screenNumber": 1,
    "startTime": "2025-09-14T18:00:00.000Z",
    "bookedSeats": [],
    "reservedSeats": []
  }
]
```
## Screenshots / Demo
*(Add screenshots of key pages: Home, Seat Selection, Admin Dashboard, Booking History)*

## Future Improvements
- Payment integration (Razorpay/Stripe)
- Email/SMS booking confirmation
- Enhanced UI for seat layout visualization
- Movie ratings and reviews

## Author
**Ashutosh Mishra**  
Email: [ashutosh.2201062cs@iiitbh.ac.in](mailto:ashutosh.2201062cs@iiitbh.ac.in)  
GitHub: [https://github.com/ashutosh-3474](https://github.com/ashutosh-3474)

