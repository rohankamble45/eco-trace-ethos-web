
import React from 'react';

type MaterialStatus = 'registered' | 'in-transit' | 'verified' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: MaterialStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'registered':
        return 'status-registered';
      case 'in-transit':
        return 'status-in-transit';
      case 'verified':
        return 'status-verified';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full';
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

  return <span className={getStatusClass()}>{getStatusLabel()}</span>;
};

export default StatusBadge;
