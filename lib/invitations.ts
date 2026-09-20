import { prisma } from '@/lib/prisma';

/**
 * Pull the token out of an invite destination such as "/invite/abc123".
 * Anything else returns null.
 */
export function inviteTokenFromPath(path?: string): string | null {
  if (!path) return null;
  const match = /^\/invite\/([A-Za-z0-9_-]+)\/?$/.exec(path);
  return match ? match[1] : null;
}

/**
 * Public sign-up is closed, so an account can only be created from a live
 * invitation. Returns the invited address when the link carries a token that
 * is real, unused and still in date, and null in every other case.
 *
 * `email` is the address the visitor arrived with or typed. It has to match
 * the invitation, so a valid token cannot be reused to register some other
 * address.
 */
export async function openInvitationEmail(
  redirectPath?: string,
  email?: string,
): Promise<string | null> {
  const token = inviteTokenFromPath(redirectPath);
  if (!token) return null;

  // A door that is meant to be shut stays shut when the lookup fails, so a
  // database error closes the page rather than opening it.
  let invitation: { email: string; acceptedAt: Date | null; expiresAt: Date } | null = null;
  try {
    invitation = await prisma.invitation.findUnique({
      where: { token },
      select: { email: true, acceptedAt: true, expiresAt: true },
    });
  } catch (error) {
    console.error('Invitation lookup failed:', error);
    return null;
  }

  if (!invitation) return null;
  if (invitation.acceptedAt) return null;
  if (invitation.expiresAt < new Date()) return null;

  if (email && email.trim().toLowerCase() !== invitation.email.toLowerCase()) {
    return null;
  }

  return invitation.email;
}
