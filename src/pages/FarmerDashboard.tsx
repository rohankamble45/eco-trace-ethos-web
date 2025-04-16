
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import MaterialRegistrationForm from '../components/MaterialRegistrationForm';
import QRCodeDisplay from '../components/QRCodeDisplay';
import StatusBadge from '../components/StatusBadge';
import { 
  registerMaterial, 
  getMaterials, 
  formatMaterialType,
  Material, 
  createUser
} from '../services/mockDataService';
import { Clock } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get mock user ID
  const getMockUserId = () => {
    if (!user) return '';
    const mockUser = createUser(user.username, user.role);
    return mockUser.id;
  };
  
  const farmerId = getMockUserId();

  // Load materials
  useEffect(() => {
    if (farmerId) {
      const farmerMaterials = getMaterials({ farmerId });
      setMaterials(farmerMaterials);
    }
  }, [farmerId]);

  const handleMaterialSubmit = (materialData: {
    materialType: string;
    weight: number;
    location: string;
  }) => {
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newMaterial = registerMaterial(
        materialData.materialType,
        materialData.weight,
        materialData.location,
        farmerId
      );
      
      setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
      setSuccessMessage('Material registered successfully!');
      setIsSubmitting(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
            <p className="text-sm text-gray-600">Register and track agricultural waste materials</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 animate-fade-in" role="alert">
            <p>{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="eco-card">
              <h2 className="text-xl font-semibold mb-4">Register New Material</h2>
              <MaterialRegistrationForm onSubmit={handleMaterialSubmit} />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="eco-card">
              <h2 className="text-xl font-semibold mb-4">My Materials</h2>
              
              {materials.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No materials registered yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Use the form to register your first material.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="eco-table">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="eco-table-header">Material</th>
                        <th className="eco-table-header">Weight (kg)</th>
                        <th className="eco-table-header">Status</th>
                        <th className="eco-table-header">Date</th>
                        <th className="eco-table-header">QR Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {materials.map((material) => (
                        <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                          <td className="eco-table-cell font-medium text-gray-900">
                            {formatMaterialType(material.materialType)}
                          </td>
                          <td className="eco-table-cell">
                            {material.weight.toLocaleString()}
                            {material.verifiedWeight !== undefined && (
                              <span className="text-xs text-gray-500 block">
                                Verified: {material.verifiedWeight.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="eco-table-cell">
                            <StatusBadge status={material.status} />
                          </td>
                          <td className="eco-table-cell">
                            <div className="flex items-center text-gray-500">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {new Date(material.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="eco-table-cell">
                            <QRCodeDisplay value={material.qrId} size={80} />
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
    </div>
  );
};

export default FarmerDashboard;
