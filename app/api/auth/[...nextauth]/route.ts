import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        if(!user.isVerified){
          throw new Error("Email not verified");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({user,account}){
      if(account?.provider==="google"){
        await connectDB();

        const existingUser=await User.findOne({email:user.email});

        if(!existingUser){
          await User.create({
            name:user.name || "Google User",
            email:user.email,
            isVerified:true
          });
        }else if(!existingUser.isVerified){
          existingUser.isVerified=true;
          await existingUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user,account }) {

      if (user) token.id = user.id;

      if(account){
        await connectDB();
        const dbUser=await User.findOne({email:token.email});
        if(dbUser){
          token.id=dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
