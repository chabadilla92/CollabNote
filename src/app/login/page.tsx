import WelcomeSection from '@/components/ui/WelcomeSection.tsx';
import LoginForm from './components/LoginForm.tsx';

const LoginPage = () => {
  return (
    <div className='flex h-full gap-4 items-center'>
      <WelcomeSection />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
