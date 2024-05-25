import { useEffect, useState } from 'react';
import { PlaylistModes } from "../DataStructures/enum";
import TrackPlayer from 'react-native-track-player';

export const useMediaControls = () => {
  const [IsPlaying, setIsPlaying] = useState(false);
  const [TrackPosition, SetTrackPosition] = useState({ current: 0, end: 100 });
  const [TrackList, SetTrackList] = useState([]);
  const [TrackIndex, SetTrackIndex] = useState(0);
  const [PlaylistMode, SetPlaylistMode] = useState(PlaylistModes.Stop);
  const [ServerTrackIndex, setServerTrackIndex] = useState(-1);
  const [ClientTrackIndex, setClientTrackIndex] = useState(-1);


  useEffect(() => {
    if (IsPlaying){
      TrackPlayer.play();
    }
    else{
      TrackPlayer.pause();
    }
  }, [IsPlaying]);

  

  return {
    IsPlaying, setIsPlaying,
    TrackPosition, SetTrackPosition,
    TrackList, SetTrackList,
    TrackIndex, SetTrackIndex,
    PlaylistMode, SetPlaylistMode,
    ServerTrackIndex, setServerTrackIndex,
    ClientTrackIndex, setClientTrackIndex
  };
};