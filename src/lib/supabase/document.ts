import supabase from './client';

export const fetchDocuments = async (userId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('Document')
    .select('*')
    .eq('created_by', userId);

  if (error) throw error;
  return data || [];
};

export const addDocument = async (
  title: string,
  content: string,
  userId: string
) => {
  const { error } = await supabase
    .from('Document')
    .insert([{ title, content, created_by: userId }]);
  if (error) throw error;
};

export const deleteDocument = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('Document')
    .delete()
    .eq('id', id)
    .eq('created_by', userId);

  if (error) throw error;
};
