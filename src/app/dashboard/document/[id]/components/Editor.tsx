'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket.ts';
import { updateDocument } from '@/lib/api/documents.ts';

type Props = {
  initialContent: string;
  docId: string;
};

export default function Editor({ initialContent, docId }: Props) {
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'update') {
      setContent(data.content);
    }
  }, []);

  const { send } = useWebSocket(docId, handleMessage);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      const updated = editorRef.current.innerHTML;
      setContent(updated);
      send({ type: 'update', content: updated });
    }
  };

  const handleSave = async () => {
    try {
      await updateDocument(docId, content);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className='max-w-[8.5in] mx-auto my-4 bg-white p-8 border shadow-md'>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className='prose min-h-[11in] outline-none'
        placeholder='Start typing...'
      />
      <button
        className='mt-4 bg-gray-800 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-500'
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
