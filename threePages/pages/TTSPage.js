import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { style } from './index';
import axios from 'axios';
import { Audio } from 'expo-av';
import { TTS_API_KEY } from '@env';

const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`;

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
  const [audioURI, setAudioURI] = useState(null);
  const [sound, setSound] = useState(null);
  
  const synthesizeSpeech = async () => {
    if (!inputValue) {
      Alert.alert('Error', 'Please enter text to synthesize.');
      return;
    }

    // only selected LanguageCode can be synthesized
    const requestBody = {
      input: { text: inputValue },
      voice: {
        languageCode: 'en-US', // Choose your desired language code
        ssmlGender: 'NEUTRAL', // Options: 'MALE', 'FEMALE', 'NEUTRAL'
      },
      audioConfig: {
        audioEncoding: 'MP3', // Options: 'MP3', 'LINEAR16', 'OGG_OPUS'
      },
    };

    try{
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = response.data;

      if (result && result.audioContent) {
        const audioContent = result.audioContent; // Base64-encoded audio
        const uri = `data:audio/mp3;base64,${audioContent}`;
        setAudioURI(uri);
      }
      else{
        Alert.alert('Error', 'Failed to synthesize speech.');
      }
    } 
    catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while synthesizing speech.');
    } 
  };

  const playAudio = async () => {
    if (!audioURI) {
      Alert.alert('Error', 'No audio to play.');
      return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioURI });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while playing audio.');
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
          setSound(null);
        }
      : undefined;
  }, [sound]);
  
  const handleButtonPress = () => {
    setDisplayText(inputValue); // Set the value from TextInput to <Text>
  };

  return (
    <View style={style.container}>
      <View style={style.body}>
        <Text>TTS Screen</Text>
        <TextInput
          placeholder="Type here..."
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
        <Button title="Set Text" onPress={handleButtonPress} ></Button>
        <Button title="Synthesize Speech" onPress={synthesizeSpeech} />
        <Button title="Play Audio" onPress={playAudio} disabled={!audioURI} />
        <Text>{displayText}</Text>
      </View>
      
    </View>
  );
};

export default TTSPage;
