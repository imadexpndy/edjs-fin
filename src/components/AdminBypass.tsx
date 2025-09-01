import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const AdminBypass: React.FC = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleBypass = () => {
    if (password === 'ImadBypass2025!') {
      // Set admin session in localStorage
      localStorage.setItem('admin_bypass', 'true');
      localStorage.setItem('admin_user', JSON.stringify({
        id: 'bypass-admin',
        email: 'aitmoulidimad@gmail.com',
        full_name: 'Imad Ait Moulid',
        admin_role: 'admin_full'
      }));
      
      // Redirect to admin dashboard
      navigate('/admin');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Accès Admin Direct</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBypass()}
              />
            </div>
            <Button onClick={handleBypass} className="w-full">
              Accéder au tableau de bord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
