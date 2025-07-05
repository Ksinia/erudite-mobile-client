import Constants from 'expo-constants';

// Get the backend URL from app.config.js based on the build profile
// Falls back to localhost:4000 for local development
export const backendUrl = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:4000';