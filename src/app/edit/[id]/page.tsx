import { notFound } from 'next/navigation';
import { Stuff } from '../../../../generated/prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import EditStuffForm from '@/components/EditStuffForm';

export default async function EditStuffPage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const editID: number = +id;
  const stuff: Stuff | null = await prisma.stuff.findUnique({
    where: {
      id: editID,
    },
  });
  if (!stuff) {
    return notFound();
  }

  return (
    <main>
      <EditStuffForm stuff={stuff} />
    </main>
  );
}
