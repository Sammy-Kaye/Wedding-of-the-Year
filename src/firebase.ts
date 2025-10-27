import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmO8iDqdc7NMRB9eg1RxAsU1_WcvtplHk",
  authDomain: "wedding-ad36b.firebaseapp.com",
  projectId: "wedding-ad36b",
  storageBucket: "wedding-ad36b.firebasestorage.app",
  messagingSenderId: "770481502957",
  appId: "1:770481502957:web:d905423d84132ee135aae4",
  measurementId: "G-ZH77QDG7PN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Sign in anonymously
auth.onAuthStateChanged((user) => {
  if (!user) {
    signInAnonymously(auth).catch(console.error);
  }
});
