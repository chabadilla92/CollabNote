import WelcomeSection from '@/components/auth/WelcomeSection';
import LoginForm from './components/LoginForm'

const LoginPage = () => {
  return (
    <div className='flex h-full gap-4 items-center'>
      <WelcomeSection />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
