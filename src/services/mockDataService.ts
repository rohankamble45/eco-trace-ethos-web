// Mock data service
// This simulates the data that would come from a backend API

export type MaterialStatus = 'registered' | 'in-transit' | 'verified' | 'approved' | 'rejected';

export interface Material {
  id: string;
  materialType: string;
  weight: number;
  verifiedWeight?: number;
  status: MaterialStatus;
  location: string;
  qrId: string;
  farmerId: string;
  transporterId?: string;
  plantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarbonCredit {
  id: string;
  materialId: string;
  creditValue: number;
  approved: boolean;
  adminId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'farmer' | 'transporter' | 'plant' | 'admin';

export interface User {
  id: string;
  email: string;  // Changed from username to match Supabase auth schema
  role: UserRole;
}

// In-memory storage
let materials: Material[] = [];
let carbonCredits: CarbonCredit[] = [];
let users: User[] = [];

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Convert material type to a readable format
export const formatMaterialType = (type: string): string => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Mock user creation/login
export const createUser = (email: string, role: UserRole): User => {
  const existingUser = users.find(u => u.email === email && u.role === role);
  
  if (existingUser) {
    return existingUser;
  }
  
  const newUser = {
    id: generateId(),
    email,
    role
  };
  
  users.push(newUser);
  return newUser;
};

// Register a new material (Farmer)
export const registerMaterial = (
  materialType: string,
  weight: number,
  location: string,
  farmerId: string
): Material => {
  const id = generateId();
  const qrId = `ECO-${id.substring(0, 8)}`;
  
  const newMaterial: Material = {
    id,
    materialType,
    weight,
    status: 'registered',
    location,
    qrId,
    farmerId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  materials.push(newMaterial);
  return newMaterial;
};

// Update material transportation details (Transporter)
export const updateTransportation = (
  materialId: string,
  transporterId: string,
  location: string
): Material | null => {
  const materialIndex = materials.findIndex(m => m.id === materialId);
  
  if (materialIndex === -1) {
    return null;
  }
  
  const updatedMaterial = {
    ...materials[materialIndex],
    transporterId,
    location,
    status: 'in-transit' as MaterialStatus,
    updatedAt: new Date()
  };
  
  materials[materialIndex] = updatedMaterial;
  return updatedMaterial;
};

// Verify material at plant (Ethanol Plant)
export const verifyMaterial = (
  materialId: string,
  plantId: string,
  verifiedWeight: number
): Material | null => {
  const materialIndex = materials.findIndex(m => m.id === materialId);
  
  if (materialIndex === -1) {
    return null;
  }
  
  const updatedMaterial = {
    ...materials[materialIndex],
    plantId,
    verifiedWeight,
    status: 'verified' as MaterialStatus,
    updatedAt: new Date()
  };
  
  materials[materialIndex] = updatedMaterial;
  
  // Auto-generate carbon credit
  const creditValue = verifiedWeight * 0.8;
  const newCarbonCredit: CarbonCredit = {
    id: generateId(),
    materialId,
    creditValue,
    approved: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  carbonCredits.push(newCarbonCredit);
  
  return updatedMaterial;
};

// Approve/Reject carbon credits (Admin)
export const updateCarbonCreditStatus = (
  creditId: string,
  approved: boolean,
  adminId: string
): CarbonCredit | null => {
  const creditIndex = carbonCredits.findIndex(c => c.id === creditId);
  
  if (creditIndex === -1) {
    return null;
  }
  
  const updatedCredit = {
    ...carbonCredits[creditIndex],
    approved,
    adminId,
    updatedAt: new Date()
  };
  
  carbonCredits[creditIndex] = updatedCredit;
  
  // Update associated material status
  const materialIndex = materials.findIndex(m => m.id === updatedCredit.materialId);
  if (materialIndex !== -1) {
    materials[materialIndex] = {
      ...materials[materialIndex],
      status: approved ? 'approved' : 'rejected' as MaterialStatus,
      updatedAt: new Date()
    };
  }
  
  return updatedCredit;
};

// Get materials with filters
export const getMaterials = (
  filters?: {
    farmerId?: string;
    transporterId?: string;
    plantId?: string;
    status?: MaterialStatus;
  }
): Material[] => {
  if (!filters) {
    return [...materials];
  }
  
  return materials.filter(material => {
    if (filters.farmerId && material.farmerId !== filters.farmerId) {
      return false;
    }
    if (filters.transporterId && material.transporterId !== filters.transporterId) {
      return false;
    }
    if (filters.plantId && material.plantId !== filters.plantId) {
      return false;
    }
    if (filters.status && material.status !== filters.status) {
      return false;
    }
    return true;
  });
};

// Get single material by ID
export const getMaterialById = (id: string): Material | null => {
  const material = materials.find(m => m.id === id);
  return material || null;
};

// Get carbon credits with filters
export const getCarbonCredits = (
  filters?: {
    materialId?: string;
    approved?: boolean;
    adminId?: string;
  }
): CarbonCredit[] => {
  if (!filters) {
    return [...carbonCredits];
  }
  
  return carbonCredits.filter(credit => {
    if (filters.materialId && credit.materialId !== filters.materialId) {
      return false;
    }
    if (filters.approved !== undefined && credit.approved !== filters.approved) {
      return false;
    }
    if (filters.adminId && credit.adminId !== filters.adminId) {
      return false;
    }
    return true;
  });
};

// Get carbon credit for a material
export const getCarbonCreditForMaterial = (materialId: string): CarbonCredit | null => {
  const credit = carbonCredits.find(c => c.materialId === materialId);
  return credit || null;
};

// Get summary stats
export const getStats = () => {
  const totalMaterials = materials.length;
  const materialsInTransit = materials.filter(m => m.status === 'in-transit').length;
  const materialsVerified = materials.filter(m => m.status === 'verified').length;
  const materialsApproved = materials.filter(m => m.status === 'approved').length;
  
  const totalCarbonCredits = carbonCredits.reduce((sum, credit) => sum + credit.creditValue, 0);
  const approvedCarbonCredits = carbonCredits.filter(c => c.approved).reduce((sum, credit) => sum + credit.creditValue, 0);
  
  return {
    totalMaterials,
    materialsInTransit,
    materialsVerified,
    materialsApproved,
    totalCarbonCredits,
    approvedCarbonCredits
  };
};

// Initialize with some sample data
export const initializeMockData = () => {
  // Clear existing data
  materials = [];
  carbonCredits = [];
  users = [];
  
  // Create users with email addresses
  const farmer1 = createUser('farmer1@example.com', 'farmer');
  const farmer2 = createUser('farmer2@example.com', 'farmer');
  const transporter1 = createUser('transporter1@example.com', 'transporter');
  const plant1 = createUser('plant1@example.com', 'plant');
  const admin1 = createUser('admin1@example.com', 'admin');
  
  // Create materials
  const material1 = registerMaterial('corn_stover', 1000, '41.8781° N, 87.6298° W', farmer1.id);
  const material2 = registerMaterial('wheat_straw', 750, '34.0522° N, 118.2437° W', farmer2.id);
  const material3 = registerMaterial('sugarcane_bagasse', 1200, '25.7617° N, 80.1918° W', farmer1.id);
  
  // Update transportation for one material
  if (material1) {
    updateTransportation(material1.id, transporter1.id, '40.7128° N, 74.0060° W');
  }
  
  // Verify one material
  if (material2) {
    verifyMaterial(material2.id, plant1.id, 730);
  }
  
  // Approve one carbon credit
  const credit = getCarbonCreditForMaterial(material2.id);
  if (credit) {
    updateCarbonCreditStatus(credit.id, true, admin1.id);
  }
};

// Initialize the mock data
initializeMockData();
