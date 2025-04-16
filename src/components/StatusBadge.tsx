import React from 'react';

type MaterialStatus = 'registered' | 'in-transit' | 'verified' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: MaterialStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "text-xs px-2.5 py-0.5 rounded-full transition-all duration-300 animate-pulse-slow";
  
  const getStatusClass = () => {
    switch (status) {
      case 'registered':
        return `${baseClasses} bg-blue-900/20 text-blue-300 border border-blue-500/20`;
      case 'in-transit':
        return `${baseClasses} bg-yellow-900/20 text-yellow-300 border border-yellow-500/20`;
      case 'verified':
        return `${baseClasses} bg-green-900/20 text-green-300 border border-green-500/20`;
      case 'approved':
        return `${baseClasses} bg-purple-900/20 text-purple-300 border border-purple-500/20`;
      case 'rejected':
        return `${baseClasses} bg-red-900/20 text-red-300 border border-red-500/20`;
      default:
        return `${baseClasses} bg-gray-900/20 text-gray-300 border border-gray-500/20`;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'registered':
        return 'Registered';
      case 'in-transit':
        return 'In Transit';
      case 'verified':
        return 'Verified';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <span className={getStatusClass()}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;
