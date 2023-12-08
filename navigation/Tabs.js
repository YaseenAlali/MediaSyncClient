import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
// import React from 'react';
import { ServerMedia } from '../Screens/ServerMedia';
import { ClientMedia } from '../Screens/ClientMedia';
import { Button, TouchableOpacity, Text, View } from 'react-native'
import SearchButton from '../Components/SearchButton';
import { ClientMediaContext, ServerMediaContext } from '../Contexts/Contexts';
import { useState, useEffect } from 'react'

const Tab = createBottomTabNavigator();

function NavigationTabs() {
  const [ServerMediaItems, setServerMediaItems] = useState([]);
  const [ClientMediaItems, setClientMediaItems] = useState([]);
  const [onSearchItemPressed, setOnSearchItemPressed] = useState(() => () => {
    console.log("called the wrong one");
  });

  return (
    <ServerMediaContext.Provider value={{ ServerMediaItems, setServerMediaItems, onSearchItemPressed, setOnSearchItemPressed }}>
      <ClientMediaContext.Provider value={{ ClientMediaItems, setClientMediaItems }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Server') {
                iconName = 'server'
              } else if (route.name === 'Device') {
                iconName = 'user'
              }

              return <Icon name={iconName} size={size} color={color} />;
            },

            "tabBarActiveTintColor": "purple",
            "tabBarInactiveTintColor": "gray",
            "tabBarStyle": [
              {
                "display": "flex"
              },
              null
            ]
          })}
        >
          <Tab.Screen
            name="Server"
            component={ServerMedia}
            options={{
              headerRight: () => (
                <SearchButton searchingServer={true}></SearchButton>
              ),
              headerTitleStyle: { color: 'purple' },
              headerBackground: () => {
                return (
                  <View style={{ backgroundColor: 'black', flex: 1, alignItems: 'center', position : 'absolute',  top: 0, bottom: 0, left: 0, right: 0}}>
                    <View style={{ borderColor: 'purple', borderWidth: 1, borderRadius: 25, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>

                    </View>
                  </View>
                )
              }
            }}
          />

          <Tab.Screen
            name="Device"
            component={ClientMedia}
            options={{
              headerRight: () => (
                <Button
                  onPress={() => { }}
                  title="test"
                  color="#00cc00"
                />
              ),
            }}
          />
        </Tab.Navigator>
      </ClientMediaContext.Provider>
    </ServerMediaContext.Provider>
  );
}

export default NavigationTabs