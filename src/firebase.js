import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyDPb56B7OXGVmTKek7YZmViMAPOjYmh3qc',
  authDomain: 'react-slack-clone-3f9fc.firebaseapp.com',
  databaseURL: 'https://react-slack-clone-3f9fc.firebaseio.com',
  projectId: 'react-slack-clone-3f9fc',
  storageBucket: 'react-slack-clone-3f9fc.appspot.com',
  messagingSenderId: '264642412732',
  appId: '1:264642412732:web:df8136e9df6eb3143050b9',
  measurementId: 'G-TNLTGFJPNQ',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
