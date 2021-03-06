import SpotifyWebAPI from "spotify-web-api-node";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collabrative",
  "user-read-email",
  "streaming",
  "user-read-private",
  "user-library-read",
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);
const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString?.toString()}`;

const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.NEXT_CLIENT_PUBLIC_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
