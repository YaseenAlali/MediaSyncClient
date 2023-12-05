import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { ServerMedia } from '../Screens/ServerMedia';
import { ClientMedia } from '../Screens/ClientMedia';
import {Button, TouchableOpacity, Text, View} from 'react-native'
import SearchButton from '../Components/SearchButton';

const Tab = createBottomTabNavigator();

function NavigationTabs() {
  return (
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
            <SearchButton></SearchButton>
          ),
        }}
      />
      <Tab.Screen 
        name="Device" 
        component={ClientMedia} 
        options={{
          headerRight: () => (
            <Button
              onPress={() => {}}
              title="test"
              color="#00cc00"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default NavigationTabs