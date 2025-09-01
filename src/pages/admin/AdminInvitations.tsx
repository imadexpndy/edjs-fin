import React, { useState, useEffect } from 'react';
import { AdminInvite } from '@/components/AdminInvite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Mail, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface PendingInvitation {
  id: string;
  email: string;
  full_name: string | null;
  admin_role: string;
  verification_status: string;
  created_at: string;
  is_verified: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  'admin_full': 'Administrateur Complet',
  'admin_spectacles': 'Admin Spectacles',
  'admin_schools': 'Admin Écoles',
  'admin_partners': 'Admin Partenaires',
  'admin_support': 'Admin Support',
  'admin_notifications': 'Admin Communications',
  'admin_editor': 'Admin Éditeur',
};

export default function AdminInvitations() {
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('verification_status', ['pending', 'invited'])
        .not('admin_role', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les invitations",
          variant: "destructive"
        });
        return;
      }

      setPendingInvitations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (email: string, role: string, fullName: string | null) => {
    try {
      const response = await fetch('/functions/v1/invite-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-setup-token': 'your-admin-setup-token' // Replace with actual token
        },
        body: JSON.stringify({
          email,
          role,
          full_name: fullName
        })
      });

      if (response.ok) {
        toast({
          title: "Invitation renvoyée",
          description: `Invitation renvoyée à ${email}`,
        });
      } else {
        const result = await response.json();
        toast({
          title: "Erreur",
          description: result.error || "Échec du renvoi",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur réseau",
        variant: "destructive"
      });
    }
  };

  const cancelInvitation = async (userId: string, email: string) => {
    try {
      // Delete the user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'annuler l'invitation",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Invitation annulée",
        description: `Invitation pour ${email} annulée`,
      });

      // Refresh the list
      fetchPendingInvitations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'annulation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Activé</Badge>;
    }
    
    switch (status) {
      case 'pending':
      case 'invited':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      default:
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Inconnu</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invitations Administrateurs</h1>
          <p className="text-muted-foreground">Gérez les invitations et les rôles administrateurs</p>
        </div>
        <Button onClick={fetchPendingInvitations} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invitation Form */}
        <div>
          <AdminInvite />
        </div>

        {/* Pending Invitations */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Invitations en cours
              </CardTitle>
              <CardDescription>
                {pendingInvitations.length} invitation(s) en attente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : pendingInvitations.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune invitation en cours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{invitation.full_name || 'Sans nom'}</p>
                          <p className="text-sm text-muted-foreground">{invitation.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {ROLE_LABELS[invitation.admin_role] || invitation.admin_role}
                          </p>
                        </div>
                        {getStatusBadge(invitation.verification_status, invitation.is_verified)}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Invité le {new Date(invitation.created_at).toLocaleDateString('fr-FR')}
                      </div>

                      {!invitation.is_verified && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resendInvitation(
                              invitation.email, 
                              invitation.admin_role, 
                              invitation.full_name
                            )}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Renvoyer
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cancelInvitation(invitation.id, invitation.email)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
