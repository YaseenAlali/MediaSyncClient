import { useEffect } from 'react';
import { AppContext } from '../Contexts/Contexts';
import { useMedia } from '../hooks/useMedia';
import { useMediaControls } from '../hooks/useMediaControls';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';


const AppProvider = ({ children }) => {
  const media = useMedia();
  const mediaControls = useMediaControls();


  useEffect(() => {
    TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
  }, []);
  return (
    <AppContext.Provider value={{ ...media, ...mediaControls }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;