import React from 'react'
import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: true } } >
      <Tabs.Screen name="index" options={{ title: 'Map' }} />
      <Tabs.Screen name="TTSPage" options={{ title: 'TTS' }} />
      <Tabs.Screen name="STTPage" options={{ title: 'STT' }} />
    </Tabs>
  )
}

export default TabsLayout