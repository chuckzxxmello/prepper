import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWBKDbGGdFgDUO2k3SEEGj7y_VuBPhN38",
  authDomain: "prepper-a7da8.firebaseapp.com",
  projectId: "prepper-a7da8",
  storageBucket: "prepper-a7da8.firebasestorage.app",
  messagingSenderId: "253982355805",
  appId: "1:253982355805:web:d2186f959bed384e0538b4",
  measurementId: "G-F3HRERGMVQ"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);