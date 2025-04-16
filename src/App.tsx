
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import TransporterDashboard from "./pages/TransporterDashboard";
import PlantDashboard from "./pages/PlantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to the user's correct dashboard
    switch(user.role) {
      case 'farmer':
        return <Navigate to="/farmer" replace />;
      case 'transporter':
        return <Navigate to="/transporter" replace />;
      case 'plant':
        return <Navigate to="/plant" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/farmer" 
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transporter" 
              element={
                <ProtectedRoute allowedRoles={['transporter']}>
                  <TransporterDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/plant" 
              element={
                <ProtectedRoute allowedRoles={['plant']}>
                  <PlantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
