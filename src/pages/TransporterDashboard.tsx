
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { 
  getMaterials, 
  updateTransportation, 
  formatMaterialType,
  Material, 
  createUser,
  UserRole
} from '../services/mockDataService';
import { Clock, MapPin, Truck } from 'lucide-react';

const TransporterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignedMaterials, setAssignedMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update getMockUserId to use email
  const getMockUserId = () => {
    if (!user?.email) return '';
    const mockUser = createUser(user.email, 'transporter' as UserRole);
    return mockUser.id;
  };
  
  const transporterId = getMockUserId();

  // Load materials
  useEffect(() => {
    const registeredMaterials = getMaterials({ status: 'registered' });
    setMaterials(registeredMaterials);
    
    const transporterMaterials = getMaterials({ transporterId });
    setAssignedMaterials(transporterMaterials);
  }, [transporterId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMaterialId) {
      setErrorMessage('Please select a material');
      return;
    }
    
    if (!location) {
      setErrorMessage('Please enter current location');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Simulate network delay
    setTimeout(() => {
      const updatedMaterial = updateTransportation(
        selectedMaterialId,
        transporterId,
        location
      );
      
      if (updatedMaterial) {
        // Remove from available materials
        setMaterials(prevMaterials => 
          prevMaterials.filter(m => m.id !== selectedMaterialId)
        );
        
        // Add to assigned materials
        setAssignedMaterials(prevMaterials => [updatedMaterial, ...prevMaterials]);
        
        setSuccessMessage('Transportation updated successfully!');
        setSelectedMaterialId('');
        setLocation('');
      } else {
        setErrorMessage('Failed to update transportation');
      }
      
      setIsSubmitting(false);
      
      // Clear success message after 3 seconds
      if (!errorMessage) {
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transporter Dashboard</h1>
            <p className="text-sm text-gray-600">Manage material transportation and updates</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 animate-fade-in" role="alert">
            <p>{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 animate-fade-in" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="eco-card">
              <h2 className="text-xl font-semibold mb-4">Update Transportation</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="materialId" className="eco-label">
                    Select Material
                  </label>
                  <select
                    id="materialId"
                    className="eco-input w-full"
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                  >
                    <option value="">Select a material to transport</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {formatMaterialType(material.materialType)} - {material.weight}kg
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="eco-label">
                    Current Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="eco-input w-full"
                    placeholder="Enter current location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="eco-button w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Transportation'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="eco-card">
              <h2 className="text-xl font-semibold mb-4">My Assigned Transports</h2>
              
              {assignedMaterials.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-4">No materials assigned for transport.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Select a material from the available list to begin transportation.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="eco-table">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="eco-table-header">Material</th>
                        <th className="eco-table-header">Weight (kg)</th>
                        <th className="eco-table-header">Status</th>
                        <th className="eco-table-header">Location</th>
                        <th className="eco-table-header">QR Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assignedMaterials.map((material) => (
                        <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                          <td className="eco-table-cell font-medium text-gray-900">
                            {formatMaterialType(material.materialType)}
                          </td>
                          <td className="eco-table-cell">{material.weight.toLocaleString()}</td>
                          <td className="eco-table-cell">
                            <StatusBadge status={material.status} />
                          </td>
                          <td className="eco-table-cell">
                            <div className="flex items-center text-gray-500">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span className="text-sm">{material.location}</span>
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
        
        <div className="mt-6">
          <div className="eco-card">
            <h2 className="text-xl font-semibold mb-4">Available Materials for Transport</h2>
            
            {materials.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No materials available for transport.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="eco-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="eco-table-header">Material</th>
                      <th className="eco-table-header">Weight (kg)</th>
                      <th className="eco-table-header">Status</th>
                      <th className="eco-table-header">Date Registered</th>
                      <th className="eco-table-header">Origin Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {materials.map((material) => (
                      <tr 
                        key={material.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedMaterialId(material.id);
                          setLocation(material.location);
                        }}
                      >
                        <td className="eco-table-cell font-medium text-gray-900">
                          {formatMaterialType(material.materialType)}
                        </td>
                        <td className="eco-table-cell">{material.weight.toLocaleString()}</td>
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
                          <div className="flex items-center text-gray-500">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span className="text-sm">{material.location}</span>
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

export default TransporterDashboard;
