import DocumentTable from './components/DocumentTable.tsx';
import Navbar from '@/components/ui/Navbar.tsx';

const Dashboard = async () => {
  return (
    <div className='flex h-full'>
      <Navbar />
      <main className='flex-1 pl-16 px-4 py-6 max-w-4xl mx-auto'>
        <DocumentTable />
      </main>
    </div>
  );
};

export default Dashboard;
