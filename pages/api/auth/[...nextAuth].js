import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/github";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";
const refreshAccessToken = async (token) => {
  try {
    spotifyApi.setAccessToken(token?.accessToken);
    spotifyApi.setRefreshToken(token?.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    return {
      ...token,
      accessToken: refreshedToken?.access_token,
      accessTokenExpires: Date.now + refreshedToken?.expires_in * 1000,
      refreshToken: refreshedToken?.refresh_token ?? token?.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_CLIENT_PUBLIC_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      //Access token has already expired
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token?.user;
      session.accessToken = token?.accessToken;
      session.error = token?.error;
      return session;
    },
  },
});
