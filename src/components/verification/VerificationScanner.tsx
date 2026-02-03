"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerificationCodeInput } from '@/components/tickets/VerificationCodeInput';
import { QrCode, Search, Loader2 } from 'lucide-react';

interface VerificationScannerProps {
  onVerify: (code: string) => Promise<void>;
  isLoading?: boolean;
}

export function VerificationScanner({ onVerify, isLoading }: VerificationScannerProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCodeComplete = async (verificationCode: string) => {
    setCode(verificationCode);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!code || code.length < 8) {
      setError('Veuillez entrer un code de vérification valide');
      return;
    }

    setError(null);
    try {
      await onVerify(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code invalide ou ticket non trouvé');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <CardTitle>Vérifier un Ticket</CardTitle>
        <p className="text-sm text-muted-foreground">
          Entrez le code de vérification du ticket pour vérifier son statut
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <VerificationCodeInput
          onComplete={handleCodeComplete}
          disabled={isLoading}
          error={error || undefined}
        />

        <Button
          onClick={handleSubmit}
          disabled={!code || code.length < 8 || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Vérification...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Vérifier le ticket
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Le code de vérification se trouve sur votre ticket physique ou dans les détails de votre achat
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default VerificationScanner;
