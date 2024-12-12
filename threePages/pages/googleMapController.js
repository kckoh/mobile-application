import { PermissionsAndroid, Platform, Alert} from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export async function requestLocationPermission() {
  // IOS does not need extra permissions, just need to put the permission in `app.config.js`
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission Required",
          message:
            "This app needs to access your location to show your position on the map.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}


export const useCurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission not granted');
        return;
      }

      try {
        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      } catch (err) {
        setError(err.message);
        console.error('Expo Location error:', err);
      }
    };

    getLocation();
  }, []);

  return { location, error };
};
