import { useEffect } from "react";
import { signIn, singIn, useSession } from "next-auth/react";
import spotifyApi from '../lib/spotify';

const spotifyApi = new SpotifyWebApi({
  clienteId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  // redirectUri: process.env.NEXT_PUBLIC_CLIENT_ID,  
});

function useSpotify() {
  const {data: session, status} = useSession();
  
  useEffect(() => {
    if(session) {
      if(session.error === 'RefreshAccessTokenError') {
        signIn();
      }

      spotifyApi.setAccessToken(session.user.setAccessToken);

    }
  }, [session]);
  
  return spotifyApi;
}

export default useSpotify
