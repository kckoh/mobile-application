import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { style } from './index';

const TTSPage = () => {
  const navigation = useNavigation();

  const goToMap = () => {
    navigation.navigate('MapPage'); // Navigate to DetailsScreen
  }
  const goToTTS = () => {
    navigation.navigate('TTSPage'); // Navigate to DetailsScreen
  };

  const goToSTT = () => {
    navigation.navigate('STTPage'); // Navigate to DetailsScreen
  };
  
  const [inputValue, setInputValue] = useState('');
  const [displayText, setDisplayText] = useState('New');
  
  const handleButtonPress = () => {
    setDisplayText(inputValue); // Set the value from TextInput to <Text>
  };

  return (
    <View style={style.container}>
      <Text>TTS Screen</Text>
      <TextInput
        placeholder="Type here..."
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
      />
      <Button title="Set Text" onPress={handleButtonPress} ></Button>
      <Text>{displayText}</Text>
    </View>
  );
};

export default TTSPage;
