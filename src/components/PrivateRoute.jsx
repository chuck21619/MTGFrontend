import { Navigate } from "react-router-dom";

export default function PrivateRoute({ accessToken, children }) {
  return accessToken ? children : <Navigate to="/login" />;
}
