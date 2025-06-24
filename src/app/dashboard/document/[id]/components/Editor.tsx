'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket.ts';
import { updateDocument, shareDocument } from '@/lib/api/documents.ts';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import debounce from 'lodash.debounce';

type Props = {
  initialContent: string;
  docId: string;
};

type WebSocketMessage = {
  type: 'update';
  content: string;
};

export default function Editor({ initialContent, docId }: Props) {
  const [content, setContent] = useState(initialContent);
  const [shareEmail, setShareEmail] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-doc-${docId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', // just listen to updates
          schema: 'public',
          table: 'Document',
          filter: `id=eq.${docId}`,
        },
        (payload) => {
          const newContent = payload.new?.content;
          if (newContent && newContent !== content) {
            setContent(newContent);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, docId, content]);

  const handleMessage = useCallback((data: WebSocketMessage) => {
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

  // -- Debounced autosave --
  const debouncedSave = useRef(
    debounce(async (content: string) => {
      try {
        await updateDocument(docId, content);
      } catch (err) {
        console.error('Autosave failed:', err);
      }
    }, 1000)
  ).current;

  const handleInput = () => {
    if (!editorRef.current) return;
    const updated = editorRef.current.innerHTML;
    setContent(updated);
    send({ type: 'update', content: updated }); // Optional WebSocket broadcast
    debouncedSave(updated); // Autosave to DB
  };

  const handleSave = async () => {
    try {
      await updateDocument(docId, content);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleShare = async () => {
    try {
      await shareDocument(docId, shareEmail);
      alert(`Document shared with ${shareEmail}`);
      setShareEmail('');
    } catch (e) {
      console.error(e);
      alert('Error sharing document');
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
      />
      <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0'>
        <button
          className='bg-gray-800 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-500'
          onClick={handleSave}
        >
          Save
        </button>

        <input
          type='email'
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}
          placeholder='Enter email to share'
          className='border px-3 py-2 rounded w-full sm:w-auto'
        />

        <button
          className='bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700'
          onClick={handleShare}
          disabled={!shareEmail}
        >
          Share
        </button>
      </div>
    </div>
  );
}
