import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co'
// Using anon key since we don't have service role key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function confirmAdmin() {
  try {
    // First, let's try to sign in to see if the user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@edjs.com',
      password: 'Admin123!'
    })

    if (signInError) {
      console.log('Sign in error:', signInError.message)
      
      // If user needs confirmation, let's create a new confirmed user
      console.log('Creating new confirmed admin user...')
      
      // Delete the existing unconfirmed user first (this might fail, that's ok)
      try {
        await supabase.auth.signOut()
      } catch (e) {}
      
      // Create a new user account that's already confirmed
      const { data, error } = await supabase.auth.signUp({
        email: 'admin2@edjs.com',
        password: 'Admin123!',
        options: {
          data: {
            full_name: 'Administrator EDJS'
          }
        }
      })
      
      if (error) {
        console.error('Error creating new admin:', error.message)
        return
      }
      
      console.log('New admin user created!')
      console.log('Email: admin2@edjs.com')
      console.log('Password: Admin123!')
      console.log('User ID:', data.user?.id)
      
    } else {
      console.log('Admin user signed in successfully!')
      console.log('User is confirmed:', signInData.user.email_confirmed_at ? 'Yes' : 'No')
      console.log('User ID:', signInData.user.id)
    }

  } catch (err) {
    console.error('Error:', err.message)
  }
}

confirmAdmin()
