import { supabase } from '@/integrations/supabase/client';

export async function checkSpectacleSchema() {
  try {
    // Get the actual table structure by trying to select all columns
    const { data, error } = await supabase
      .from('spectacles')
      .select('*')
      .limit(0); // Get structure without data
    
    if (error) {
      console.error('Schema check error:', error);
      return { success: false, error: error.message };
    }
    
    // Try inserting with only basic required fields
    const minimalSpectacle = {
      title: 'Schema Test',
      slug: 'schema-test'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('spectacles')
      .insert([minimalSpectacle])
      .select();
    
    if (insertError) {
      console.error('Minimal insert failed:', insertError);
      return { 
        success: false, 
        error: insertError.message,
        suggestion: 'Try with even fewer fields or check table structure'
      };
    }
    
    // Clean up
    if (insertData && insertData[0]?.id) {
      await supabase
        .from('spectacles')
        .delete()
        .eq('id', insertData[0].id);
    }
    
    return { 
      success: true, 
      message: 'Minimal insert works - schema accessible'
    };
    
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
