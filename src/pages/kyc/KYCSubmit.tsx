import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import KYCForm from '@/components/auth/KYCForm';
import { useNavigate } from 'react-router-dom';

const KYCSubmit = () => {
  const navigate = useNavigate();

    return (
      <AppLayout>
        <div className="container py-8">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Devenir Créateur</h1>
          <p className="text-muted-foreground">
            Pour commencer à publier vos tickets et gagner des commissions, 
            nous devons valider votre identité conformément aux réglementations.
          </p>
        </div>
        <KYCForm onSuccess={() => navigate('/kyc/status')} />
      </div>
    </AppLayout>
  );
};

export default KYCSubmit;
