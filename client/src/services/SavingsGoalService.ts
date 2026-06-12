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

export interface SavingsGoal {
  id: string;
  goal_name: string;
  target_amount: number;
  deadline: string;
  completed: boolean;
  userId: string;
  progress: number;
  daily_progress: {
    date: string;
    completed: boolean;
  }[];
}

export const SavingsGoalService = {
  subscribeToGoals: (userId: string, callback: (goals: SavingsGoal[]) => void) => {
    const q = query(collection(db, "savingsGoals"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavingsGoal));
      callback(goals);
    });
  },

  addGoal: async (userId: string, goalData: Omit<SavingsGoal, 'id' | 'userId'>) => {
    return await addDoc(collection(db, "savingsGoals"), {
      ...goalData,
      userId,
      createdAt: serverTimestamp()
    });
  },

  updateGoal: async (id: string, updates: Partial<SavingsGoal>) => {
    const docRef = doc(db, "savingsGoals", id);
    return await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  deleteGoal: async (id: string) => {
    return await deleteDoc(doc(db, "savingsGoals", id));
  },

  toggleDailyProgress: async (goalId: string, goals: SavingsGoal[], date: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedDailyProgress = [...(goal.daily_progress || [])];
    const index = updatedDailyProgress.findIndex(p => p.date === date);

    if (index !== -1) {
      updatedDailyProgress[index].completed = !updatedDailyProgress[index].completed;
    } else {
      updatedDailyProgress.push({ date, completed: true });
    }

    // Calculate overall progress based on some logic (e.g. days completed vs total days until deadline)
    // For now, just saving the daily progress
    return await updateDoc(doc(db, "savingsGoals", goalId), {
      daily_progress: updatedDailyProgress,
      updatedAt: serverTimestamp()
    });
  }
};
