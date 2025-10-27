import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, signInAnonymously, connectAuthEmulator } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmO8iDqdc7NMRB9eg1RxAsU1_WcvtplHk",
  authDomain: "wedding-ad36b.firebaseapp.com",
  projectId: "wedding-ad36b",
  storageBucket: "wedding-ad36b.appspot.com", // Changed from firebasestorage.app to appspot.com
  messagingSenderId: "770481502957",
  appId: "1:770481502957:web:d905423d84132ee135aae4"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export const db = getFirestore(app);
export const auth = getAuth(app);

// For local development with emulators (uncomment if needed)
// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

// Sign in anonymously
export const initAuth = () => {
  return new Promise<void>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          console.log('No user, signing in anonymously...');
          await signInAnonymously(auth);
          console.log('Successfully signed in anonymously');
        } catch (error) {
          console.error('Error signing in anonymously:', error);
        } finally {
          unsubscribe();
          resolve();
        }
      } else {
        console.log('User already signed in:', user.uid);
        unsubscribe();
        resolve();
      }
    });
  });
};

// Initialize auth when this module is loaded
initAuth().catch(console.error);
