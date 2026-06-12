import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { initParticleEffect } from '../../utils/animations';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Particle Effect
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.appendChild(canvas);
    
    initParticleEffect('particles-canvas');
    
    return () => {
      const canvasElement = document.getElementById('particles-canvas');
      if (canvasElement) {
        canvasElement.remove();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setIsLoading(true);

      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFloatingShapes = () => {
    return (
      <>
        <div className="floating-shape top-20 left-[10%] w-20 h-20 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
        <div className="floating-shape top-40 right-[15%] w-16 h-16 bg-purple-500/10 dark:bg-purple-500/20 rounded-full" style={{ animationDelay: '1s' }}></div>
        <div className="floating-shape bottom-60 left-[20%] w-24 h-24 bg-green-500/10 dark:bg-green-500/20 rounded-full" style={{ animationDelay: '2s' }}></div>
        <div className="floating-shape bottom-40 right-[10%] w-32 h-32 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-full" style={{ animationDelay: '1.5s' }}></div>
        <div className="floating-shape top-[30%] left-[30%] w-12 h-12 bg-red-500/10 dark:bg-red-500/20 rounded-full" style={{ animationDelay: '0.5s' }}></div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        {renderFloatingShapes()}

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6 animate-slide-in-up">
                {t('auth.loginTo')}{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  {t('common.appName')}
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                {t('auth.loginDescription')}
              </p>

              <Card className="w-full animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center text-red-700 dark:text-red-400 animate-slide-in-up">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label={t('common.email')}
                    type="email"
                    name="email"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('auth.enterEmail')}
                    required
                    disabled={isLoading}
                  />

                  <Input
                    label={t('common.password')}
                    type="password"
                    name="password"
                    icon={<KeyRound className="h-5 w-5 text-gray-400" />}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t('auth.enterPassword')}
                    required
                    disabled={isLoading}
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('common.rememberMe')}
                      </span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {t('common.forgotPassword')}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="rainbow"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full shadow-xl"
                    withShimmer
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.loggingIn') : t('common.login')}
                  </Button>

                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {t('auth.noAccount')}{' '}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {t('common.register')}
                    </Link>
                  </p>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
