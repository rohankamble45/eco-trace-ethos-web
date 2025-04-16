
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Leaf, 
  LogOut, 
  User, 
  Truck, 
  Factory, 
  BarChart4,
  Menu,
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/';
    
    switch(user.role) {
      case 'farmer':
        return '/farmer';
      case 'transporter':
        return '/transporter';
      case 'plant':
        return '/plant';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  // Get icon based on user role
  const getRoleIcon = () => {
    if (!user) return <User className="h-5 w-5" />;
    
    switch(user.role) {
      case 'farmer':
        return <User className="h-5 w-5" />;
      case 'transporter':
        return <Truck className="h-5 w-5" />;
      case 'plant':
        return <Factory className="h-5 w-5" />;
      case 'admin':
        return <BarChart4 className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  return (
    <nav className="bg-eco-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Leaf className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-semibold text-lg">EcoTrace</span>
            </Link>
          </div>
          
          {user && (
            <>
              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to={getDashboardRoute()} 
                  className="text-white hover:bg-eco-primary/80 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="text-white mr-2">{user.username}</span>
                    <div className="bg-eco-accent rounded-full p-1">
                      {getRoleIcon()}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="text-white hover:bg-eco-primary/80 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  className="text-white hover:bg-eco-primary/80 p-2 rounded-md"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-eco-primary/95 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to={getDashboardRoute()}
              className="text-white hover:bg-eco-primary/80 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            <div className="flex items-center px-3 py-2 text-white">
              <span className="mr-2">{user.username}</span>
              <div className="bg-eco-accent rounded-full p-1">
                {getRoleIcon()}
              </div>
            </div>
            
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="text-white hover:bg-eco-primary/80 w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
