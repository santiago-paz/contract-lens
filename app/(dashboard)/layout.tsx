import { getSession } from '@/lib/auth';
import { DashboardShell } from '@/components/shell/DashboardShell';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const user = {
    name: session.name as string | null,
    email: session.email as string
  };

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
