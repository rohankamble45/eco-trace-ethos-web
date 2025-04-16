import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { 
  getMaterials, 
  verifyMaterial, 
  formatMaterialType,
  Material, 
  createUser
} from '../services/mockDataService';
import { Clock, MapPin, Factory, Scale } from 'lucide-react';

const PlantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [inTransitMaterials, setInTransitMaterials] = useState<Material[]>([]);
  const [verifiedMaterials, setVerifiedMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [verifiedWeight, setVerifiedWeight] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update getMockUserId to use email
  const getMockUserId = () => {
    if (!user?.email) return '';
    const mockUser = createUser(user.email, 'plant');
    return mockUser.id;
  };
  
  const plantId = getMockUserId();

  // Load materials
  useEffect(() => {
    const materialsInTransit = getMaterials({ status: 'in-transit' });
    setInTransitMaterials(materialsInTransit);
    
    const plantVerifiedMaterials = getMaterials({ plantId });
    setVerifiedMaterials(plantVerifiedMaterials);
  }, [plantId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMaterialId) {
      setErrorMessage('Please select a material');
      return;
    }
    
    if (!verifiedWeight || isNaN(Number(verifiedWeight)) || Number(verifiedWeight) <= 0) {
      setErrorMessage('Please enter a valid weight');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Simulate network delay
    setTimeout(() => {
      const updatedMaterial = verifyMaterial(
        selectedMaterialId,
        plantId,
        Number(verifiedWeight)
      );
      
      if (updatedMaterial) {
        // Remove from in-transit materials
        setInTransitMaterials(prevMaterials => 
          prevMaterials.filter(m => m.id !== selectedMaterialId)
        );
        
        // Add to verified materials
        setVerifiedMaterials(prevMaterials => [updatedMaterial, ...prevMaterials]);
        
        setSuccessMessage('Material verified successfully!');
        setSelectedMaterialId('');
        setVerifiedWeight('');
      } else {
        setErrorMessage('Failed to verify material');
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
            <h1 className="text-2xl font-bold text-gray-900">Ethanol Plant Dashboard</h1>
            <p className="text-sm text-gray-600">Verify material deliveries and manage processing</p>
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
              <h2 className="text-xl font-semibold mb-4">Verify Material Delivery</h2>
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
                    <option value="">Select a material to verify</option>
                    {inTransitMaterials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {formatMaterialType(material.materialType)} - {material.weight}kg
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="verifiedWeight" className="eco-label">
                    Verified Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="verifiedWeight"
                    className="eco-input w-full"
                    placeholder="Enter verified weight"
                    value={verifiedWeight}
                    onChange={(e) => setVerifiedWeight(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="eco-button w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="eco-card">
              <h2 className="text-xl font-semibold mb-4">Materials Awaiting Verification</h2>
              
              {inTransitMaterials.length === 0 ? (
                <div className="text-center py-8">
                  <Factory className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-4">No materials in transit to verify.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="eco-table">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="eco-table-header">Material</th>
                        <th className="eco-table-header">Claimed Weight (kg)</th>
                        <th className="eco-table-header">Status</th>
                        <th className="eco-table-header">Location</th>
                        <th className="eco-table-header">QR Code</th>
                        <th className="eco-table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inTransitMaterials.map((material) => (
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
                          <td className="eco-table-cell">
                            <button
                              onClick={() => {
                                setSelectedMaterialId(material.id);
                                setVerifiedWeight(material.weight.toString());
                              }}
                              className="text-eco-primary hover:text-eco-primary/80 font-medium"
                            >
                              Verify
                            </button>
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
            <h2 className="text-xl font-semibold mb-4">Verified Materials</h2>
            
            {verifiedMaterials.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No materials have been verified yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="eco-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="eco-table-header">Material</th>
                      <th className="eco-table-header">Original Weight (kg)</th>
                      <th className="eco-table-header">Verified Weight (kg)</th>
                      <th className="eco-table-header">Status</th>
                      <th className="eco-table-header">Verification Date</th>
                      <th className="eco-table-header">Carbon Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {verifiedMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                        <td className="eco-table-cell font-medium text-gray-900">
                          {formatMaterialType(material.materialType)}
                        </td>
                        <td className="eco-table-cell">{material.weight.toLocaleString()}</td>
                        <td className="eco-table-cell">
                          <div className="flex items-center">
                            <Scale className="h-3.5 w-3.5 mr-1 text-eco-primary" />
                            <span className="font-medium">
                              {material.verifiedWeight?.toLocaleString() || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="eco-table-cell">
                          <StatusBadge status={material.status} />
                        </td>
                        <td className="eco-table-cell">
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {new Date(material.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="eco-table-cell">
                          {material.verifiedWeight ? (
                            <span className="font-medium text-eco-secondary">
                              {(material.verifiedWeight * 0.8).toFixed(2)}
                            </span>
                          ) : (
                            "Pending"
                          )}
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

export default PlantDashboard;
