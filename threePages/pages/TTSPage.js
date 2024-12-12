import React, { useEffect,useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import style from './styles';
import axios from 'axios';
import { Audio } from 'expo-av';
import { TTS_API_KEY, url} from './env';
import { Picker } from '@react-native-picker/picker';

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
  const [displayText, setDisplayText] = useState('');
  const [audioURI, setAudioURI] = useState(null);
  const [sound, setSound] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('en-US-Standard-A');
  const englishVoices = [
    "en-US-Standard-A",
    "en-US-Standard-B",
    "en-US-Standard-C",
    "en-US-Standard-D",
    "en-US-Standard-E",
    "en-US-Standard-F",
    "en-US-Standard-G",
    "en-US-Standard-H",
    "en-US-Standard-I",
    "en-US-Standard-J"
  ];
  
  const koreanVoices = [
    "ko-KR-Standard-A",
    "ko-KR-Standard-B",
    "ko-KR-Standard-C",
    "ko-KR-Standard-D",
  ];
  // set voice options to the selected language
  const voices = selectedLanguage === "en-US" ? englishVoices : koreanVoices;

  // for display
  const [synthesizedLanguage, setSynthesizedLanguage] = useState('');
  const [synthesizedVoice, setSynthesizedVoice] = useState('');

  const handleLanguageChange = (language) => {
    // set language
    setSelectedLanguage(language);
    const lang = language === "en-US" ? "en" : "ko";
    // when the voice is changed set the voice to the first one
    const firstVoice = language === "en-US" ? englishVoices[0] : koreanVoices[0];
    setSelectedVoice(firstVoice);    
  };
  
  const synthesizeSpeech = async () => {
    if (!inputValue) {
      Alert.alert('Error', 'Please enter text to synthesize.');
      return;
    }

    // only selected LanguageCode can be synthesized
    const requestBody = {
      input: { text: inputValue },
      voice: {
        // https://cloud.google.com/text-to-speech/docs/voices?hl=ko
        languageCode: selectedLanguage, // Choose your desired language code
        name: selectedVoice,
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
        // set display
        setDisplayText(inputValue);
        setSynthesizedLanguage(selectedLanguage);
        setSynthesizedVoice(selectedVoice);
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

  useEffect(() => {
    // This effect runs once on mount, and the cleanup runs on unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  
  
  return (
    <View style={style.container}>

      <View style={style.body}>
        {/* Language Picker */}
        <Text>LanguageCode: {selectedLanguage}</Text>
      </View>

      <View style={style.body}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => handleLanguageChange(itemValue)}
          style={style.picker}
          >
          <Picker.Item label="English" value="en-US" />
          <Picker.Item label="Korean" value="ko-KR" />
        </Picker>
      </View>

      <View style={style.body}>
        {/* Voice Picker */}
        <Text>Voice Options</Text>
      </View>

      <View style={style.body}>
        <Picker
          selectedValue={selectedVoice}
          onValueChange={(itemValue) => setSelectedVoice(itemValue)}
          style={style.picker}
          >
          {voices.map((voice, index) => (
            <Picker.Item key={index} label={voice} value={voice} />
          ))}
        </Picker>
      </View>

      <View style={style.inputContainer}>
        <TextInput
          placeholder="Type here..."
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          style={style.input}
        />
        <Button title="Synthesize Speech" onPress={synthesizeSpeech}/>
      </View>
      
      <View style={style.body}>
        <Text>Current Synthesized Text:</Text>
        <Text>{displayText}</Text>
      </View>

      <View style={style.body}>
        <Text>Synthesized Language: {synthesizedLanguage}</Text>
        <Text>Synthesized Voice: {synthesizedVoice}</Text>
      </View>

      <View style={style.body}>
        <Button title="Play Audio" onPress={playAudio} disabled={!audioURI} />
      </View>
    </View>
  );
};

export default TTSPage;
