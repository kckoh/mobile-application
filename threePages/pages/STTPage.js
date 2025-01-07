import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from './styles';
import { JP_IP_URL } from './env'; // Must point to your backend endpoint
import { Audio } from 'expo-av';
import axios from 'axios';
import WebSocketComponent from './websocket';

const STTPage = () => {
  const navigation = useNavigation();

  // Navigation (optional)
  const goToMap = () => navigation.navigate('MapPage');
  const goToTTS = () => navigation.navigate('TTSPage');
  const goToSTT = () => navigation.navigate('STTPage');
  
  const recordingOptions = {
    // https://www.youtube.com/watch?v=gcZSlMU-n48&t=40s 37:50
    ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
    android: {
      extension: '.amr',
      outputFormat: Audio.AndroidOutputFormat.AMR_WB,
      audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
      sampleRate: 16000,
      numberOfChannels: 1, 
      bitRate: 128000, 
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [transcription, setTranscription] = useState('');

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

      // Use the built-in high-quality recording preset
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setTranscription(''); // Clear old transcription when starting a new recording
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
      console.log('Recording saved at:', uri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  const getText = async () => {
    try {
      if (!audioUri) {
        console.warn('No audio file to transcribe.');
        return;
      }

      const formData = new FormData();
      // "audio" should match request.FILES.get('audio') in your Django view
      formData.append('audio', {
        uri: audioUri,
        name: 'audio.wav', // or any valid filename
        type: 'audio/wav', // match your recording type
      });
      
      console.log("sending request");
      
      const response = await axios.post(JP_IP_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      if (response.data && response.data.transcript) {
        setTranscription(response.data.transcript);
      } else {
        setTranscription('No transcript found in the response.');
      }
    } catch (error) {
      console.error('Failed to get Text:', error);
      setTranscription(`Error: ${error.message}`);
    }
  };

  WebSocketComponent();
    
  return (
    <View style={style.container}>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
      <Button title="STT" onPress={getText} disabled={!audioUri} />

      <Text>Audio saved at: {audioUri || 'No audio yet'}</Text>
      <Text>Transcription: {transcription}</Text>
    </View>
  );
};

export default STTPage;
