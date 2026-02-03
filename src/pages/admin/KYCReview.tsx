import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Clock, CheckCircle2, XCircle, Eye, FileText, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/dates';

interface KYCSubmission {
  id: string;
  user_id: string;
  full_name: string;
  document_type: string;
  document_url: string;
  selfie_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

const KYCReview = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data as KYCSubmission[]) || []);
    } catch (error) {
      console.error('Error fetching KYC submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission: KYCSubmission) => {
    setProcessing(submission.id);
    try {
      const { error: kycError } = await supabase
        .from('kyc_submissions')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', submission.id);

      if (kycError) throw kycError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: 'approved', role: 'creator' })
        .eq('user_id', submission.user_id);

      if (profileError) throw profileError;

      toast({
        title: 'KYC Approuvé',
        description: `${submission.full_name} est maintenant créateur.`,
      });

      fetchSubmissions();
    } catch (error) {
      console.error('Error approving KYC:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'approuver le KYC.",
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (submission: KYCSubmission) => {
    setProcessing(submission.id);
    try {
      const { error: kycError } = await supabase
        .from('kyc_submissions')
        .update({ 
          status: 'rejected', 
          reviewed_at: new Date().toISOString(),
          rejection_reason: 'Documents non conformes' 
        })
        .eq('id', submission.id);

      if (kycError) throw kycError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: 'rejected' })
        .eq('user_id', submission.user_id);

      if (profileError) throw profileError;

      toast({
        title: 'KYC Refusé',
        description: `La demande de ${submission.full_name} a été refusée.`,
      });

      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de refuser le KYC.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vérification KYC</h1>
          <p className="text-muted-foreground mt-1">Examinez les demandes de vérification d'identité</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                En Attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Approuvés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Refusés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approuvés</TabsTrigger>
            <TabsTrigger value="rejected">Refusés</TabsTrigger>
            <TabsTrigger value="all">Tous</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune demande KYC {activeTab === 'pending' ? 'en attente' : ''}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredSubmissions.map(submission => (
                  <Card key={submission.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{submission.full_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <FileText className="w-4 h-4" />
                              <span>{submission.document_type}</span>
                              <span>•</span>
                              <span>Soumis le {formatDate(submission.submitted_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.status === 'pending' ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(submission)}
                                disabled={processing === submission.id}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Refuser
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(submission)}
                                disabled={processing === submission.id}
                              >
                                {processing === submission.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Approuver
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <Badge variant={submission.status === 'approved' ? 'default' : 'destructive'}>
                              {submission.status === 'approved' ? 'Approuvé' : 'Refusé'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default KYCReview;
