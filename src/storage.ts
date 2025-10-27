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
  
  // User-specific document
  const userDocRef = doc(db, 'userData', auth.currentUser.uid);
  // Shared document
  const sharedDocRef = doc(db, 'shared', 'weddingData');
  
  // Listen to user data
  const userUnsubscribe = onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const newData = doc.data() || {};
      debug('Received user data from Firestore:', newData);
      cachedData = { ...cachedData, ...newData };
      window.dispatchEvent(new CustomEvent('firestore-update', { detail: newData }));
    }
  });
  
  // Listen to shared data
  const sharedUnsubscribe = onSnapshot(sharedDocRef, (doc) => {
    if (doc.exists()) {
      const sharedData = doc.data() || {};
      const sharedUpdates = Object.fromEntries(
        Object.entries(sharedData).map(([key, value]) => [`shared_${key}`, value])
      );
      debug('Received shared data from Firestore:', sharedUpdates);
      cachedData = { ...cachedData, ...sharedUpdates };
      window.dispatchEvent(new CustomEvent('firestore-update', { detail: sharedUpdates }));
    }
  });

  // Return cleanup function
  unsubscribe = () => {
    userUnsubscribe();
    sharedUnsubscribe();
  };
};

export const storage = {
  get: async (key: string, isShared: boolean = false): Promise<{ value: any }> => {
    const cacheKey = isShared ? `shared_${key}` : key;
    
    // First check if we have the data in cache
    if (cacheKey in cachedData) {
      debug(`Cache hit for key: ${cacheKey}`, cachedData[cacheKey]);
      return { value: cachedData[cacheKey] };
    }

    debug(`Cache miss for key: ${cacheKey}`);
    return { value: null };
  },

  set: async (key: string, value: any, isShared: boolean = false): Promise<boolean> => {
    try {
      if (!auth.currentUser) {
        console.log('No authenticated user');
        return false;
      }

      const docRef = doc(
        db, 
        isShared ? 'shared/weddingData' : `userData/${auth.currentUser.uid}`
      );
      
      // Update local cache immediately for better UX
      const cacheKey = isShared ? `shared_${key}` : key;
      const newData = { ...cachedData, [cacheKey]: value };
      cachedData = newData;
      
      // Update Firestore
      const updateData = {
        [key]: value,
        lastUpdated: serverTimestamp()
      };
      
      debug(`Saving to ${isShared ? 'shared' : 'user'} Firestore:`, updateData);
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
