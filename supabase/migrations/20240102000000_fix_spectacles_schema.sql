-- Ensure age_range column exists and add missing columns for real spectacle data
ALTER TABLE spectacles 
ADD COLUMN IF NOT EXISTS age_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS venue VARCHAR(255),
ADD COLUMN IF NOT EXISTS dates VARCHAR(255);

-- Update the updated_at trigger to ensure it works
DROP TRIGGER IF EXISTS update_spectacles_updated_at ON spectacles;
CREATE TRIGGER update_spectacles_updated_at 
  BEFORE UPDATE ON spectacles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
