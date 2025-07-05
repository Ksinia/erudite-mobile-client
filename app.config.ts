import { ExpoConfig, ConfigContext } from 'expo/config';

type BuildProfile = 'development' | 'development-simulator' | 'preview' | 'production';

const backendUrls: Record<BuildProfile, string> = {
  development: 'http://localhost:4000',
  'development-simulator': 'http://localhost:4000',
  preview: 'https://k-erudite.herokuapp.com',
  production: 'https://k-erudite.herokuapp.com',
};

export default ({ config }: ConfigContext): ExpoConfig => {
  // Get the EAS profile from environment
  const profile = process.env.EAS_BUILD_PROFILE as BuildProfile | undefined;
  
  // Get the appropriate backend URL based on the profile
  // Default to localhost for local development
  const backendUrl = profile ? backendUrls[profile] : 'http://localhost:4000';
  
  return {
    ...config,
    name: config.name!,
    slug: config.slug!,
    extra: {
      ...config.extra,
      backendUrl,
      // You can add more environment-specific variables here
    },
  } as ExpoConfig;
};