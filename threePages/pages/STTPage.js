import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from './styles';
import { STT_API_KEY, STT_URL} from './env';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const STTPage = () => {
  const navigation = useNavigation();

  const goToMap = () => {
    navigation.navigate('MapPage');
  };
  const goToTTS = () => {
    navigation.navigate('TTSPage');
  };
  const goToSTT = () => {
    navigation.navigate('STTPage');
  };


  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [transcription, setTranscription] = useState('');

  const recordingOptions = {
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
      sampleRate: 16000,
      numberOfChannels: 1,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 16000,
      numberOfChannels: 1,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };
  
  const startRecording = async () => {
    try {
      // Ask for permission
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert('Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY); // Use custom options
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
      console.log('Recording saved at:', uri);

      // Optionally, you can automatically trigger transcription here
      // await getText();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  // GOOGLE STT
  const convertToBase64 = async (uri) => {
    try {
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Base64 Audio Length:', base64Audio.length);
      return base64Audio;
    } catch (error) {
      console.error('Error converting file to Base64:', error);
      throw error; // Re-throw to handle in getText
    }
  };

  const transcribeAudio = async (audioURI) => {
    const API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${STT_API_KEY}`;
    
    const request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',//'ko-KR',
      },
      audio: {
        content: await FileSystem.readAsStringAsync(audioURI, { encoding: FileSystem.EncodingType.Base64 }),
      },
    };
    
    try {
      console.log('Sending request to STT API:', request);
      const response = await axios.post(API_URL, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('STT API response:', response.data);
      
      if (response.data.results && response.data.results.length > 0) {
        const transcription = response.data.results[0]?.alternatives[0]?.transcript || 'No transcription found.';
        return transcription;
      } else {
        console.warn('No transcription results found in the response.');
        return 'No transcription found.';
      }
    } catch (error) {
      console.error('Error with Google Speech-to-Text API:', error.response?.data || error.message);
      return 'Error occurred while transcribing.';
    }
  };

  const getText = async () => {
    try {
      if (!audioUri) return;
      const linear16 = require('linear16');

      (async () => {
      
      const outPath = await linear16('./input.m4a', './output.wav');
      console.log(outPath); // Returns the output path, ex: ./output.wav
      
      })();
      const result = await transcribeAudio(audioUri);
      
      // Set transcript
      setTranscription(result);
      console.log(result);
    } catch (error) {
      console.error('Failed to get Text: ', error);
    }
  };

  return (
    <View style={style.container}>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
      <Button title="STT" onPress={getText} disabled={!audioUri} />
      <Text>Audio saved at: {audioUri}</Text>
      <Text>Transcription: {transcription}</Text>
    </View>
  );
};

export default STTPage;
