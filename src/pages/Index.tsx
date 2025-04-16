
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  // If the user is authenticated, redirect to the appropriate dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case "farmer":
        return <Navigate to="/farmer" replace />;
      case "transporter":
        return <Navigate to="/transporter" replace />;
      case "plant":
        return <Navigate to="/plant" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      default:
        // If the role is not recognized, show the login page
        return <Login />;
    }
  }

  // If not authenticated, show the login page
  return <Login />;
};

export default Index;
