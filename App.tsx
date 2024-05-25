/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { ServerMedia } from './Screens/ServerMedia';
import { askForStoragePermissions, CreateDownloadsFolderIfDoesntExist, GetStorageRootPath } from './FileSystem/FileSystemUtils';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClientMedia } from './Screens/ClientMedia';
import NavigationTabs from './navigation/Tabs';
import TrackPlayer from 'react-native-track-player';



type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [Loaded, setLoaded] = useState(false);

  useEffect(() => {
    const setupPlayer = async () => {
      await askForStoragePermissions().then((result) => {
        console.log(GetStorageRootPath());
      });
      await TrackPlayer.setupPlayer();
      await CreateDownloadsFolderIfDoesntExist().then(() => console.log("Created directory"));
      setLoaded(true);
    };
  
    setupPlayer();
  }, []);
  

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  if (!Loaded) {
    return (<View></View>);
  }

  return (
    <NavigationContainer>
        <NavigationTabs></NavigationTabs>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
