
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  username: string;
  role: 'farmer' | 'transporter' | 'plant' | 'admin';
};

type AuthContextType = {
  user: User | null;
  login: (username: string, role: 'farmer' | 'transporter' | 'plant' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('ecoTraceUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('ecoTraceUser');
      }
    }
  }, []);

  const login = (username: string, role: 'farmer' | 'transporter' | 'plant' | 'admin') => {
    const newUser = { username, role };
    localStorage.setItem('ecoTraceUser', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('ecoTraceUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
