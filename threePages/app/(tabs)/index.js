import React from 'react';
import { View, Text, ActivityIndicator} from 'react-native';
import  style  from '../../fixedData/styles';
import MapView, { PROVIDER_GOOGLE, Marker }from 'react-native-maps';
import { useState } from 'react';
import {useCurrentLocation} from '../../components/mapComponents/googleMapController';
import {savedMarkers} from '../../components/mapComponents/markers';

const MapPage = () => {
  const {location, error} = useCurrentLocation(); // Call the custom hook
  const [markers, setMarkers] = useState(savedMarkers); // Initialize the markers array
  const [markerCount, setMarkerCount] = useState(1); // Initialize the marker count

  if (error) {
    return (
      <View style={style.centered}>
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
    // my current location (gps)
    // latitude: location.latitude,
    // longitude: location.longitude,

    // 경주
    latitude: 35.8561719,
    longitude: 129.2247477,
    latitudeDelta: 0.005, // Adjust the delta for zoom level
    longitudeDelta: 0.005, // Adjust the delta for zoom level
  };

  
  const addMarker = (event) => {
    const latitude = event.nativeEvent.coordinate.latitude;
    const longitude = event.nativeEvent.coordinate.longitude;
    markers.push({
      latitude: latitude,
      longitude: longitude,
      key: Math.random().toString(), // Generate a random key
      title: "New Marker",
      description: "markerCount: " + markerCount,
    });// Add a new marker to the array
    setMarkers([...markers]); // Update the markers array
    setMarkerCount(markerCount + 1); // Update the marker count
  };

  const mapStyle = [
    // Hides labels for all features.
    // {
    //   elementType: 'labels',
    //   stylers: [{ visibility: 'off' }],
    // },
    // Removes points of interest (e.g., restaurants, landmarks).
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    // Removes transit-related markers.
    // {
    //   featureType: 'transit',
    //   stylers: [{ visibility: 'off' }],
    // },
  ];

  //https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
  return (
    <View style={style.container}>
      <MapView
        style={style.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true} // Shows a blue dot for user's location
        showsMyLocationButton={true} // Shows a button to center the map on user's location
        loadingEnabled={true}
        customMapStyle={mapStyle}
        onPress={addMarker}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
            pinColor="red"
          />
        ))}
        {/* <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You are here" /> */}
      </MapView>
    </View>
  );
};

export default MapPage;
