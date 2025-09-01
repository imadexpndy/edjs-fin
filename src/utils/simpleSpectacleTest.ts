import { supabase } from '@/integrations/supabase/client';

// Simple test to bypass RLS and check basic connectivity
export async function simpleSpectacleTest() {
  try {
    console.log('Testing basic Supabase connectivity...');
    
    // Test 1: Basic connection test
    const { data, error } = await supabase
      .from('spectacles')
      .select('count', { count: 'exact' });
    
    console.log('Basic count test:', { data, error });
    
    if (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
    
    // Test 2: Try to insert with only title field
    const testSpectacle = {
      title: 'Test Import'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('spectacles')
      .insert([testSpectacle])
      .select();
    
    console.log('Insert test result:', { data: insertData, error: insertError });
    
    if (insertError) {
      // Check if it's an RLS error
      if (insertError.message.includes('RLS') || insertError.message.includes('policy') || insertError.code === 'PGRST116') {
        return { 
          success: false, 
          error: 'RLS Policy Error - Need to login as admin first',
          needsAuth: true
        };
      } else {
        return { 
          success: false, 
          error: `Insert failed: ${insertError.message}`,
          needsAuth: false
        };
      }
    }
    
    // Clean up if successful
    if (insertData && insertData[0]?.id) {
      await supabase
        .from('spectacles')
        .delete()
        .eq('id', insertData[0].id);
    }
    
    return { success: true, message: 'Database fully accessible' };
    
  } catch (error: any) {
    console.error('Simple test failed:', error);
    return { success: false, error: error.message };
  }
}
