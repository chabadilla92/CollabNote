import { NextRequest, NextResponse } from 'next/server.js';
import prisma from '@/lib/prisma/prisma.ts';
import { createSupabaseServerClient } from '@/lib/supabase/server.ts';

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const doc = await prisma.document.create({
      data: {
        title,
        content,
        createdBy: user.id, // this is the Supabase user.id
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error('[CREATE_DOC_ERROR]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { createdBy: user.id },
          {
            DocumentShare: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
