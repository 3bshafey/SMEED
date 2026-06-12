import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  runTransaction,
  increment,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Account {
  id: string;
  account_name: string;
  balance: number;
  currency: string;
  account_type: string;
  userId: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  accountId: string;
  userId: string;
}

export const FinancialService = {
  subscribeToAccounts: (userId: string, callback: (accounts: Account[]) => void) => {
    const q = query(collection(db, "accounts"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const accounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
      callback(accounts);
    });
  },

  subscribeToExpenses: (userId: string, callback: (expenses: Expense[]) => void) => {
    const q = query(collection(db, "expenses"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      callback(expenses);
    });
  },

  addAccount: async (userId: string, accountData: Omit<Account, 'id' | 'userId'>) => {
    return await addDoc(collection(db, "accounts"), {
      ...accountData,
      userId,
      createdAt: serverTimestamp()
    });
  },

  deleteAccount: async (accountId: string) => {
    return await deleteDoc(doc(db, "accounts", accountId));
  },

  addExpense: async (userId: string, expenseData: Omit<Expense, 'id' | 'userId'>) => {
    return await runTransaction(db, async (transaction) => {
      const accountRef = doc(db, "accounts", expenseData.accountId);
      const accountDoc = await transaction.get(accountRef);

      if (!accountDoc.exists()) throw new Error("Account does not exist");
      const currentBalance = accountDoc.data().balance;
      if (currentBalance < expenseData.amount) throw new Error("Insufficient balance");

      transaction.update(accountRef, {
        balance: increment(-expenseData.amount)
      });

      const expenseRef = doc(collection(db, "expenses"));
      transaction.set(expenseRef, {
        ...expenseData,
        userId,
        createdAt: serverTimestamp()
      });
    });
  },

  deleteExpense: async (expenseId: string, accountId: string, amount: number) => {
    return await runTransaction(db, async (transaction) => {
      const accountRef = doc(db, "accounts", accountId);
      transaction.update(accountRef, {
        balance: increment(amount)
      });
      transaction.delete(doc(db, "expenses", expenseId));
    });
  }
};
