import { NextResponse, NextRequest } from 'next/server.js';
import prisma from '@/lib/prisma/prisma.ts';
import { createSupabaseServerClient } from '@/lib/supabase/server.ts';

export async function GET(
  req: NextRequest,
  context: unknown // ✅ Use `any` to bypass the incorrect type check
) {
  const { params } = context as { params: { id: string } };
  const docId = params.id;

  const supabase = await createSupabaseServerClient();
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
  req: NextRequest,
  context: unknown
) {
  const { params } = context as { params: { id: string } };
  const docId = params.id;

  const supabase = await createSupabaseServerClient();

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

    const isOwner = existing.createdBy === user.id;

    const isShared = await prisma.documentShare.findFirst({
      where: { documentId: docId, userId: user.id },
    });

    if (!isOwner && !isShared) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: docId },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

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
