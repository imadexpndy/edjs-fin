import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-setup-token",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin setup token
    const token = (req.headers.get('x-admin-setup-token') || '').trim();
    const expected = (Deno.env.get('ADMIN_SETUP_TOKEN') || '').trim();
    
    if (!expected || token !== expected) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { email, role, full_name } = await req.json();

    if (!email || !role) {
      return new Response(JSON.stringify({ error: 'Email and role are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Generate a temporary password
    const tempPassword = `Temp${Math.random().toString(36).substring(2, 15)}!`;

    // Create user with admin API
    const { data: userResult, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false, // Will be confirmed via invitation email
      user_metadata: {
        invited_by: 'admin',
        invited_at: new Date().toISOString(),
        role: role,
        full_name: full_name || 'Administrator'
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(JSON.stringify({ 
        error: 'Failed to create user', 
        details: createError.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userId = userResult.user.id;

    // Create profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        email,
        admin_role: role,
        full_name: full_name || 'Administrator',
        verification_status: 'pending',
        is_verified: false,
        privacy_accepted: false,
        terms_accepted: false,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Continue anyway - profile can be created later
    }

    // Send invitation email with password reset link
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:8081'}/auth?mode=reset&type=invite`,
      data: {
        role: role,
        full_name: full_name || 'Administrator',
        invited_by: 'admin'
      }
    });

    if (inviteError) {
      console.error('Error sending invitation:', inviteError);
      return new Response(JSON.stringify({ 
        error: 'User created but invitation email failed', 
        details: inviteError.message,
        user_id: userId
      }), {
        status: 207, // Partial success
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Admin invitation sent successfully',
      user_id: userId,
      email: email,
      role: role
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
