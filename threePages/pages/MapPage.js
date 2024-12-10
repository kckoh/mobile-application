import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import  style  from './styles';
import MapView from 'react-native-maps';

const MapPage = () => {
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
    <View style={{flex:1}}>
        <View style={style.body}>

            {/* <Text>Map Screen</Text> */}
            <MapView style={{width: '100%', height: '100%'}}></MapView>
        </View>
    </View>
  );
};

export default MapPage;
