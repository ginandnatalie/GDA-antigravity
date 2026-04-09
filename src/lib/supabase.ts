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
    // Check if bucket exists by trying to list it (lightweight check)
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.warn('Could not list buckets, proceeding with upload anyway:', bucketError);
    } else {
      const exists = buckets.find(b => b.name === bucket);
      if (!exists) {
        console.error(`Bucket "${bucket}" does not exist. Please create it in Supabase Storage.`);
        throw new Error(`Storage bucket "${bucket}" not found. Please contact support.`);
      }
    }

    // Add a timeout to the upload operation
    const uploadPromise = supabase.storage
      .from(bucket)
      .upload(filePath, file);

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Upload timed out after 30 seconds. Please check your connection.')), 30000)
    );

    const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

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
