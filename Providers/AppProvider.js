import { AppContext } from '../Contexts/Contexts';
import { useMedia } from '../hooks/useMedia';
import { useMediaControls } from '../hooks/useMediaControls';


const AppProvider = ({ children }) => {
  const media = useMedia();
  const mediaControls = useMediaControls();

  return (
    <AppContext.Provider value={{ ...media, ...mediaControls }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;