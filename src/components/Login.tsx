
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Leaf } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'farmer' | 'transporter' | 'plant' | 'admin'>('farmer');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    login(username, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="eco-card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-eco-primary rounded-full mb-4">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-eco-dark">EcoTrace Ethos</h1>
            <p className="text-gray-600 mt-2">Carbon Footprint Tracking for Ethanol Production</p>
          </div>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="eco-label">Username</label>
              <input
                type="text"
                id="username"
                className="eco-input w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="eco-label">Select Role</label>
              <select
                id="role"
                className="eco-input w-full"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="farmer">Farmer</option>
                <option value="transporter">Transporter</option>
                <option value="plant">Ethanol Plant</option>
                <option value="admin">Government/Admin</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button type="submit" className="eco-button w-full">
                Login
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo access: Use any username and select a role</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
