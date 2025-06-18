// components/auth/WelcomeSection.tsx
import { FileText } from 'lucide-react';

const WelcomeSection = () => {
  return (
    <div className='flex flex-col gap-4 flex-1 justify-center bg-gray-800 h-full items-center'>
      <div className='flex gap-2 items-center'>
        <FileText className='w-6 h-6 text-white' />
        <h1 className='text-3xl font-extrabold text-white'>
          Welcome to CollabNote
        </h1>
      </div>
      <div className='text-white text-center px-4'>
        Collaborate and create in real-time with seamless note-sharing and
        editing.
      </div>
    </div>
  );
};

export default WelcomeSection;
