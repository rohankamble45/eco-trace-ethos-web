
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 128 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="bg-white p-2 rounded-md shadow-md">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center break-all max-w-[150px]">{value}</p>
    </div>
  );
};

export default QRCodeDisplay;
