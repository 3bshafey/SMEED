import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { initParticleEffect } from '../utils/animations';
import { SavingsGoalService, SavingsGoal } from '../services/SavingsGoalService';
import { FinancialService } from '../services/FinancialService';

const SavingsGoals: React.FC = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [formData, setFormData] = useState({
    goal_name: '',
    target_amount: '',
    deadline: ''
  });
  const [formError, setFormError] = useState<string>('');
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeGoals = SavingsGoalService.subscribeToGoals(currentUser.uid, (data) => {
      setGoals(data);
    });

    const unsubscribeAccounts = FinancialService.subscribeToAccounts(currentUser.uid, (accounts) => {
      const total = accounts.reduce((acc, curr) => acc + curr.balance, 0);
      setTotalBalance(total);
    });

    return () => {
      unsubscribeGoals();
      unsubscribeAccounts();
    };
  }, [currentUser]);

  useEffect(() => {
    initParticleEffect('particles-canvas');
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setFormError('');
      await SavingsGoalService.addGoal(currentUser.uid, {
        goal_name: formData.goal_name,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline,
        completed: false,
        progress: 0,
        daily_progress: []
      });
      setShowAddGoalModal(false);
      setFormData({ goal_name: '', target_amount: '', deadline: '' });
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const toggleDaily = async (goalId: string, date: string) => {
    await SavingsGoalService.toggleDailyProgress(goalId, goals, date);
  };

  const deleteGoal = async (id: string) => {
    if (window.confirm("Delete this goal?")) {
      await SavingsGoalService.deleteGoal(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      <Header />
      <main className="flex-grow pt-24 pb-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Savings Goals</h1>
            <p className="text-gray-400">Total Balance: <span className="text-green-400 font-bold">EGP {totalBalance.toLocaleString()}</span></p>
          </div>
          <Button variant="rainbow" onClick={() => setShowAddGoalModal(true)} icon={<Plus size={18}/>}>New Goal</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <Card key={goal.id} className="relative overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Target className="text-blue-400" size={24}/>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{goal.goal_name}</h3>
                <p className="text-gray-400 text-sm mb-4">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-bold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-500" style={{width: `${goal.progress}%`}}/>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Target:</span>
                  <span className="text-white font-bold">EGP {goal.target_amount.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {showAddGoalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Add Savings Goal</h2>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <input type="text" placeholder="Goal Name" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.goal_name} onChange={e=>setFormData({...formData, goal_name: e.target.value})} required/>
                <input type="number" placeholder="Target Amount" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.target_amount} onChange={e=>setFormData({...formData, target_amount: e.target.value})} required/>
                <input type="date" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.deadline} onChange={e=>setFormData({...formData, deadline: e.target.value})} required/>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={()=>setShowAddGoalModal(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">Create Goal</Button>
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

export default SavingsGoals;
