# InkSpire Mobile

Frontend for the InkSpire mobile application built with React Native and Expo.

## Tech Stack
- Expo (React Native)
- Expo Router
- NativeWind & Tailwind CSS
- Zustand (State Management)
- React Query (Data Fetching)
- Axios

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the application:
   ```bash
   npx expo start
   ```

3. Open in Expo Go on your physical device, or press `a` for Android Emulator / `i` for iOS Simulator.

## Architecture

- `/app` - Expo Router screens and layouts
- `/components` - Reusable UI components
- `/constants` - Theme tokens and global constants
- `/services` - API configuration and external services
- `/store` - Zustand global state management
- `/utils` - Helper functions and utilities like SecureStore wrappers
