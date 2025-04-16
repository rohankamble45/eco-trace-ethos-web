
import React, { useState } from 'react';

interface MaterialRegistrationFormProps {
  onSubmit: (materialData: {
    materialType: string;
    weight: number;
    location: string;
  }) => void;
}

const MaterialRegistrationForm: React.FC<MaterialRegistrationFormProps> = ({ onSubmit }) => {
  const [materialType, setMaterialType] = useState('');
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{
    materialType?: string;
    weight?: string;
    location?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      materialType?: string;
      weight?: string;
      location?: string;
    } = {};
    let isValid = true;

    if (!materialType) {
      newErrors.materialType = 'Material type is required';
      isValid = false;
    }

    if (!weight) {
      newErrors.weight = 'Weight is required';
      isValid = false;
    } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
      newErrors.weight = 'Weight must be a positive number';
      isValid = false;
    }

    if (!location) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        materialType,
        weight: Number(weight),
        location,
      });
      // Reset form
      setMaterialType('');
      setWeight('');
      setLocation('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="materialType" className="eco-label text-black">
          Material Type
        </label>
        <select
          id="materialType"
          className={`eco-input w-full text-black ${errors.materialType ? 'border-red-500' : ''}`}
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
        >
          <option value="">Select Material Type</option>
          <option value="corn_stover">Corn Stover</option>
          <option value="wheat_straw">Wheat Straw</option>
          <option value="sugarcane_bagasse">Sugarcane Bagasse</option>
          <option value="rice_husks">Rice Husks</option>
          <option value="wood_chips">Wood Chips</option>
        </select>
        {errors.materialType && (
          <p className="mt-1 text-sm text-red-600">{errors.materialType}</p>
        )}
      </div>

      <div>
        <label htmlFor="weight" className="eco-label text-black">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          className={`eco-input w-full text-black ${errors.weight ? 'border-red-500' : ''}`}
          placeholder="Enter weight in kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          min="0"
          step="0.01"
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="eco-label text-black">
          Location
        </label>
        <input
          type="text"
          id="location"
          className={`eco-input w-full text-black ${errors.location ? 'border-red-500' : ''}`}
          placeholder="Enter location (e.g., Latitude, Longitude or Address)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      <div className="pt-2">
        <button type="submit" className="eco-button w-full">
          Register Material
        </button>
      </div>
    </form>
  );
};

export default MaterialRegistrationForm;
