import * as jwt_decode from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  let user;
  try {
    user = jwt_decode.default(token); // <-- note the .default here
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
