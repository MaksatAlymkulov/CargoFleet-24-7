const prodConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'cargo-fleet-production.firebaseapp.com',
  databaseURL: 'https://cargo-fleet-production-default-rtdb.firebaseio.com',
  projectId: 'cargo-fleet-production',
  storageBucket: 'cargo-fleet-production.firebasestorage.app',
  messagingSenderId: '456009694195',
  appId: '1:456009694195:web:575c8dffce6329808fb086'
};
const devConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'cargo-fleet-development.firebaseapp.com',
  databaseURL: 'https://cargo-fleet-development-default-rtdb.firebaseio.com',
  projectId: 'cargo-fleet-development',
  storageBucket: 'cargo-fleet-development.firebasestorage.app',
  messagingSenderId: '249836192209',
  appId: '1:249836192209:web:606ea18e03d3fe50ea20f0'
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
