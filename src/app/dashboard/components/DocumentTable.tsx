'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import {
  fetchDocuments,
  addDocument,
  deleteDocument,
} from '@/lib/api/documents.ts';
import Input from '@/components/ui/Input.tsx';
import Link from 'next/link.js';

const DocumentTable = () => {
  const session = useSession();
  const userId = session?.user?.id;
  const displayName = session?.user?.user_metadata?.displayName;

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  // Fetch documents

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch documents.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    loadDocuments();
  }, [userId, loadDocuments]);

  // Add documents

  const handleAddDocument = async () => {
    if (!newTitle.trim()) {
      setError('Title is required.');
      return;
    }

    setAdding(true);
    setError(null);

    try {
      await addDocument(newTitle, newContent);
      setNewTitle('');
      setNewContent('');
      await loadDocuments();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to add document.'
      );
    } finally {
      setAdding(false);
    }
  };

  // Delete documents

  const handleDeleteDocument = async (id: string) => {
    setError(null);

    try {
      await deleteDocument(id);
      await loadDocuments();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete document.'
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Welcome {displayName}</h1>

      {/* Add Document Form */}
      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Add New Document</h2>
        <Input
          type='text'
          placeholder='Title'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className='w-full border border-gray-300 rounded p-2 mb-2'
        />
        <textarea
          placeholder='Content (optional)'
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className='w-full border border-gray-300 rounded p-2 mb-2'
        />
        <button
          onClick={handleAddDocument}
          disabled={adding}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          {adding ? 'Adding...' : 'Add Document'}
        </button>
      </div>

      {/* Documents Table */}
      <table className='table-auto w-full border border-gray-200'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2 text-left'>Title</th>
            <th className='px-4 py-2 text-left'>Created At</th>
            <th className='px-4 py-2 text-left'>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {[...documents]
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((document) => (
              <tr key={document.id} className='border-t'>
                <td className='p-2'>
                  <Link
                    href={`/dashboard/document/${document.id}`}
                    className='text-blue-600 hover:underline'
                  >
                    {document.title}
                  </Link>
                </td>
                <td className='px-4 py-2'>
                  {new Date(document.created_at).toLocaleString()}
                </td>
                <td className='px-4 py-2'>
                  {new Date(document.updated_at).toLocaleString()}
                </td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    className='text-red-600 hover:underline cursor-pointer'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
