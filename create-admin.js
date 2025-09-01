import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  try {
    // Create admin user with email confirmation bypassed
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@edjs.com',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrator EDJS'
      }
    })

    if (error) {
      console.error('Error creating admin:', error.message)
      return
    }

    console.log('Admin user created successfully!')
    console.log('Email: admin@edjs.com')
    console.log('Password: Admin123!')
    
    if (data.user) {
      console.log('User ID:', data.user.id)
      console.log('Now updating profile with admin role...')
      
      // Update profile with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: data.user.id,
          email: 'admin@edjs.com',
          admin_role: 'admin_full',
          full_name: 'Administrator EDJS',
          verification_status: 'approved',
          is_verified: true,
          privacy_accepted: true,
          terms_accepted: true,
        })

      if (profileError) {
        console.error('Error updating profile:', profileError.message)
      } else {
        console.log('Admin profile updated successfully!')
      }
    }

  } catch (err) {
    console.error('Error:', err.message)
  }
}

createAdmin()
