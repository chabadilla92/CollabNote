import WelcomeSection from '@/components/auth/WelcomeSection';
import SignupForm from '@/app/signup/components/SignupForm';

const SignUpPage = () => {
  return (
    <div className='flex h-full gap-4 items-center'>
      <WelcomeSection />
      <SignupForm />
    </div>
  );
};

export default SignUpPage;
