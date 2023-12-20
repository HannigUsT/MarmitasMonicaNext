import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      const dbUserType = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.perfil = dbUserType?.perfil;
        session.user.privacyPolicy = dbUserType?.privacyPolicy;
      }
      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.perfil) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            perfil: 0,
          },
        });
      }

      if (!dbUser.privacyPolicy) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            privacyPolicy: 0,
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        perfil: dbUser.perfil,
        privacyPolicy: dbUser.privacyPolicy,
      };
    },
    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
