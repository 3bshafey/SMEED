import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc,
  doc, 
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export interface WorshipPreference {
  religion: 'Islam' | 'Christianity' | 'Other';
  method?: string;
  userId: string;
}

export interface PrayerRecord {
  id: string;
  prayerName: string;
  date: string;
  completed: boolean;
  userId: string;
}

export const WorshipService = {
  subscribeToPreferences: (userId: string, callback: (prefs: WorshipPreference | null) => void) => {
    const docRef = doc(db, "worshipPreferences", userId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as WorshipPreference);
      } else {
        callback(null);
      }
    });
  },

  updatePreferences: async (userId: string, prefs: WorshipPreference) => {
    const docRef = doc(db, "worshipPreferences", userId);
    return await setDoc(docRef, {
      ...prefs,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  subscribeToDailyPrayers: (userId: string, date: string, callback: (prayers: PrayerRecord[]) => void) => {
    const q = query(
      collection(db, "prayerRecords"), 
      where("userId", "==", userId),
      where("date", "==", date)
    );
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const prayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRecord));
      callback(prayers);
    });
  },

  togglePrayer: async (userId: string, prayerName: string, date: string, completed: boolean) => {
    const prayerId = `${userId}_${date}_${prayerName}`;
    const docRef = doc(db, "prayerRecords", prayerId);
    return await setDoc(docRef, {
      prayerName,
      date,
      completed,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
};
