import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc,
  addDoc, 
  doc, 
  getDoc,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { HealthProfile, HealthData } from '../types/health';

export const HealthService = {
  subscribeToProfile: (userId: string, callback: (profile: HealthProfile | null) => void) => {
    const docRef = doc(db, "healthProfiles", userId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as HealthProfile);
      } else {
        callback(null);
      }
    });
  },

  updateProfile: async (userId: string, profile: HealthProfile) => {
    const docRef = doc(db, "healthProfiles", userId);
    return await setDoc(docRef, {
      ...profile,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  subscribeToLatestHealthData: (userId: string, callback: (data: HealthData | null) => void) => {
    const q = query(
      collection(db, "healthRecords"), 
      where("userId", "==", userId),
      orderBy("record_date", "desc"),
      limit(1)
    );
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      if (!snapshot.empty) {
        callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any);
      } else {
        callback(null);
      }
    });
  },

  addHealthRecord: async (userId: string, data: Omit<HealthData, 'id'>) => {
    return await addDoc(collection(db, "healthRecords"), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    });
  }
};
