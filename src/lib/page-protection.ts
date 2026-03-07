import { redirect } from 'next/navigation';
import { Role } from '../../generated/prisma/enums';

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: { user: { email: string; id: string; name: string } } | null) => {
  if (!session) {
    redirect('/auth/signin');
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: { user: { email: string; id: string; name: string } } | null) => {
  loggedInProtectedPage(session);
  if (session && session.user.name !== Role.ADMIN) {
    redirect('/not-authorized');
  }
};
