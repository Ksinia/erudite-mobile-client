const nodeEnvironment = process.env.NODE_ENV;

const getBackendUrl = () => {
  switch (nodeEnvironment) {
    case 'development':
      return 'http://localhost:4000';
    case 'production':
      return 'https://k-erudite.herokuapp.com';
    default:
      return 'https://k-erudite.herokuapp.com';
  }
};


const config = {
  environment: nodeEnvironment,
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL ?? getBackendUrl(),
};

console.log("backend url:", config.backendUrl);
console.log("nodeEnvironment:", nodeEnvironment);


export default config;