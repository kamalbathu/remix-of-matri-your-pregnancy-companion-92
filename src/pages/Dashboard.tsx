import { motion } from 'framer-motion';
import { 
  Heart, Calendar, BookOpen, AlertTriangle, 
  Sparkles, ChevronRight, Sun, Moon, Cloud
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';

const motivationalQuotes = [
  "You are stronger than you know 💪",
  "Every day is a new beginning 🌅",
  "Trust in your journey 🌸",
  "You are doing an amazing job 💖",
  "Embrace this beautiful chapter ✨",
  "Your body is incredible 🌺",
  "Take it one day at a time 🦋",
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: Sun, emoji: '☀️' };
  if (hour < 17) return { text: 'Good afternoon', icon: Cloud, emoji: '🌤️' };
  return { text: 'Good evening', icon: Moon, emoji: '🌙' };
};

const getStageLabel = (stage: string | null, week: number | null) => {
  if (stage === 'pregnancy' && week) {
    return `Week ${week} of pregnancy`;
  }
  if (stage === 'pre-pregnancy') return 'Preparing for pregnancy';
  if (stage === 'postpartum') return 'Postpartum journey';
  return 'Your journey';
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { getUpcomingAppointments, getRecentSymptoms, checkSafetyAlerts, getEducationalContent } = useData();
  const navigate = useNavigate();
  
  const greeting = getGreeting();
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const upcomingAppointments = getUpcomingAppointments().slice(0, 2);
  const recentSymptoms = getRecentSymptoms(1);
  const safetyAlert = checkSafetyAlerts();
  const educationalContent = getEducationalContent().slice(0, 2);

  const quickActions = [
    {
      title: 'How are you feeling?',
      description: 'Log your daily symptoms',
      icon: Heart,
      color: 'bg-rose-light',
      iconColor: 'text-primary',
      path: '/symptoms',
    },
    {
      title: 'Your care schedule',
      description: upcomingAppointments.length > 0 
        ? `${upcomingAppointments.length} upcoming` 
        : 'Add appointments',
      icon: Calendar,
      color: 'bg-lavender-light',
      iconColor: 'text-secondary-foreground',
      path: '/appointments',
    },
    {
      title: 'Learn & grow',
      description: 'Tips for your journey',
      icon: BookOpen,
      color: 'bg-peach-light',
      iconColor: 'text-accent-foreground',
      path: '/learn',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <greeting.icon className="w-5 h-5" />
            <span>{greeting.text} {greeting.emoji}</span>
          </div>
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {user?.name?.split(' ')[0]}! 🌸
          </h1>
          <p className="text-muted-foreground">
            {getStageLabel(user?.maternalStage || null, user?.pregnancyWeek || null)}
          </p>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary-foreground/80" />
                <p className="text-lg font-medium text-primary-foreground">{quote}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safety Alert */}
        {safetyAlert.hasAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-coral/50 bg-coral/10">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-coral/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Health Notice</h3>
                    <p className="text-sm text-muted-foreground">{safetyAlert.message}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate('/emergency')}
                    >
                      View Resources
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold px-1">Quick Actions</h2>
          <div className="grid gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="w-full text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-card">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                        <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        {recentSymptoms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold px-1 mb-3">Today's Check-in</h2>
            <Card variant="lavender">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center">
                    <Heart className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Mood: {recentSymptoms[0].mood}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {recentSymptoms[0].symptoms.length} symptoms logged
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Educational Content Preview */}
        {educationalContent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold px-1">For You</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/learn')}>
                See all
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {educationalContent.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-card cursor-pointer">
                    <CardContent className="py-4">
                      <span className="text-3xl mb-2 block">{content.icon}</span>
                      <h3 className="font-medium text-sm leading-tight">{content.title}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
