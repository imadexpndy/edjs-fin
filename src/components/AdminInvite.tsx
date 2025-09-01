import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, UserPlus, Shield } from 'lucide-react';

const ADMIN_ROLES = [
  { value: 'admin_full', label: 'Administrateur Complet', description: 'Accès total à toutes les fonctionnalités' },
  { value: 'admin_spectacles', label: 'Admin Spectacles', description: 'Gestion des spectacles et sessions' },
  { value: 'admin_schools', label: 'Admin Écoles', description: 'Gestion des écoles et réservations' },
  { value: 'admin_partners', label: 'Admin Partenaires', description: 'Gestion des partenaires' },
  { value: 'admin_support', label: 'Admin Support', description: 'Support client et assistance' },
  { value: 'admin_notifications', label: 'Admin Communications', description: 'Gestion des notifications et emails' },
  { value: 'admin_editor', label: 'Admin Éditeur', description: 'Édition de contenu et modération' },
];

export const AdminInvite = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        title: "Erreur",
        description: "Email et rôle sont requis",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

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

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Invitation envoyée",
          description: `Invitation admin envoyée à ${email}`,
        });
        
        // Reset form
        setEmail('');
        setFullName('');
        setRole('');
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Échec de l'envoi de l'invitation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Erreur",
        description: "Erreur réseau lors de l'envoi de l'invitation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Inviter un Administrateur
        </CardTitle>
        <CardDescription>
          Envoyez une invitation par email pour créer un nouveau compte administrateur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet (optionnel)</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Jean Dupont"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle Administrateur</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ROLES.map((adminRole) => (
                  <SelectItem key={adminRole.value} value={adminRole.value}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {adminRole.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {adminRole.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer l'invitation
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Comment ça marche :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• L'utilisateur recevra un email d'invitation</li>
            <li>• Il devra cliquer sur le lien pour activer son compte</li>
            <li>• Il pourra alors définir son mot de passe</li>
            <li>• Son rôle sera automatiquement assigné</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
