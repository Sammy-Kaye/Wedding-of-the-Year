import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db, initAuth } from './firebase';

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
export const initStorage = async () => {
  if (unsubscribe) {
    debug('Storage already initialized');
    return;
  }

  try {
    debug('Initializing storage...');
    if (!auth.currentUser) {
      debug('No authenticated user, initializing auth...');
      await initAuth();
    }
    
    if (auth.currentUser) {
      debug('User authenticated:', auth.currentUser.uid);
      setupListener();
    } else {
      debug('Failed to authenticate user');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
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
// We'll let the main app control when to initialize storage
// to ensure proper loading sequence
