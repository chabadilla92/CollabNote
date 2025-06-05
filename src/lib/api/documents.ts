export async function getDocument(docId: string) {
    const res = await fetch(`/api/documents/${docId}`);
    if (!res.ok) throw new Error('Failed to fetch document');
    return res.json();
  }
  
  export async function updateDocument(docId: string, content: string) {
    const res = await fetch(`/api/documents/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update document');
    }
    return res.json();
  }
  
  export async function fetchDocuments(): Promise<Document[]> {
    const res = await fetch('/api/documents');
    if (!res.ok) {
      throw new Error('Failed to fetch documents');
    }
    return res.json();
  }
  
  export async function addDocument(title: string, content: string): Promise<Document> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to add document');
    }
    return res.json();
  }
  
  export async function deleteDocument(id: string): Promise<void> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete document');
    }
  }
  