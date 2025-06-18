'use client';

import { useEffect, useState } from 'react';
import { getDocument } from '@/lib/api/documents.ts';
import Editor from './components/Editor.tsx';
import Navbar from '@/components/ui/Navbar.tsx';
import { useParams } from 'next/navigation.js';

export default function DocumentPage() {
  const { id } = useParams() as { id: string };
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDocument(id)
      .then((fetchedDoc) => {
        setDoc(fetchedDoc);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !doc) return <div>{error || 'Document not found'}</div>;

  return (
    <div className='h-full'>
      <Navbar />
      <div className='flex-1 pl-16 px-4 py-6 max-w-4xl mx-auto'>
        <h1 className='text-xl font-bold'>{doc.title}</h1>
        <Editor initialContent={doc.content} docId={doc.id} />
      </div>
    </div>
  );
}
