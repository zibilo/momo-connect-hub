import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const kycSchema = z.object({
  full_name: z.string().min(3, 'Nom complet requis'),
  document_type: z.enum(['passport', 'national_id', 'driver_license']),
  document_number: z.string().min(5, 'Numéro de document requis'),
});

type KYCFormValues = z.infer<typeof kycSchema>;

interface KYCFormProps {
  onSuccess?: () => void;
}

const KYCForm: React.FC<KYCFormProps> = ({ onSuccess }) => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{ document?: File; selfie?: File }>({});

  const form = useForm<KYCFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      full_name: '',
      document_type: 'national_id',
      document_number: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'selfie') => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const onSubmit = async (values: KYCFormValues) => {
    if (!user) return;
    if (!files.document) {
      toast({
        title: 'Erreur',
        description: 'Veuillez télécharger une copie de votre pièce d\'identité',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload files to storage
      const documentExt = files.document.name.split('.').pop();
      const documentPath = `${user.id}/document_${Date.now()}.${documentExt}`;
      const { error: docUploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(documentPath, files.document);

      if (docUploadError) throw docUploadError;

      let selfiePath = '';
      if (files.selfie) {
        const selfieExt = files.selfie.name.split('.').pop();
        selfiePath = `${user.id}/selfie_${Date.now()}.${selfieExt}`;
        const { error: selfieUploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(selfiePath, files.selfie);
        if (selfieUploadError) throw selfieUploadError;
      }

      // 2. Create KYC record
      const { error: kycError } = await supabase.from('kyc_documents').insert({
        user_id: user.id,
        document_type: values.document_type,
        document_url: documentPath,
        selfie_url: selfiePath || null,
        status: 'pending',
      });

      if (kycError) throw kycError;

      // 3. Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'pending',
          full_name: values.full_name
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Succès',
        description: 'Vos documents ont été soumis pour vérification.',
      });

      await refreshProfile();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la soumission.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Vérification d'identité (KYC)</CardTitle>
        <CardDescription>
          Pour devenir créateur et retirer vos gains, nous devons vérifier votre identité.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet (comme sur votre pièce d'identité)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de document</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="national_id">Carte d'identité nationale</SelectItem>
                        <SelectItem value="passport">Passeport</SelectItem>
                        <SelectItem value="driver_license">Permis de conduire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro du document</FormLabel>
                    <FormControl>
                      <Input placeholder="N° de document" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormItem>
                <FormLabel>Copie du document (Recto/Verso ou Page principale)</FormLabel>
                <Input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => handleFileChange(e, 'document')}
                />
              </FormItem>

              <FormItem>
                <FormLabel>Selfie avec le document (Optionnel mais recommandé)</FormLabel>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'selfie')}
                />
              </FormItem>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Soumettre pour vérification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default KYCForm;
