// Debug script to test email confirmation
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aioldzmwwhukzabrizkt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testEmailSignup() {
  console.log('Testing email signup...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'http://localhost:5173/',
      }
    });
    
    console.log('Signup result:', { data, error });
    
    if (data?.user) {
      console.log('User created:', data.user.id);
      console.log('Email confirmed:', data.user.email_confirmed_at);
      console.log('Confirmation sent at:', data.user.confirmation_sent_at);
    }
    
    if (error) {
      console.error('Signup error:', error.message);
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testEmailSignup();
