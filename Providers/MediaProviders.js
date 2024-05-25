const { useState } = require("react");
const { ServerMediaContext, MediaContext } = require("../Contexts/Contexts")

const MediaProviders = ({ children }) => {
    const [ServerMediaItems, setServerMediaItems] = useState([]);
    const [ClientMediaItems, setClientMediaItems] = useState([]);
    const [ServerMediaFetched, setServerMediaFetched] = useState(false);
    const [ClientMediaFetched, setClientMediaFetched] = useState(false);
    
    
    const [onServerSearchItemPressed, setOnServerSearchItemPressed] = useState(() => () => {
        
    });


    const [onClientSearchItemPressed, setOnClientSearchItemPressed] = useState(() => () => {
        
    });



    return (
        <MediaContext.Provider
            value={{ ServerMediaItems, setServerMediaItems,
                     ClientMediaItems, setClientMediaItems,
                     ServerMediaFetched, setServerMediaFetched,
                     ClientMediaFetched, setClientMediaFetched,
                     onServerSearchItemPressed, setOnServerSearchItemPressed,
                     onClientSearchItemPressed, setOnClientSearchItemPressed
                    }}
        >
            {children}
        </MediaContext.Provider>
    )
}

export default MediaProviders