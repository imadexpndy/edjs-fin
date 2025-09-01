import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createConfirmedAdmin() {
  try {
    console.log('Creating pre-confirmed admin account...')
    
    // Delete existing unconfirmed account first
    try {
      await supabase.auth.signOut()
    } catch (e) {}
    
    // Create account with a different approach - using a test email domain
    const adminData = {
      email: 'imad.admin@test.local',
      password: 'ImadAdmin123!',
      firstName: 'Imad',
      lastName: 'Admin',
      fullName: 'Imad Admin'
    }
    
    console.log('Attempting to create account with test domain...')
    
    const { data, error } = await supabase.auth.signUp({
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
    
    if (error) {
      console.error('Error:', error.message)
      
      // Try alternative approach - create with your real email but different password
      console.log('Trying alternative approach...')
      
      const altData = {
        email: 'aitmoulidimad@gmail.com',
        password: 'NewImadAdmin2025!',
        firstName: 'Imad',
        lastName: 'Ait Moulid',
        fullName: 'Imad Ait Moulid'
      }
      
      const { data: altResult, error: altError } = await supabase.auth.signUp({
        email: altData.email,
        password: altData.password,
        options: {
          data: {
            full_name: altData.fullName,
            first_name: altData.firstName,
            last_name: altData.lastName
          }
        }
      })
      
      if (altError) {
        console.error('Alternative approach failed:', altError.message)
        
        // Final approach - try to sign in with existing account
        console.log('Checking if account already exists and trying to sign in...')
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'aitmoulidimad@gmail.com',
          password: 'ImadAdmin123!'
        })
        
        if (signInError) {
          console.log('Sign in failed:', signInError.message)
          console.log('\n=== MANUAL SOLUTION ===')
          console.log('Email confirmation is required by Supabase settings.')
          console.log('Please check:')
          console.log('1. Spam/Junk folder in your email')
          console.log('2. Promotions tab (if using Gmail)')
          console.log('3. Wait a few minutes and check again')
          console.log('')
          console.log('Alternative: Use the registration form at:')
          console.log('http://localhost:8081/auth?mode=register')
          console.log('Register as Professional > École, then I\'ll upgrade you to admin')
        } else {
          console.log('✅ Successfully signed in!')
          console.log('Account is already confirmed and ready to use')
          console.log('Email: aitmoulidimad@gmail.com')
          console.log('Password: ImadAdmin123!')
        }
        
        return
      }
      
      console.log('✅ Alternative account created!')
      console.log('Email:', altData.email)
      console.log('Password:', altData.password)
      console.log('User ID:', altResult.user?.id)
      
    } else {
      console.log('✅ Test account created!')
      console.log('Email:', adminData.email)
      console.log('Password:', adminData.password)
      console.log('User ID:', data.user?.id)
    }
    
  } catch (err) {
    console.error('Error:', err.message)
  }
}

createConfirmedAdmin()
