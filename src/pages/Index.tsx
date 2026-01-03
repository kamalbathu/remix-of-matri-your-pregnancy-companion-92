import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Calendar, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: Heart, title: 'Track Symptoms', description: 'Log how you feel daily' },
  { icon: Calendar, title: 'Manage Care', description: 'Schedule appointments' },
  { icon: BookOpen, title: 'Learn & Grow', description: 'Personalized guidance' },
  { icon: Shield, title: 'Stay Safe', description: 'Emergency support' },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(user.maternalStage ? '/dashboard' : '/onboarding');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Logo size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-light rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lavender-light rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-peach-light rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative min-h-screen flex flex-col px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Logo size="lg" />
        </motion.div>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Your caring companion through{' '}
            <span className="text-gradient">motherhood</span> 🌸
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Track symptoms, manage appointments, and get personalized guidance for your maternal journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full space-y-3"
          >
            <Button
              onClick={() => navigate('/auth')}
              variant="gradient"
              size="xl"
              className="w-full"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 max-w-lg mx-auto w-full"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft"
            >
              <feature.icon className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-8 max-w-sm mx-auto"
        >
          MATRI provides general guidance and does not replace medical professionals.
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
