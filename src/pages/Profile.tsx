import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Baby, Flower2, Heart, LogOut, ChevronRight, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const stageInfo = {
  'pre-pregnancy': { icon: Flower2, label: 'Preparing for Pregnancy', color: 'bg-lavender-light text-secondary-foreground' },
  'pregnancy': { icon: Baby, label: 'Expecting', color: 'bg-rose-light text-primary' },
  'postpartum': { icon: Heart, label: 'New Mother', color: 'bg-peach-light text-accent-foreground' },
};

export const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { symptoms, appointments } = useData();
  const navigate = useNavigate();
  const [isEditingWeek, setIsEditingWeek] = useState(false);
  const [weekValue, setWeekValue] = useState(user?.pregnancyWeek || 12);

  const currentStage = user?.maternalStage ? stageInfo[user.maternalStage] : null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast({
      title: "See you soon! 💖",
      description: "Take care of yourself.",
    });
  };

  const handleUpdateWeek = () => {
    updateProfile({ pregnancyWeek: weekValue });
    setIsEditingWeek(false);
    toast({
      title: "Updated! 🌸",
      description: `Week ${weekValue} saved.`,
    });
  };

  const stats = [
    { label: 'Check-ins', value: symptoms.length, icon: Heart },
    { label: 'Appointments', value: appointments.length, icon: Calendar },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="py-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-primary-foreground mb-1">
                  {user?.name}
                </h1>
                <p className="text-primary-foreground/80">
                  {user?.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="py-4 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Journey Stage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-lg font-semibold mb-3">Your Journey</h2>
          {currentStage ? (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${currentStage.color} flex items-center justify-center`}>
                    <currentStage.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{currentStage.label}</h3>
                    {user?.maternalStage === 'pregnancy' && user?.pregnancyWeek && (
                      <div className="flex items-center gap-2">
                        {isEditingWeek ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              min="1"
                              max="42"
                              value={weekValue}
                              onChange={(e) => setWeekValue(parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 text-sm border rounded-lg"
                            />
                            <Button size="sm" variant="default" onClick={handleUpdateWeek}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditingWeek(false)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground">Week {user.pregnancyWeek}</p>
                            <button
                              onClick={() => setIsEditingWeek(true)}
                              className="text-primary hover:text-primary/80"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <p className="text-muted-foreground">Complete your profile setup</p>
              <Button
                variant="default"
                className="mt-3"
                onClick={() => navigate('/onboarding')}
              >
                Set Up Profile
              </Button>
            </Card>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-3">Settings</h2>
          <div className="space-y-2">
            <Card 
              className="cursor-pointer hover:shadow-card"
              onClick={() => navigate('/onboarding')}
            >
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <span>Update Journey Stage</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Caregiver Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="lavender">
            <CardHeader>
              <CardTitle className="text-base">Share with Caregiver</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Generate a summary of your health journey to share with your healthcare provider or loved ones.
              </p>
              <Button variant="secondary" className="w-full">
                Generate Summary
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* Member Since */}
        <p className="text-center text-xs text-muted-foreground">
          Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}
        </p>
      </div>
    </Layout>
  );
};

export default Profile;
