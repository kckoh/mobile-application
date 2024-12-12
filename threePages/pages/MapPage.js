import React from 'react';
import { View, Text, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import  style  from './styles';
import MapView, { PROVIDER_GOOGLE, Marker }from 'react-native-maps';
import { useState, useEffect } from 'react';
import {requestLocationPermission, useCurrentLocation} from './googleMapController';

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

  const {location, error} = useCurrentLocation(); // Call the custom hook

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {errorMsg}</Text>
      </View>
    );
  }
  
  // Loading screen 
  if (!location) {
    return (
      <View style={style.body}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005, // Adjust the delta for zoom level
    longitudeDelta: 0.005, // Adjust the delta for zoom level
  };

  return (
    <View style={style.container}>
      <MapView
        style={style.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true} // Shows a blue dot for user's location
        loadingEnabled={true}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You are here" />
      </MapView>
    </View>
  );
};

export default MapPage;
