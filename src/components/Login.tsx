
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, signup, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'transporter' | 'plant' | 'admin'>('farmer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password, role);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="eco-card bg-white/10 backdrop-blur-lg border border-white/20 shadow-glow p-8 rounded-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-eco-primary rounded-full mb-4 animate-pulse-slow">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-eco-dark">EcoTrace Ethos</h1>
            <p className="text-gray-600 mt-2">Carbon Footprint Tracking for Ethanol Production</p>
          </div>
          
          {error && (
            <div className="bg-red-100/80 backdrop-blur-sm border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="eco-label block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="eco-input w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-md focus:ring-eco-primary focus:border-eco-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="eco-label block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="eco-input w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-md focus:ring-eco-primary focus:border-eco-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            
            {!isLoginMode && (
              <div>
                <label htmlFor="role" className="eco-label block text-sm font-medium text-gray-700">
                  Select Role
                </label>
                <select
                  id="role"
                  className="eco-input w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-md focus:ring-eco-primary focus:border-eco-primary"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="farmer">Farmer</option>
                  <option value="transporter">Transporter</option>
                  <option value="plant">Ethanol Plant</option>
                  <option value="admin">Government/Admin</option>
                </select>
              </div>
            )}
            
            <div className="pt-4">
              <button 
                type="submit" 
                className="eco-button w-full bg-eco-primary hover:bg-eco-primary/80 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : isLoginMode ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-eco-primary hover:text-eco-primary/80 underline transition-colors"
            >
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For testing: Create an account or use the app as a demo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
