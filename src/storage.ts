import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export const storage = {
  get: async (key: string): Promise<{ value: any }> => {
    if (!auth.currentUser) {
      console.log('No authenticated user');
      return { value: null };
    }
    
    try {
      const docRef = doc(db, 'dashboard', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { value: data[key] || null };
      }
      return { value: null };
    } catch (error) {
      console.error('Error getting from Firestore:', error);
      return { value: null };
    }
  },

  set: async (key: string, value: any): Promise<void> => {
    if (!auth.currentUser) {
      console.log('No authenticated user');
      return;
    }

    try {
      const docRef = doc(db, 'dashboard', auth.currentUser.uid);
      await setDoc(docRef, 
        { 
          [key]: value,
          lastUpdated: serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error writing to Firestore:', error);
    }
  }
};
