'use client';

import { useEffect, useState } from 'react';
import supabase from '../../../lib/supabase/client'; // Ensure this is the correct path to your Supabase client
import { useSession } from '@supabase/auth-helpers-react'; // Optional: If using Supabase's authentication helpers

const Dashboard = () => {
  const session = useSession();  
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('Document')
          .select('*')
          .eq('createdBy', session.user.id); // Ensure 'createdBy' references the user's ID in the documents table

        if (error) {
          setError(error.message);
        } else {
          setDocuments(data);
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [session?.user?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='dashboard-container'>
      <h1>Dashboard</h1>
      <table className='table-auto w-full'>
        <thead>
          <tr>
            <th className='px-4 py-2'>Title</th>
            <th className='px-4 py-2'>Created At</th>
            <th className='px-4 py-2'>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td className='px-4 py-2'>{document.title}</td>
              <td className='px-4 py-2'>
                {new Date(document.created_at).toLocaleString()}
              </td>
              <td className='px-4 py-2'>
                {new Date(document.updated_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
