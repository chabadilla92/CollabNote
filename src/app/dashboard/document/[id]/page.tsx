import { getDocumentById } from "@/lib/supabase/document.ts";
import Editor from "./components/Editor.tsx";
import prisma from "@/lib/prisma/prisma.ts";

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const doc = await getDocumentById(params.id);

  if (!doc) {
    return <div>Document not found</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold'>{doc.title}</h1>
      <Editor initialContent={doc.content} docId={doc.id} />
    </div>
  );
}
