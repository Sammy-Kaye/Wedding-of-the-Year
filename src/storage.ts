import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Debug logging function
const debug = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Firestore]', ...args);
  }
};

// Store the current data in memory for faster access
let cachedData: Record<string, any> = {};

// Listen for real-time updates
let unsubscribe: (() => void) | null = null;

// Initialize the storage and set up real-time listener
export const initStorage = () => {
  if (unsubscribe) return; // Already initialized

  if (auth.currentUser) {
    setupListener();
  } else {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setupListener();
        unsubscribeAuth();
      }
    });
  }
};

const setupListener = () => {
  if (!auth.currentUser) return;
  
  const docRef = doc(db, 'dashboard', 'weddingData'); // Using a single document for all data
  
  unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const newData = doc.data() || {};
      debug('Received data from Firestore:', newData);
      cachedData = newData;
      // Notify any listeners about the update
      window.dispatchEvent(new CustomEvent('firestore-update', { detail: newData }));
    }
  }, (error) => {
    console.error('Error in Firestore listener:', error);
  });
};

export const storage = {
  get: async (key: string): Promise<{ value: any }> => {
    // First check if we have the data in cache
    if (key in cachedData) {
      debug(`Cache hit for key: ${key}`, cachedData[key]);
      return { value: cachedData[key] };
    } else {
      debug(`Cache miss for key: ${key}`);
    }

    // If not in cache, try to get from Firestore
    try {
      if (!auth.currentUser) {
        console.log('No authenticated user');
        return { value: null };
      }

      const docRef = doc(db, 'dashboard', 'weddingData');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() || {};
        cachedData = data; // Update cache
        return { value: data[key] };
      }
      return { value: null };
    } catch (error) {
      console.error('Error getting from Firestore:', error);
      return { value: null };
    }
  },

  set: async (key: string, value: any): Promise<boolean> => {
    try {
      if (!auth.currentUser) {
        console.log('No authenticated user');
        return false;
      }

      const docRef = doc(db, 'dashboard', 'weddingData');
      
      // Update local cache immediately for better UX
      const newData = { ...cachedData, [key]: value };
      cachedData = newData;
      
      // Update Firestore
      const updateData = {
        ...newData,
        lastUpdated: serverTimestamp()
      };
      debug('Saving to Firestore:', updateData);
      await setDoc(docRef, updateData, { merge: true });
      debug('Successfully saved to Firestore');
      
      return true;
    } catch (error) {
      console.error('Error writing to Firestore:', error);
      return false;
    }
  }
};

// Initialize storage when this module is loaded
initStorage();
