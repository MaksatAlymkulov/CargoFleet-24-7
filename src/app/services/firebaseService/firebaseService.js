/* eslint import/no-extraneous-dependencies: off*/
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from './firebaseServiceConfig';

class FirebaseService {
  init(success) {
    // This part is responsible for failure of firebase
    if (Object.entries(config).length === 0 && config.constructor === Object) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js');
      }
      success(false);
      return;
    }
    // Check if Already Initialized before. Firebase can be initialized only once per web app instance. firebase.apps is an array of all initialized Firebase apps. If firebase.apps.length is already > 0, it means the app has been initialized before. So if it's already initialized, just return and do nothing more.
    if (firebase.apps.length) {
      return;
    }
    // First time initialize
    firebase.initializeApp(config);
    // stores a reference to the Firebase Realtime Database service in the class instance.
    this.db = firebase.database();
    // stores a reference to the Firebase Authentication service in the class instance.
    this.auth = firebase.auth();
    success(true);
  }

  getUserData = userId => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise(resolve => {
      this.db
        .ref(`users/${userId}`)
        .once('value')
        .then(snapshot => {
          const user = snapshot.val();
          resolve(user);
        });
    });
  };

  updateUserData = user => {
    if (!firebase.apps.length) {
      return false;
    }
    return this.db.ref(`users/${user.uid}`).set(user);
  };

  onAuthStateChanged = callback => {
    if (!this.auth) {
      return;
    }
    this.auth.onAuthStateChanged(callback);
  };

  signOut = () => {
    if (!this.auth) {
      return;
    }
    this.auth.signOut();
  };
}

const instance = new FirebaseService();

export default instance;
