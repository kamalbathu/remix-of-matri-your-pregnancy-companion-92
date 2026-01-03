import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Baby, Heart, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type MaternalStage = 'pre-pregnancy' | 'pregnancy' | 'postpartum';

const stages = [
  {
    id: 'pre-pregnancy' as MaternalStage,
    icon: Flower2,
    title: 'Preparing to Conceive',
    description: 'Planning for pregnancy and optimizing your health',
    color: 'bg-lavender-light border-lavender',
    iconColor: 'text-secondary-foreground',
  },
  {
    id: 'pregnancy' as MaternalStage,
    icon: Baby,
    title: 'Expecting',
    description: 'Currently pregnant and growing your little one',
    color: 'bg-rose-light border-primary',
    iconColor: 'text-primary',
  },
  {
    id: 'postpartum' as MaternalStage,
    icon: Heart,
    title: 'New Mother',
    description: 'Navigating life after birth',
    color: 'bg-peach-light border-peach',
    iconColor: 'text-accent-foreground',
  },
];

export const Onboarding = () => {
  const [selectedStage, setSelectedStage] = useState<MaternalStage | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(12);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const handleContinue = async () => {
    if (step === 1 && selectedStage) {
      if (selectedStage === 'pregnancy') {
        setStep(2);
      } else {
        await saveProfile();
      }
    } else if (step === 2) {
      await saveProfile();
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);
    
    updateProfile({
      maternalStage: selectedStage!,
      pregnancyWeek: selectedStage === 'pregnancy' ? pregnancyWeek : null,
    });

    toast({
      title: "You're all set! 🌸",
      description: "Let's begin your journey together.",
    });
    
    navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-light rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lavender-light rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative flex-1 flex flex-col px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Logo size="lg" />
        </motion.div>

        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome, {user?.name}! 🌸
                  </h1>
                  <p className="text-muted-foreground">
                    Where are you on your maternal journey?
                  </p>
                </div>

                <div className="space-y-4">
                  {stages.map((stage) => (
                    <motion.button
                      key={stage.id}
                      onClick={() => setSelectedStage(stage.id)}
                      className="w-full text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`p-5 border-2 transition-all ${
                          selectedStage === stage.id
                            ? `${stage.color} border-2 shadow-card`
                            : 'border-transparent hover:border-border'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl ${stage.color} flex items-center justify-center`}>
                            <stage.icon className={`w-7 h-7 ${stage.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{stage.title}</h3>
                            <p className="text-sm text-muted-foreground">{stage.description}</p>
                          </div>
                          {selectedStage === stage.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                            >
                              <span className="text-primary-foreground text-sm">✓</span>
                            </motion.div>
                          )}
                        </div>
                      </Card>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">
                    Congratulations! 🌸
                  </h1>
                  <p className="text-muted-foreground">
                    How far along are you?
                  </p>
                </div>

                <Card variant="lavender" className="p-8">
                  <div className="text-center mb-6">
                    <span className="text-6xl font-bold text-gradient">{pregnancyWeek}</span>
                    <p className="text-lg text-muted-foreground mt-2">weeks</p>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="42"
                    value={pregnancyWeek}
                    onChange={(e) => setPregnancyWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>1 week</span>
                    <span>42 weeks</span>
                  </div>
                </Card>

                <div className="mt-6">
                  <p className="text-center text-sm text-muted-foreground">
                    {pregnancyWeek <= 12 && "First trimester - an exciting beginning! 🌱"}
                    {pregnancyWeek > 12 && pregnancyWeek <= 26 && "Second trimester - you're doing amazing! 🦋"}
                    {pregnancyWeek > 26 && "Third trimester - almost there! 🌸"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Button
              onClick={handleContinue}
              variant="gradient"
              size="xl"
              className="w-full"
              disabled={!selectedStage || isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {step === 2 && (
              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="w-full mt-3"
              >
                Go Back
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
