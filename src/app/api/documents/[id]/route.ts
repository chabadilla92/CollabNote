import { NextResponse, NextRequest } from 'next/server.js';
import prisma from '@/lib/prisma/prisma.ts';
import { createSupabaseServerClient } from '@/lib/supabase/server.ts';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const docId = params.id;

  try {
    const document = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Optional: Only return if current user is the owner
    if (document.createdBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('[GET_DOC_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const docId = params.id;
  const body = await req.json();
  const { title, content } = body;

  try {
    // Optional: Validate ownership before update
    const existing = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!existing || existing.createdBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: docId },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('[UPDATE_DOC_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const docId = params.id;

  try {
    const existing = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!existing || existing.createdBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.document.delete({
      where: { id: docId },
    });

    return NextResponse.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('[DELETE_DOC_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
