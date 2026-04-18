import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AcceptInviteClient } from './AcceptInviteClient';
import { LogoutAndRedirect } from './LogoutAndRedirect';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      organization: { select: { name: true } },
      invitedBy: { select: { name: true, email: true } },
    },
  });

  if (!invitation) {
    return <InviteError message="This invitation link is invalid." />;
  }

  if (invitation.acceptedAt) {
    return <InviteError message="This invitation has already been used." />;
  }

  if (invitation.expiresAt < new Date()) {
    return <InviteError message="This invitation has expired." />;
  }

  const session = await getSession();

  // Check if the invited email already has an account
  const invitedUser = await prisma.user.findUnique({
    where: { email: invitation.email },
    select: { id: true },
  });

  const redirectParam = encodeURIComponent(`/invite/${token}`);
  const emailParam = encodeURIComponent(invitation.email);

  // Not logged in
  if (!session) {
    if (invitedUser) {
      // User exists — send to login
      redirect(`/login?redirect=${redirectParam}`);
    } else {
      // No account yet — send to register with email prefilled
      redirect(`/register?redirect=${redirectParam}&email=${emailParam}`);
    }
  }

  // Logged in but wrong account
  if (session.email !== invitation.email) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-black shadow-hard p-8">
            <h1 className="text-lg font-bold font-mono uppercase tracking-wider mb-4">
              Wrong Account
            </h1>
            <p className="text-sm text-gray-600 font-mono mb-2">
              This invitation was sent to <strong>{invitation.email}</strong>.
            </p>
            <p className="text-sm text-gray-600 font-mono mb-6">
              You are currently logged in as <strong>{session.email}</strong>.
            </p>
            <p className="text-sm text-gray-500 font-mono mb-6">
              Log out and {invitedUser ? 'sign in' : 'create an account'} with the correct email to accept.
            </p>
            <LogoutAndRedirect
              href={invitedUser
                ? `/login?redirect=${redirectParam}`
                : `/register?redirect=${redirectParam}&email=${emailParam}`
              }
              label={invitedUser ? 'Sign in with correct account' : 'Create account'}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black shadow-hard p-8">
          <h1 className="text-lg font-bold font-mono uppercase tracking-wider mb-6">
            You&apos;ve been invited
          </h1>
          <p className="text-sm text-gray-600 font-mono mb-2">
            <strong>{invitation.invitedBy.name || invitation.invitedBy.email}</strong> invited you to join
          </p>
          <p className="text-xl font-bold font-mono mb-1">{invitation.organization.name}</p>
          <p className="text-xs text-gray-500 font-mono mb-8">
            Role: <span className="uppercase font-bold">{invitation.role}</span>
          </p>
          <AcceptInviteClient token={token} />
        </div>
      </div>
    </div>
  );
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black shadow-hard p-8">
          <h1 className="text-lg font-bold font-mono uppercase tracking-wider mb-4">
            Invitation Error
          </h1>
          <p className="text-sm text-gray-600 font-mono">{message}</p>
        </div>
      </div>
    </div>
  );
}
