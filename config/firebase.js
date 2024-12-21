import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWBKDbGGdFgDUO2k3SEEGj7y_VuBPhN38",
  authDomain: "prepper-a7da8.firebaseapp.com",
  projectId: "prepper-a7da8",
  storageBucket: "prepper-a7da8.firebasestorage.app",
  messagingSenderId: "253982355805",
  appId: "1:253982355805:web:d2186f959bed384e0538b4",
  measurementId: "G-F3HRERGMVQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
