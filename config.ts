const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

const getBackendUrl = () => {
  switch (environment) {
    case 'development':
      return 'http://localhost:4000';
    case 'preview':
      return 'https://k-erudite.herokuapp.com';
    case 'production':
      return 'https://k-erudite.herokuapp.com';
    default:
      return 'https://k-erudite.herokuapp.com';
  }
};

console.log("backend url:", getBackendUrl());
console.log("environment:", environment);

const config = {
  environment,
  backendUrl: getBackendUrl(),
};

export default config;