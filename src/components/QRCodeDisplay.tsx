
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 128 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="glassmorphism p-3 rounded-xl transition-all duration-300 hover:scale-105 group">
        <div className="relative">
          <div className="absolute inset-0 bg-eco-primary/20 blur-xl rounded-lg transform group-hover:scale-110 transition-transform duration-300" />
          <div className="relative bg-white rounded-lg p-2">
            <QRCodeSVG
              value={value}
              size={size}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400 text-center break-all max-w-[150px] animate-pulse-slow">
        {value}
      </p>
    </div>
  );
};

export default QRCodeDisplay;
