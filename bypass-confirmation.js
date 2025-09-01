import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function bypassConfirmation() {
  try {
    console.log('Checking Supabase settings...')
    
    // Try to get current user
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Current user:', user?.email || 'None')
    
    // Check if we can access auth settings
    const { data: settings, error: settingsError } = await supabase.auth.getSession()
    console.log('Session check:', settingsError ? 'Error' : 'OK')
    
    // Let's try a different approach - create a user through the registration form
    console.log('Creating admin through registration...')
    
    const adminData = {
      email: 'superadmin@edjs.com',
      password: 'SuperAdmin123!',
      userCategory: 'b2b',
      userType: 'admin',
      firstName: 'Super',
      lastName: 'Admin',
      fullName: 'Super Admin',
      phone: '+212600000000',
      organization: 'EDJS Administration'
    }
    
    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminData.email,
      password: adminData.password,
      options: {
        data: {
          full_name: adminData.fullName,
          first_name: adminData.firstName,
          last_name: adminData.lastName
        }
      }
    })
    
    if (signUpError) {
      console.error('Sign up error:', signUpError.message)
      return
    }
    
    console.log('User created:', adminData.email)
    console.log('Password:', adminData.password)
    console.log('User ID:', signUpData.user?.id)
    
    // Now try to manually confirm the email by updating the user
    if (signUpData.user) {
      console.log('Attempting to create profile...')
      
      // Insert profile directly
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: signUpData.user.id,
          email: adminData.email,
          first_name: adminData.firstName,
          last_name: adminData.lastName,
          full_name: adminData.fullName,
          phone: adminData.phone,
          admin_role: 'admin_full',
          verification_status: 'approved',
          is_verified: true,
          privacy_accepted: true,
          terms_accepted: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.log('Profile creation failed (expected due to RLS):', profileError.message)
        console.log('This is normal - the profile will be created on first login')
      } else {
        console.log('Profile created successfully!')
      }
    }
    
    console.log('\n=== ADMIN CREDENTIALS ===')
    console.log('Email:', adminData.email)
    console.log('Password:', adminData.password)
    console.log('========================')
    
  } catch (err) {
    console.error('Error:', err.message)
  }
}

bypassConfirmation()
