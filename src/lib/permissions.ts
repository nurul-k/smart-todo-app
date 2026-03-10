import { Session } from 'next-auth';

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user;
}

export function isUser(session: Session | null): boolean {
  return !!session?.user && (session.user as any).role === 'USER';
}

export function isAdmin(session: Session | null): boolean {
  return !!session?.user && (session.user as any).role === 'ADMIN';
}

export function checkUserOwnership(userId: string | undefined, targetUserId: string): boolean {
  return userId === targetUserId;
}
