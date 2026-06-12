import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { initParticleEffect } from '../../utils/animations';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.appendChild(canvas);
    initParticleEffect('particles-canvas');
    return () => {
      document.getElementById('particles-canvas')?.remove();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      await resetPassword(email);
      setMessage(t('auth.resetLinkSent'));
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="animate-slide-in-up">
            <h1 className="text-2xl font-bold text-white mb-2">{t('auth.forgotPassword')}</h1>
            <p className="text-gray-400 mb-6">{t('auth.forgotPasswordDesc')}</p>
            
            {message && (
              <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg flex items-center">
                <CheckCircle size={18} className="mr-2"/> {message}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg flex items-center">
                <AlertCircle size={18} className="mr-2"/> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('common.email')}
                type="email"
                icon={<Mail size={20}/>}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="rainbow" className="w-full" isLoading={isLoading}>
                {t('auth.sendResetLink')}
              </Button>
            </form>
            
            <Link to="/login" className="mt-6 flex items-center justify-center text-gray-400 hover:text-white">
              <ArrowLeft size={16} className="mr-2"/> {t('auth.backToLogin')}
            </Link>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
