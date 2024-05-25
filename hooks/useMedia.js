import { useState } from 'react';

export const useMedia = () => {
  const [ServerMediaItems, setServerMediaItems] = useState([]);
  const [ClientMediaItems, setClientMediaItems] = useState([]);
  const [ServerMediaFetched, setServerMediaFetched] = useState(false);
  const [ClientMediaFetched, setClientMediaFetched] = useState(false);
  const [onServerSearchItemPressed, setOnServerSearchItemPressed] = useState(() => () => {});
  const [onClientSearchItemPressed, setOnClientSearchItemPressed] = useState(() => () => {});

  return {
    ServerMediaItems, setServerMediaItems,
    ClientMediaItems, setClientMediaItems,
    ServerMediaFetched, setServerMediaFetched,
    ClientMediaFetched, setClientMediaFetched,
    onServerSearchItemPressed, setOnServerSearchItemPressed,
    onClientSearchItemPressed, setOnClientSearchItemPressed
  };
};