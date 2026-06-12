import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, School, Heart, DollarSign, Clock, Calendar, Activity, CheckCircle, Wallet } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import { initParticleEffect } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FinancialService } from '../services/FinancialService';
import { HealthService } from '../services/HealthService';
import { AppointmentService } from '../services/AppointmentService';
import { WorshipService } from '../services/WorshipService';

interface DashboardStats {
  appointments: { total: number; completed: number; overdue: number };
  health: { hasProfile: boolean; bmi?: number };
  worship: { completedPrayers: number; totalPrayers: number };
  finance: { totalBalance: number; monthlyExpenses: number };
}

const Dashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    appointments: { total: 0, completed: 0, overdue: 0 },
    health: { hasProfile: false },
    worship: { completedPrayers: 0, totalPrayers: 0 },
    finance: { totalBalance: 0, monthlyExpenses: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    initParticleEffect('particles-canvas');

    // Subscribe to all services for a real-time dashboard
    const unsubFinancial = FinancialService.subscribeToAccounts(currentUser.uid, (accounts) => {
      const balance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
      setStats(prev => ({ ...prev, finance: { ...prev.finance, totalBalance: balance } }));
    });

    const unsubExpenses = FinancialService.subscribeToExpenses(currentUser.uid, (expenses) => {
      const monthly = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      setStats(prev => ({ ...prev, finance: { ...prev.finance, monthlyExpenses: monthly } }));
    });

    const unsubHealth = HealthService.subscribeToProfile(currentUser.uid, (profile) => {
      setStats(prev => ({ ...prev, health: { hasProfile: !!profile, bmi: profile?.bmi } }));
    });

    const unsubAppointments = AppointmentService.subscribeToAppointments(currentUser.uid, (apps) => {
      setStats(prev => ({ 
        ...prev, 
        appointments: { 
          total: apps.length, 
          completed: apps.filter(a => a.completed).length,
          overdue: 0 // Logic for overdue can be added here
        } 
      }));
    });

    const today = new Date().toISOString().split('T')[0];
    const unsubWorship = WorshipService.subscribeToDailyPrayers(currentUser.uid, today, (prayers) => {
      setStats(prev => ({ 
        ...prev, 
        worship: { 
          completedPrayers: prayers.filter(p => p.completed).length, 
          totalPrayers: prayers.length 
        } 
      }));
      setLoading(false);
    });

    return () => {
      unsubFinancial();
      unsubExpenses();
      unsubHealth();
      unsubAppointments();
      unsubWorship();
    };
  }, [currentUser]);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A0A1B] text-white">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      <Header />
      <main className="flex-1 pt-24 pb-12 container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {currentUser?.username}!</h1>
          <p className="text-gray-400">Here's an overview of your student life today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card withHover onClick={() => navigate('/finance')}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-lg"><Wallet className="text-green-400"/></div>
              <div>
                <p className="text-gray-400 text-sm">Total Balance</p>
                <p className="text-2xl font-bold text-white">EGP {stats.finance.totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card withHover onClick={() => navigate('/appointments')}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-lg"><Calendar className="text-blue-400"/></div>
              <div>
                <p className="text-gray-400 text-sm">Tasks Done</p>
                <p className="text-2xl font-bold text-white">{stats.appointments.completed} / {stats.appointments.total}</p>
              </div>
            </div>
          </Card>

          <Card withHover onClick={() => navigate('/health')}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-lg"><Heart className="text-red-400"/></div>
              <div>
                <p className="text-gray-400 text-sm">BMI Status</p>
                <p className="text-2xl font-bold text-white">{stats.health.hasProfile ? stats.health.bmi : 'No Profile'}</p>
              </div>
            </div>
          </Card>

          <Card withHover onClick={() => navigate('/worship')}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-lg"><Activity className="text-purple-400"/></div>
              <div>
                <p className="text-gray-400 text-sm">Prayers Done</p>
                <p className="text-2xl font-bold text-white">{stats.worship.completedPrayers} Completed</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
