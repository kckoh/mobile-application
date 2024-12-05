// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapPage, STTPage, TTSPage } from './pages';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function RootStack() {
  return (
    <Tab.Navigator initialRouteName='MapPage' screenOptions={{ headerShown: true } } >
      <Tab.Screen name="MapPage" component={MapPage} options={{ title: 'Map' }} />
      <Tab.Screen name="TTSPage" component={TTSPage} options={{ title: 'TTS' }} />
      <Tab.Screen name="STTPage" component={STTPage} options={{ title: 'STT' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}