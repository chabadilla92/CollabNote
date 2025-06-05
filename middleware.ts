// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server.js';
import type { NextRequest } from 'next/server.js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession(); // Ensures cookie is parsed
  return res;
}

// Apply middleware only to relevant routes
export const config = {
  matcher: ['/api/(.*)'],
};
