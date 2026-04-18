import { getSessionWithOrg } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getMembers, getPendingInvitations } from '@/app/actions/members';
import { hasPermission, type Role } from '@/lib/permissions';
import { MembersClient } from './MembersClient';

export default async function MembersPage() {
  const session = await getSessionWithOrg();
  if (!session) redirect('/login');

  const [members, invitations] = await Promise.all([
    getMembers(),
    getPendingInvitations(),
  ]);

  const canInvite = hasPermission(session.role, 'org:invite');
  const canRemove = hasPermission(session.role, 'org:remove_member');

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold font-mono uppercase tracking-wider">Members</h1>
        <p className="text-sm text-gray-500 font-mono mt-1">Manage your organization&apos;s team</p>
      </div>

      <MembersClient
        members={members}
        invitations={invitations}
        canInvite={canInvite}
        canRemove={canRemove}
        currentUserId={session.userId}
      />
    </div>
  );
}
