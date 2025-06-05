declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  // Optional: extend User type too if you use it somewhere
  interface User {
    id: string;
  }
}
