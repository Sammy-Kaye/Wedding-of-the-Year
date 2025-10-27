import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, collection, getDocs, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
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
  
  // Shared document for all RSVPs
  const rsvpsRef = collection(db, 'rsvps');
  
  // Listen to RSVPs
  const rsvpsUnsubscribe = onSnapshot(rsvpsRef, (snapshot) => {
    const rsvps: Record<string, any> = {};
    snapshot.forEach((doc) => {
      rsvps[doc.id] = doc.data();
    });
    
    debug('Received RSVPs from Firestore:', rsvps);
    cachedData = { ...cachedData, rsvps };
    window.dispatchEvent(new CustomEvent('rsvps-updated', { detail: rsvps }));
  });

  // Return cleanup function
  unsubscribe = () => {
    rsvpsUnsubscribe();
  };
};

export const storage = {
  // Get all RSVPs
  getRsvps: async (): Promise<Record<string, any>> => {
    try {
      const q = query(collection(db, 'rsvps'));
      const querySnapshot = await getDocs(q);
      const rsvps: Record<string, any> = {};
      
      querySnapshot.forEach((doc) => {
        rsvps[doc.id] = doc.data();
      });
      
      return rsvps;
    } catch (error) {
      console.error('Error getting RSVPs:', error);
      return {};
    }
  },

  // Submit RSVP
  submitRsvp: async (inviteeName: string, rsvpData: any): Promise<boolean> => {
    try {
      if (!auth.currentUser) {
        console.log('No authenticated user');
        return false;
      }

      const rsvpRef = doc(db, 'rsvps', inviteeName);
      
      await setDoc(rsvpRef, {
        ...rsvpData,
        submittedBy: auth.currentUser.uid,
        submittedAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      debug('RSVP submitted successfully');
      return true;
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      return false;
    }
  },

  // Admin: Get all RSVPs
  getAllRsvps: async (): Promise<Record<string, any>> => {
    try {
      const q = query(collection(db, 'rsvps'));
      const querySnapshot = await getDocs(q);
      const rsvps: Record<string, any> = {};
      
      querySnapshot.forEach((doc) => {
        rsvps[doc.id] = doc.data();
      });
      
      return rsvps;
    } catch (error) {
      console.error('Error getting all RSVPs:', error);
      return {};
    }
  }
};

// Initialize storage when this module is loaded
initStorage().catch(console.error);
