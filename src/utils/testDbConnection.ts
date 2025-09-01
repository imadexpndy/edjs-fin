import { supabase } from '@/integrations/supabase/client';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth status:', { user: user?.id, email: user?.email, error: authError });
    
    if (!user) {
      return { success: false, error: 'Not authenticated - please login first' };
    }
    
    // Test 2: Check user profile (skip admin role check for now)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    console.log('User profile:', { profile, error: profileError });
    
    // For now, skip admin role validation since we're debugging
    // We'll check if the user exists in profiles table
    
    // Test 3: Check if we can read from spectacles table
    const { data: readTest, error: readError } = await supabase
      .from('spectacles')
      .select('*')
      .limit(1);
    
    console.log('Read test:', { data: readTest, error: readError });
    
    if (readError) {
      return { success: false, error: `Read failed: ${readError.message}` };
    }
    
    // Test 4: Try to insert a simple test record
    const testRecord = {
      title: 'Test Spectacle',
      slug: 'test-spectacle',
      description: 'Test description',
      short_description: 'Test short desc',
      duration: 60,
      language: 'Français',
      status: 'draft' as const,
      price_individual: 50,
      price_group: 40,
      price_school: 30,
      main_image_url: '',
      video_url: '',
      synopsis: 'Test synopsis'
    };
    
    const { data: insertTest, error: insertError } = await supabase
      .from('spectacles')
      .insert([testRecord])
      .select()
      .single();
    
    console.log('Insert test:', { data: insertTest, error: insertError });
    
    if (insertError) {
      console.error('Insert failed:', insertError);
      return { success: false, error: `Insert failed: ${insertError.message}` };
    }
    
    // Test 5: Clean up test record
    if (insertTest?.id) {
      await supabase
        .from('spectacles')
        .delete()
        .eq('id', insertTest.id);
    }
    
    return { 
      success: true, 
      message: `Database working. User: ${user.email}` 
    };
    
  } catch (error: any) {
    console.error('Database test failed:', error);
    return { success: false, error: error.message };
  }
}
