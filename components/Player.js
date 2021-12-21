import { 
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
 } from "@heroicons/react/outline";
import { 
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';



function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentIdTrack(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = ()  => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if(data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  //console.log('log: '+songInfo)
  return (
    <div className='h-24 gb-gradient-to-b from-black 
    to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      {/* flex */}
      <div className="flex items-center space-x-4">
        <img
          className='hidden md:inline h-10 w-10'
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>
      {/* center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className='button' />
        <RewindIcon className="button"
          //  onClick={()=> spotifyApi.skipToPrevious()}
         />

      {isPlaying ? (
        <PlayIcon className="button h-10 w-10" 
          onClick={handlePlayPause}
         />

      ):(
        <PauseIcon className="button h-10 w-10" 
          onClick={handlePlayPause}
         />
      )}
      <FastForwardIcon 
        // onClick={() => spotifyApi.skipToNext() }
        className="button"
      />
      </div>
    </div>
  );
}

export default Player;
