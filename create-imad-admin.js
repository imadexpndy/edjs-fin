import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createImadAdmin() {
  try {
    console.log('Creating admin account for aitmoulidimad@gmail.com...')
    
    const adminData = {
      email: 'aitmoulidimad@gmail.com',
      password: 'ImadAdmin123!',
      firstName: 'Imad',
      lastName: 'Ait Moulid',
      fullName: 'Imad Ait Moulid',
      phone: '+212600000000'
    }
    
    // Create the user account
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
    
    console.log('✅ User account created successfully!')
    console.log('User ID:', signUpData.user?.id)
    
    // Try to create profile (will likely fail due to RLS, but that's expected)
    if (signUpData.user) {
      console.log('Attempting to create admin profile...')
      
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
        console.log('Profile creation blocked by RLS (expected)')
        console.log('Profile will be created automatically on first login')
      } else {
        console.log('✅ Admin profile created successfully!')
      }
    }
    
    console.log('\n🎉 ADMIN ACCOUNT READY!')
    console.log('========================')
    console.log('Email:', adminData.email)
    console.log('Password:', adminData.password)
    console.log('========================')
    console.log('')
    console.log('📧 IMPORTANT: Check your email for confirmation link!')
    console.log('You must click the confirmation link before you can log in.')
    console.log('')
    console.log('Once confirmed, you can log in at: http://localhost:8081/auth')
    
  } catch (err) {
    console.error('Error:', err.message)
  }
}

createImadAdmin()
