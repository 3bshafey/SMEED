import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'Study' | 'Gym' | 'Meeting' | 'Game' | 'Vibe with Friends';
  completed: boolean;
  userId: string;
}

export const AppointmentService = {
  subscribeToAppointments: (userId: string, callback: (appointments: Appointment[]) => void) => {
    const q = query(collection(db, "appointments"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      callback(appointments);
    });
  },

  addAppointment: async (userId: string, appointmentData: Omit<Appointment, 'id' | 'userId'>) => {
    return await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      userId,
      createdAt: serverTimestamp()
    });
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>) => {
    const docRef = doc(db, "appointments", id);
    return await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  deleteAppointment: async (id: string) => {
    return await deleteDoc(doc(db, "appointments", id));
  }
};
