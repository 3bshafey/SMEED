import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { initParticleEffect } from '../utils/animations';
import { FinancialService, Account, Expense } from '../services/FinancialService';

const Financial: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseFormData, setExpenseFormData] = useState({
    account_id: '',
    amount: '',
    category: 'food',
    description: '',
    expense_date: new Date().toISOString().split('T')[0]
  });
  const [formError, setFormError] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    account_name: '',
    balance: '',
    currency: 'EGP',
    account_type: 'cash'
  });
  const [accountFormError, setAccountFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);

    const unsubscribeAccounts = FinancialService.subscribeToAccounts(currentUser.uid, (data) => {
      setAccounts(data);
      setIsLoading(false);
    });

    const unsubscribeExpenses = FinancialService.subscribeToExpenses(currentUser.uid, (data) => {
      setExpenses(data);
    });

    return () => {
      unsubscribeAccounts();
      unsubscribeExpenses();
    };
  }, [currentUser]);

  useEffect(() => {
    initParticleEffect('particles-canvas');
  }, []);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setAccountFormError('');
      await FinancialService.addAccount(currentUser.uid, {
        account_name: accountFormData.account_name,
        balance: parseFloat(accountFormData.balance),
        currency: accountFormData.currency,
        account_type: accountFormData.account_type
      });

      setShowAccountModal(false);
      setAccountFormData({ account_name: '', balance: '', currency: 'EGP', account_type: 'cash' });
    } catch (err: any) {
      setAccountFormError(err.message);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setFormError('');
      await FinancialService.addExpense(currentUser.uid, {
        accountId: expenseFormData.account_id,
        amount: parseFloat(expenseFormData.amount),
        category: expenseFormData.category as any,
        description: expenseFormData.description,
        expense_date: expenseFormData.expense_date
      });

      setShowExpenseModal(false);
      setExpenseFormData({ account_id: '', amount: '', category: 'food', description: '', expense_date: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      await FinancialService.deleteAccount(id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A0A1B] justify-center items-center text-white">
        <h1 className="text-2xl mb-4">Please log in to access financial data</h1>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B] dark:bg-[#0A0A1B]">
      <Header />
      <main className="flex-grow pt-24 pb-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => setShowAccountModal(true)} icon={<Plus size={20}/>}>New Account</Button>
            <Button variant="secondary" onClick={() => setShowExpenseModal(true)} icon={<Plus size={20}/>}>Add Expense</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Your Accounts">
            <div className="space-y-4">
              {accounts.map(account => (
                <div key={account.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">{account.account_name}</h4>
                    <p className="text-gray-400">{account.account_type}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-xl font-bold text-green-400">{account.currency} {account.balance.toLocaleString()}</span>
                    <button onClick={() => handleDeleteAccount(account.id)} className="text-red-500 hover:text-red-400">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
              {accounts.length === 0 && !isLoading && <p className="text-gray-500">No accounts found.</p>}
            </div>
          </Card>

          <Card title="Recent Expenses">
            <div className="space-y-4">
              {expenses.sort((a,b) => b.expense_date.localeCompare(a.expense_date)).slice(0, 5).map(expense => (
                <div key={expense.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white capitalize">{expense.category}</h4>
                    <p className="text-gray-400 text-sm">{expense.expense_date}</p>
                  </div>
                  <span className="text-red-400 font-bold">-{expense.amount}</span>
                </div>
              ))}
              {expenses.length === 0 && !isLoading && <p className="text-gray-500">No expenses found.</p>}
            </div>
          </Card>
        </div>
      </main>

      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Add New Account</h2>
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Account Name" 
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  value={accountFormData.account_name}
                  onChange={e => setAccountFormData({...accountFormData, account_name: e.target.value})}
                  required
                />
                <input 
                  type="number" 
                  placeholder="Initial Balance" 
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  value={accountFormData.balance}
                  onChange={e => setAccountFormData({...accountFormData, balance: e.target.value})}
                  required
                />
                <select 
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  value={accountFormData.currency}
                  onChange={e => setAccountFormData({...accountFormData, currency: e.target.value})}
                >
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={() => setShowAccountModal(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">Create</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Financial;
