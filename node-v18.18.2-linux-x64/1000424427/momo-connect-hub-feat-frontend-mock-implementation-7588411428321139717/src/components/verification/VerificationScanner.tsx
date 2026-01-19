import React from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

export const VerificationScanner: React.FC = () => {
  const handleScan = () => {
    // This would trigger the device's camera for QR code scanning.
    console.log("Starting QR code scanner...");
  };

  return (
    <div className="p-4 border-dashed border-2 rounded-lg text-center">
      <p className="mb-4">Scan a ticket's QR code to verify it instantly.</p>
      <Button onClick={handleScan}>
        <ScanLine className="mr-2 h-4 w-4" />
        Scan QR Code
      </Button>
    </div>
  );
};
