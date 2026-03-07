import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/prisma';

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    providers: [Credentials({
        credentials: {
            email: {
                label: 'Email',
                type: 'email',
                placeholder: 'john@foo.com',
            },
            password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials) => {
            if (!credentials?.email || !credentials.password) {
                return null;
            }
            const user = await prisma.user.findFirst({
                where: {
                    email: credentials.email,
                }
            });
            if (!user) {
                return null;
            }

            const isPasswordValid = await compare(credentials.password as string, user.password);
            if (!isPasswordValid) {
                return null;
            }

            // console.log('User authenticated', { user }, 'Returning user object with id, email, and role');
            return {
                id: `${user.id}`,
                email: user.email,
                role: user.role,
                name: user.role,
            };
        },

    }),
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        //   error: '/auth/error',
        //   verifyRequest: '/auth/verify-request',
        //   newUser: '/auth/new-user'
    },
    callbacks: {
        session: ({ session, token }) => {
            // console.log('Session Callback', { session, token, user })
            return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      }
        },
        jwt: ({ token, account }) => {
            // console.log('JWT Callback', { token, account })
            if (account) {
                token.randomKey = account.randomKey;
                token.id = account.id;
            }
            return token;
        },
    },
});
