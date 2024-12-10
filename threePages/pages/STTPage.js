import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import  style  from './styles';

const STTPage = () => {
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

  return (
    <View style={style.container}>
      <Text>STT Screen</Text>
    </View>
  );
};

export default STTPage;
