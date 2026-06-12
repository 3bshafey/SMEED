import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Filter, 
  Download, 
  CheckCircle, 
  Clock, 
  MapPin, 
  List,
  BarChart3,
  Edit,
  Trash2,
  AlertCircle,
  Archive
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import AppointmentStatsComponent from '../components/appointments/AppointmentStats';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import { Appointment, AppointmentType, AppointmentStatus, AppointmentFormData, AppointmentStats } from '../types';
import { 
  isOverdue, 
  getRelativeTime, 
  getAppointmentTypeEmoji
} from '../utils/appointments';
import { generateProfessionalPDF } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import { initParticleEffect } from '../utils/animations';
import { AppointmentService } from '../services/AppointmentService';

const Appointments: React.FC = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeView, setActiveView] = useState<'calendar' | 'kanban' | 'list' | 'stats'>('kanban');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<AppointmentType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    description: '',
    appointment_date: new Date(),
    location: '',
    type: 'study',
    reminder_enabled: true
  });

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = AppointmentService.subscribeToAppointments(currentUser.uid, (data) => {
      const formatted = data.map(app => ({
        ...app,
        appointment_id: app.id as any,
        appointment_date: new Date(app.date),
        created_at: new Date(),
        updated_at: new Date(),
        status: app.completed ? 'done' : 'todo'
      } as any));
      setAppointments(formatted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    initParticleEffect('particles-canvas');
  }, []);

  const stats: AppointmentStats = useMemo(() => {
    const now = new Date();
    const total = appointments.length;
    const completed = appointments.filter(app => app.completed).length;
    const pending = appointments.filter(app => !app.completed).length;
    const overdue = appointments.filter(app => new Date(app.appointment_date) < now && !app.completed).length;
    return { total, completed, pending, overdue, byType: {} as any, byStatus: {} as any };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchesType = filterType === 'all' || app.type === filterType;
      const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [appointments, filterType, searchTerm]);

  const kanbanColumns = useMemo(() => {
    const todo = filteredAppointments.filter(a => !a.completed);
    const done = filteredAppointments.filter(a => a.completed);
    return { todo, doing: [], done };
  }, [filteredAppointments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      if (editingAppointment) {
        await AppointmentService.updateAppointment(editingAppointment.appointment_id.toString(), {
          title: formData.title,
          description: formData.description,
          date: formData.appointment_date.toISOString(),
          location: formData.location,
          type: formData.type as any
        });
      } else {
        await AppointmentService.addAppointment(currentUser.uid, {
          title: formData.title,
          description: formData.description,
          date: formData.appointment_date.toISOString(),
          location: formData.location,
          type: formData.type as any,
          completed: false
        });
      }
      setShowAddForm(false);
      setEditingAppointment(null);
      setFormData({ title: '', description: '', appointment_date: new Date(), location: '', type: 'study', reminder_enabled: true });
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const toggleComplete = async (id: any) => {
    const app = appointments.find(a => a.appointment_id === id);
    if (app) {
      await AppointmentService.updateAppointment(id.toString(), { completed: !app.completed });
    }
  };

  const deleteAppointment = async (id: any) => {
    if (window.confirm('Are you sure?')) {
      await AppointmentService.deleteAppointment(id.toString());
    }
  };

  const getTypeColor = (type: AppointmentType) => {
    const colors = {
      gym: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      game: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      study: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      meeting: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'vibe with friends': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[type];
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A1B] text-white">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      <Header />
      <main className="flex-1 pt-24 pb-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Appointments Hub</h1>
          <div className="flex gap-4">
            <Button variant="rainbow" onClick={() => setShowAddForm(true)} icon={<Plus size={18}/>}>Add Task</Button>
            <Button variant="secondary" onClick={() => generateProfessionalPDF(filteredAppointments, stats, { title: 'Report' })} icon={<Download size={18}/>}>Export PDF</Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
          {['kanban', 'calendar', 'list', 'stats'].map(v => (
            <button key={v} onClick={() => setActiveView(v as any)} className={`px-4 py-2 rounded-md ${activeView === v ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>{v.toUpperCase()}</button>
          ))}
        </div>

        {activeView === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="To Do">
              {kanbanColumns.todo.map(app => (
                <div key={app.appointment_id} className="p-4 bg-gray-900 mb-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{app.title}</h3>
                    <p className="text-xs text-gray-500">{getRelativeTime(app.appointment_date)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleComplete(app.appointment_id)} className="text-green-500"><CheckCircle size={20}/></button>
                    <button onClick={() => deleteAppointment(app.appointment_id)} className="text-red-500"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </Card>
            <Card title="Completed">
              {kanbanColumns.done.map(app => (
                <div key={app.appointment_id} className="p-4 bg-gray-900 mb-4 rounded-lg flex justify-between items-center opacity-60">
                  <h3 className="font-bold text-white line-through">{app.title}</h3>
                  <button onClick={() => toggleComplete(app.appointment_id)} className="text-gray-500"><CheckCircle size={20}/></button>
                </div>
              ))}
            </Card>
          </div>
        )}

        {activeView === 'calendar' && <AppointmentCalendar appointments={appointments} onDateSelect={()=>{}} onAddAppointment={()=>{}} onEditAppointment={()=>{}}/>}
        {activeView === 'stats' && <AppointmentStatsComponent appointments={appointments} stats={stats}/>}
      </main>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Add New Task</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Title" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} required/>
                <textarea placeholder="Description" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})}/>
                <input type="datetime-local" className="w-full bg-gray-700 text-white p-2 rounded" onChange={e=>setFormData({...formData, appointment_date: new Date(e.target.value)})} required/>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={()=>setShowAddForm(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">Save</Button>
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

export default Appointments;
