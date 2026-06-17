import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'InkSpire',
  slug: 'inkspire',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0f0f1a'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.inkspire.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0f0f1a'
    },
    package: 'com.inkspire.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  scheme: 'inkspire',
  plugins: [
    'expo-router',
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/SpaceMono-Regular.ttf'
        ]
      }
    ],
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#8b5cf6'
      }
    ]
  ],
  extra: {
    eas: {
      projectId: process.env.EXPO_PROJECT_ID || 'dummy-project-id'
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api'
  }
});
