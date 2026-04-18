'use client';

import { useActionState, useState, useTransition } from 'react';
import { sendInvitation, revokeInvitation, removeMember } from '@/app/actions/organization';
import { Mail, Trash2, UserPlus, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Member = {
  id: string;
  role: string;
  createdAt: Date;
  user: { id: string; email: string; name: string | null; avatar: string | null };
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  expiresAt: Date;
  createdAt: Date;
  invitedBy: { name: string | null; email: string };
};

interface MembersClientProps {
  members: Member[];
  invitations: Invitation[];
  canInvite: boolean;
  canRemove: boolean;
  currentUserId: string;
}

export function MembersClient({ members, invitations, canInvite, canRemove, currentUserId }: MembersClientProps) {
  const [state, formAction, isPending] = useActionState(sendInvitation, null);
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Invite Form */}
      {canInvite && (
        <div className="border-2 border-black p-6 bg-white shadow-hard-sm">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invite Member
          </h2>
          <form action={formAction} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder="email@example.com"
              className="flex-1 px-4 py-2.5 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
            />
            <select
              name="role"
              defaultValue="member"
              className="px-4 py-2.5 border-2 border-black font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold font-mono uppercase text-sm tracking-wider border-2 border-black shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Send
            </button>
          </form>
          {state?.error && (
            <p className="mt-3 text-sm text-red-600 font-mono p-2 border border-red-300 bg-red-50">{state.error}</p>
          )}
          {state?.success && (
            <p className="mt-3 text-sm text-green-700 font-mono p-2 border border-green-300 bg-green-50 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {state.success}
            </p>
          )}
        </div>
      )}

      {/* Members List */}
      <div>
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider mb-4">
          Members ({members.length})
        </h2>
        <div className="border-2 border-black divide-y-2 divide-black">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              canRemove={canRemove && member.user.id !== currentUserId && member.role !== 'owner'}
              onRemoved={() => router.refresh()}
            />
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div>
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider mb-4">
            Pending Invitations ({invitations.length})
          </h2>
          <div className="border-2 border-black divide-y-2 divide-black">
            {invitations.map((inv) => (
              <InvitationRow
                key={inv.id}
                invitation={inv}
                canRevoke={canInvite}
                onRevoked={() => router.refresh()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MemberRow({ member, canRemove, onRemoved }: { member: Member; canRemove: boolean; onRemoved: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    if (!confirm(`Remove ${member.user.name || member.user.email} from the organization?`)) return;
    startTransition(async () => {
      await removeMember(member.id);
      onRemoved();
    });
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
          {(member.user.name || member.user.email)[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-mono font-bold truncate">
            {member.user.name || member.user.email}
          </p>
          {member.user.name && (
            <p className="text-xs text-gray-500 font-mono truncate">{member.user.email}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 border border-black bg-gray-50">
          {member.role}
        </span>
        {canRemove && (
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-300 transition-colors disabled:opacity-50"
            title="Remove member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function InvitationRow({ invitation, canRevoke, onRevoked }: { invitation: Invitation; canRevoke: boolean; onRevoked: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleRevoke() {
    startTransition(async () => {
      await revokeInvitation(invitation.id);
      onRevoked();
    });
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50">
      <div className="min-w-0">
        <p className="text-sm font-mono truncate">{invitation.email}</p>
        <p className="text-xs text-gray-400 font-mono">
          Invited by {invitation.invitedBy.name || invitation.invitedBy.email}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 border border-dashed border-gray-400 text-gray-500">
          {invitation.role}
        </span>
        {canRevoke && (
          <button
            onClick={handleRevoke}
            disabled={isPending}
            className="text-xs font-mono text-gray-400 hover:text-red-600 underline disabled:opacity-50"
          >
            {isPending ? 'Revoking...' : 'Revoke'}
          </button>
        )}
      </div>
    </div>
  );
}
