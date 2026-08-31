import { notFound } from 'next/navigation';
import { getSessionWithOrg } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

/**
 * Server-side authorization gate for every /admin/* route.
 *
 * The proxy only guarantees an authenticated session with an org; it does not
 * know roles. Without this, any signed-in member could reach the playground
 * and spend the org's LLM budget. Unauthorized users get a 404 rather than a
 * 403 so the surface isn't advertised.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionWithOrg();

  if (!session || !hasPermission(session.role, 'admin:access')) {
    notFound();
  }

  return <>{children}</>;
}
