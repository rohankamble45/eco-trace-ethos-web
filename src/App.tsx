
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
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { isAuthenticated, isLoading, getUserRole } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse-slow text-eco-primary">Loading...</div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to the user's correct dashboard
    switch(userRole) {
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
            <Route path="/" element={<Index />} />
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
