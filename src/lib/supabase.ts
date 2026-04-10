import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
  if (typeof window !== 'undefined') {
    alert('Configuration Error: Supabase URL or Anon Key is missing. Please check your environment variables.');
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const uploadFile = async (file: File, bucket: string = 'documents', folder: string = 'cvs') => {
  console.log('Starting file upload...', { bucket, folder, fileName: file.name });
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  try {
    // Upload the file directly
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful, getting public URL...');
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  } catch (err) {
    console.error('Catch in uploadFile:', err);
    throw err;
  }
};
