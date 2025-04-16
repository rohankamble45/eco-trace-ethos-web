
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  // Dynamic background elements
  const circles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className={`
        fixed w-${Math.floor(Math.random() * 32) + 8} h-${Math.floor(Math.random() * 32) + 8}
        rounded-full bg-eco-primary/5 animate-float
        left-[${Math.random() * 100}%] top-[${Math.random() * 100}%]
        blur-xl
      `}
      style={{
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${6 + Math.random() * 4}s`
      }}
    />
  ));

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
        return <Login />;
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-grid opacity-20" />
      
      {/* Floating circles */}
      {circles}
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Content */}
      <div className="relative z-10">
        <Login />
      </div>
    </div>
  );
};

export default Index;
