// src/app/api/documents/[id]/share/route.ts
import prisma from '@/lib/prisma/prisma.ts';
import { NextResponse, NextRequest } from 'next/server.js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/app/types/supabase.ts';
import { cookies } from 'next/headers.js';

export async function POST(req: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } };
  const docId = params.id;

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await req.json();

  const doc = await prisma.document.findUnique({ where: { id: docId } });

  if (!doc || doc.createdBy !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const recipient = await prisma.user.findFirst({ where: { email } });

  if (!recipient) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const alreadyShared = await prisma.documentShare.findUnique({
    where: {
      documentId_userId: {
        documentId: docId,
        userId: recipient.id,
      },
    },
  });

  if (alreadyShared) {
    return NextResponse.json({ error: 'Already shared' }, { status: 400 });
  }

  await prisma.documentShare.create({
    data: {
      documentId: docId,
      userId: recipient.id,
      createdBy: doc.createdBy,
      updatedAt: doc.updatedAt,
    },
  });

  return NextResponse.json({ success: true, sharedWith: recipient.email });
}