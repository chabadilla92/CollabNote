import { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
// or Supabase provider if you're using that

const authOptions: NextAuthOptions = {
  // config here
};

export default authOptions;
