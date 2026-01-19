import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const KYCForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting KYC form...");
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
        <CardDescription>Please upload your identity documents to become a creator.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cni-front">ID Card (Front)</Label>
            <Input id="cni-front" type="file" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cni-back">ID Card (Back)</Label>
            <Input id="cni-back" type="file" />
          </div>
          <Button type="submit" className="w-full">
            Submit for Verification
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};
