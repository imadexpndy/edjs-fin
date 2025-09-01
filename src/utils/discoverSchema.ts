import { supabase } from '@/integrations/supabase/client';

export async function discoverSpectacleSchema() {
  try {
    // Try to get existing spectacles to see what columns are available
    const { data: existingSpectacles, error: selectError } = await supabase
      .from('spectacles')
      .select('*')
      .limit(1);
    
    console.log('Existing spectacles query result:', { data: existingSpectacles, error: selectError });
    
    if (selectError) {
      return { 
        success: false, 
        error: `Cannot read spectacles table: ${selectError.message}`,
        suggestion: 'Table may not exist or have different name'
      };
    }
    
    // Try inserting with the actual schema format
    const testSpectacle = {
      title: 'Schema Test Spectacle',
      description: 'Test description for schema discovery',
      duration_minutes: 60,
      price: 50,
      age_range_min: 5,
      age_range_max: 12,
      poster_url: '',
      is_active: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('spectacles')
      .insert([testSpectacle])
      .select();
    
    if (insertError) {
      console.log('Insert error:', insertError);
      return {
        success: false,
        error: `Insert failed: ${insertError.message}`,
        suggestion: 'Check required fields and data types'
      };
    }
    
    // Clean up test record
    if (insertResult && insertResult[0]?.id) {
      await supabase.from('spectacles').delete().eq('id', insertResult[0].id);
    }
    
    return {
      success: true,
      message: 'Schema discovered successfully!',
      columns: Object.keys(insertResult[0] || {})
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: `Schema discovery failed: ${error.message}`
    };
  }
}
