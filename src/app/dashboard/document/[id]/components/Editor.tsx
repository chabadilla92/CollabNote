'use client';

import { useState, useCallback } from 'react';
import { updateDocumentContent } from '@/lib/supabase/document.ts';
import { useWebSocket } from '@/hooks/useWebSocket.ts';

type Props = {
  docId: string;
};

export default function Editor({
  initialContent,
  docId,
}: {
  initialContent: string;
  docId: string;
}) {
  const [content, setContent] = useState(initialContent);

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'update') {
      setContent(data.content);
    }
  }, []);

  const { send } = useWebSocket(docId, handleMessage);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    send({ type: 'update', content: value });
  };

  const handleSave = async () => {
    await updateDocumentContent(docId, content);
    alert('Saved!');
  };

  return (
    <div>
      <textarea
        className='w-full h-64 p-2 border border-gray-300 rounded'
        value={content}
        onChange={handleChange}
        placeholder='Start typing...'
      />
      <button
        className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
