import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDDpfIugau6s9kwZBdwEvqsuV48-QKZKUg",
  authDomain: "prepper-7ad9c.firebaseapp.com",
  projectId: "prepper-7ad9c",
  storageBucket: "prepper-7ad9c.firebasestorage.app",
  messagingSenderId: "61484954752",
  appId: "1:61484954752:android:eed697d11ed1e4bbefa265",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
