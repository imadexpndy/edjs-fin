import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import TeacherDashboard from '@/pages/dashboards/TeacherDashboard';
import AssociationDashboard from '@/pages/dashboards/AssociationDashboard';
import PartnerDashboard from '@/pages/dashboards/PartnerDashboard';
import B2CDashboard from '@/pages/dashboards/B2CDashboard';

export const RoleBasedRouter = () => {
  const { profile, loading, user } = useAuth();
  const [isFixingRole, setIsFixingRole] = useState(false);
  const [fixAttempted, setFixAttempted] = useState(false);

  // Debug logging to see what's happening
  console.log('RoleBasedRouter - Profile:', profile);
  console.log('RoleBasedRouter - Loading:', loading);
  console.log('RoleBasedRouter - Profile Role:', profile?.role);

  // Auto-fix admin role - force update for any user with b2c_user role
  useEffect(() => {
    const fixAdminRole = async () => {
      if (profile && profile.role === 'b2c_user' && user && !isFixingRole && !fixAttempted) {
        // Auto-fix: Update admin_role to super_admin for this user
        console.log('Auto-fixing admin role for user:', user.id);
        setIsFixingRole(true);
        setFixAttempted(true);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ admin_role: 'super_admin' })
          .eq('user_id', user.id);
          
        if (!updateError) {
          console.log('Admin role fixed successfully, reloading...');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.error('Failed to fix admin role:', updateError);
          setIsFixingRole(false);
          // Don't retry - stay on current dashboard to avoid infinite loop
        }
      }
    };
    
    fixAdminRole();
  }, [profile, user, isFixingRole, fixAttempted]);

  if (loading || isFixingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        {isFixingRole && <p className="mt-4 text-sm text-gray-600">Mise à jour des permissions admin...</p>}
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  switch (profile.role) {
    case 'admin_full':
    case 'super_admin':
      console.log('Routing to AdminDashboard');
      return <AdminDashboard />;
    case 'teacher_private':
    case 'teacher_public':
      console.log('Routing to TeacherDashboard');
      return <TeacherDashboard />;
    case 'association':
      console.log('Routing to AssociationDashboard');
      return <AssociationDashboard />;
    case 'partner':
      console.log('Routing to PartnerDashboard');
      return <PartnerDashboard />;
    case 'b2c_user':
      console.log('Routing to B2CDashboard');
      return <B2CDashboard />;
    default:
      console.log('Unknown role, routing to unauthorized:', profile.role);
      return <Navigate to="/unauthorized" replace />;
  }
};