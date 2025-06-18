import supabase from "./client.ts";

// fetch all documents based on signed in user
export const fetchDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('Document')
    .select('*');

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

// get document based on id
export async function getDocumentById(id: string) {
  const { data, error } = await supabase
    .from('Document')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// update single document content
export async function updateDocumentContent(id: string, content: string) {
  const { error } = await supabase
    .from('Document')
    .update({ content })
    .eq('id', id);

  if (error) throw error;
}
