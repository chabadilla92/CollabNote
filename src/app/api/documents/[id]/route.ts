import { NextResponse, NextRequest } from 'next/server.js';
import prisma from '@/lib/prisma/prisma.ts';
import { createSupabaseServerClient } from '@/lib/supabase/server.ts';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const awaitedParams = await params;
  const docId = awaitedParams.id;
  

  const supabase = await createSupabaseServerClient(); // ✅ handles cookies properly inside
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const document = await prisma.document.findFirst({
      where: {
        id: docId,
        OR: [
          { createdBy: user.id },
          {
            DocumentShare: {
              some: { userId: user.id },
            },
          },
        ],
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('[DOC_FETCH_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id]
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  // Await params before accessing
  const params = await context.params;
  const docId = params.id;

  const supabase = await createSupabaseServerClient();

  // Get user from Supabase auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content } = body;

  try {
    // Fetch document ownership info
    const existing = await prisma.document.findUnique({
      where: { id: docId },
      select: { createdBy: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check if user is owner
    const isOwner = existing.createdBy === user.id;

    // Check if user has share permission
    const isShared = await prisma.documentShare.findFirst({
      where: { documentId: docId, userId: user.id },
    });

    if (!isOwner && !isShared) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update document content/title
    const updatedDocument = await prisma.document.update({
      where: { id: docId },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    // If user is shared user, update DocumentShare.updatedAt timestamp
    if (isShared) {
      await prisma.documentShare.updateMany({
        where: { documentId: docId, userId: user.id },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("[UPDATE_DOC_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update document" },
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
