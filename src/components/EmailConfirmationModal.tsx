import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  email
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (resendCount >= 3) {
      toast({
        title: "Limite atteinte",
        description: "Vous avez atteint la limite de renvoi d'emails. Veuillez attendre quelques minutes.",
        variant: "destructive"
      });
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      setResendCount(prev => prev + 1);
      toast({
        title: "Email renvoyé",
        description: "Un nouvel email de confirmation a été envoyé à votre adresse.",
      });

    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de renvoyer l'email",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Confirmez votre adresse email
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Nous avons envoyé un email de confirmation à :
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Étapes à suivre :</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Vérifiez votre boîte de réception</li>
                  <li>Cliquez sur le lien de confirmation</li>
                  <li>Revenez vous connecter</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Email non reçu ?</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Vérifiez votre dossier spam/courrier indésirable</li>
                  <li>Attendez quelques minutes (les emails peuvent prendre du temps)</li>
                  <li>Vérifiez que l'adresse email est correcte</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-x-0">
          <Button
            onClick={handleResendEmail}
            disabled={isResending || resendCount >= 3}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Renvoyer l'email {resendCount > 0 && `(${resendCount}/3)`}
              </>
            )}
          </Button>
          
          <Button onClick={onClose} className="w-full">
            J'ai compris
          </Button>
        </DialogFooter>

        {resendCount >= 3 && (
          <div className="text-center text-sm text-muted-foreground">
            Limite de renvoi atteinte. Contactez le support si vous ne recevez toujours pas l'email.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
