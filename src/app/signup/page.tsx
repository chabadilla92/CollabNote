import WelcomeSection from '@/components/auth/WelcomeSection.tsx';
import SignupForm from './components/SignupForm.tsx';

const SignUpPage = () => {
  return (
    <div className='flex h-full gap-4 items-center'>
      <WelcomeSection />
      <SignupForm />
    </div>
  );
};

export default SignUpPage;
