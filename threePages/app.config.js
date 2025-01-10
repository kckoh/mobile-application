import { ANDROID_MAP_API_KEY, IOS_MAP_API_KEY } from './fixedData/env';

export default {
    expo: {
      name: "MyApp",
      slug: "my-app",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      scheme: "your-app-scheme",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      newArchEnabled: true,
      android: {
        package: "com.mycompany.myapp",
        permissions: [
            "ACCESS_COARSE_LOCATION",
            "ACCESS_FINE_LOCATION"
        ],
        config: {
          googleMaps: {
            apiKey: ANDROID_MAP_API_KEY
          }
        }
      },
      ios: {
        bundleIdentifier: "com.mycompany.myapp",
        infoPlist: {
            NSLocationWhenInUseUsageDescription: "This app uses your location to show your position on the map."
        },
        config: {
          googleMapsApiKey: IOS_MAP_API_KEY
        }
      },
      assetBundlePatterns: ["**/*"],
      experiments: {
        typedRoutes: true
      },
      // web: {
      //   bundler: "metro"
      // },
    }
  };
  