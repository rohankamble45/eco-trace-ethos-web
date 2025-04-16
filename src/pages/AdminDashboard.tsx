
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { 
  getMaterials, 
  getCarbonCredits,
  updateCarbonCreditStatus,
  getStats,
  formatMaterialType,
  Material, 
  CarbonCredit,
  createUser
} from '../services/mockDataService';
import { 
  BarChart, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  FileCheck,
  Truck,
  Factory,
  ListChecks
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingCredits, setPendingCredits] = useState<(CarbonCredit & { material?: Material })[]>([]);
  const [approvedCredits, setApprovedCredits] = useState<(CarbonCredit & { material?: Material })[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get mock user ID
  const getMockUserId = () => {
    if (!user) return '';
    const mockUser = createUser(user.username, user.role);
    return mockUser.id;
  };
  
  const adminId = getMockUserId();

  // Load data
  useEffect(() => {
    // Get all materials and credits
    const allMaterials = getMaterials();
    const pendingCarbonCredits = getCarbonCredits({ approved: false });
    const approvedCarbonCredits = getCarbonCredits({ approved: true });
    
    // Enrich carbon credits with material data
    const enrichedPendingCredits = pendingCarbonCredits.map(credit => {
      const material = allMaterials.find(m => m.id === credit.materialId);
      return { ...credit, material };
    });
    
    const enrichedApprovedCredits = approvedCarbonCredits.map(credit => {
      const material = allMaterials.find(m => m.id === credit.materialId);
      return { ...credit, material };
    });
    
    setPendingCredits(enrichedPendingCredits);
    setApprovedCredits(enrichedApprovedCredits);
    
    // Get statistics
    setStats(getStats());
  }, []);

  const handleApprove = (creditId: string) => {
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const updatedCredit = updateCarbonCreditStatus(creditId, true, adminId);
      
      if (updatedCredit) {
        // Find the credit in pending list
        const creditIndex = pendingCredits.findIndex(c => c.id === creditId);
        if (creditIndex !== -1) {
          const approvedCredit = { ...pendingCredits[creditIndex], ...updatedCredit };
          
          // Move from pending to approved
          setPendingCredits(prev => prev.filter(c => c.id !== creditId));
          setApprovedCredits(prev => [approvedCredit, ...prev]);
          
          // Update stats
          setStats(getStats());
          
          setSuccessMessage('Carbon credit approved successfully!');
        }
      }
      
      setIsSubmitting(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };

  const handleReject = (creditId: string) => {
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const updatedCredit = updateCarbonCreditStatus(creditId, false, adminId);
      
      if (updatedCredit) {
        // Remove from pending list
        setPendingCredits(prev => prev.filter(c => c.id !== creditId));
        
        // Update stats
        setStats(getStats());
        
        setSuccessMessage('Carbon credit rejected successfully!');
      }
      
      setIsSubmitting(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!stats) return [];
    
    return [
      {
        name: 'Total Materials',
        value: stats.totalMaterials,
        fill: '#2C7D41',
      },
      {
        name: 'In Transit',
        value: stats.materialsInTransit,
        fill: '#FFC107',
      },
      {
        name: 'Verified',
        value: stats.materialsVerified,
        fill: '#5CA0D3',
      },
      {
        name: 'Approved',
        value: stats.materialsApproved,
        fill: '#4CAF50',
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Government/Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Monitor and approve carbon credits in the supply chain</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 animate-fade-in" role="alert">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="eco-card">
              <div className="flex items-start">
                <div className="p-3 bg-eco-primary/10 rounded-full">
                  <FileCheck className="h-6 w-6 text-eco-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Materials</h3>
                  <p className="text-2xl font-bold text-eco-primary">{stats.totalMaterials}</p>
                </div>
              </div>
            </div>
            
            <div className="eco-card">
              <div className="flex items-start">
                <div className="p-3 bg-eco-accent/10 rounded-full">
                  <Truck className="h-6 w-6 text-eco-accent" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-700">In Transit</h3>
                  <p className="text-2xl font-bold text-eco-accent">{stats.materialsInTransit}</p>
                </div>
              </div>
            </div>
            
            <div className="eco-card">
              <div className="flex items-start">
                <div className="p-3 bg-eco-secondary/10 rounded-full">
                  <Factory className="h-6 w-6 text-eco-secondary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-700">Verified</h3>
                  <p className="text-2xl font-bold text-eco-secondary">{stats.materialsVerified}</p>
                </div>
              </div>
            </div>
            
            <div className="eco-card">
              <div className="flex items-start">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-700">Carbon Credits</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedCarbonCredits.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="eco-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Supply Chain Overview</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <BarChart className="h-4 w-4 mr-1" />
                  <span>Material Status Chart</span>
                </div>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={prepareChartData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 50,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="eco-card h-full">
              <h2 className="text-xl font-semibold mb-6">Credit Distribution</h2>
              
              {stats && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 mb-2">Total Carbon Credits</h3>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-eco-primary">{stats.totalCarbonCredits.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        credits from {stats.materialsVerified + stats.materialsApproved} materials
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-eco-primary h-2.5 rounded-full" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 mb-2">Approved Credits</h3>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-green-600">{stats.approvedCarbonCredits.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        {(stats.approvedCarbonCredits / stats.totalCarbonCredits * 100).toFixed(1)}% of total credits
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${stats.approvedCarbonCredits / stats.totalCarbonCredits * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 mb-2">Pending Approval</h3>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-eco-accent">
                        {(stats.totalCarbonCredits - stats.approvedCarbonCredits).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        from {pendingCredits.length} pending materials
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-eco-accent h-2.5 rounded-full" 
                        style={{ width: `${(stats.totalCarbonCredits - stats.approvedCarbonCredits) / stats.totalCarbonCredits * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6">
          <div className="eco-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Pending Credit Approval</h2>
              <div className="flex items-center text-sm text-gray-500">
                <ListChecks className="h-4 w-4 mr-1" />
                <span>{pendingCredits.length} Waiting for Approval</span>
              </div>
            </div>
            
            {pendingCredits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending carbon credits to approve.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="eco-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="eco-table-header">Material</th>
                      <th className="eco-table-header">Verified Weight</th>
                      <th className="eco-table-header">Carbon Credits</th>
                      <th className="eco-table-header">Status</th>
                      <th className="eco-table-header">Date</th>
                      <th className="eco-table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingCredits.map((credit) => (
                      <tr key={credit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="eco-table-cell font-medium text-gray-900">
                          {credit.material ? formatMaterialType(credit.material.materialType) : "Unknown"}
                        </td>
                        <td className="eco-table-cell">
                          {credit.material?.verifiedWeight?.toLocaleString() || "N/A"} kg
                        </td>
                        <td className="eco-table-cell font-semibold text-eco-primary">
                          {credit.creditValue.toFixed(2)}
                        </td>
                        <td className="eco-table-cell">
                          {credit.material && <StatusBadge status={credit.material.status} />}
                        </td>
                        <td className="eco-table-cell">
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {new Date(credit.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="eco-table-cell">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(credit.id)}
                              disabled={isSubmitting}
                              className="text-green-600 hover:text-green-800 transition-colors"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(credit.id)}
                              disabled={isSubmitting}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="eco-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Approved Credits History</h2>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                <span>{approvedCredits.length} Approved</span>
              </div>
            </div>
            
            {approvedCredits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No carbon credits have been approved yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="eco-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="eco-table-header">Material</th>
                      <th className="eco-table-header">Verified Weight</th>
                      <th className="eco-table-header">Carbon Credits</th>
                      <th className="eco-table-header">Status</th>
                      <th className="eco-table-header">Approval Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {approvedCredits.map((credit) => (
                      <tr key={credit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="eco-table-cell font-medium text-gray-900">
                          {credit.material ? formatMaterialType(credit.material.materialType) : "Unknown"}
                        </td>
                        <td className="eco-table-cell">
                          {credit.material?.verifiedWeight?.toLocaleString() || "N/A"} kg
                        </td>
                        <td className="eco-table-cell font-semibold text-green-600">
                          {credit.creditValue.toFixed(2)}
                        </td>
                        <td className="eco-table-cell">
                          {credit.material && <StatusBadge status={credit.material.status} />}
                        </td>
                        <td className="eco-table-cell">
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {new Date(credit.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
