import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smile, Meh, Frown, AlertCircle, Check, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useData, Symptom } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Mood = Symptom['mood'];

const moodOptions: { value: Mood; icon: React.ElementType; label: string; color: string }[] = [
  { value: 'great', icon: Smile, label: 'Great', color: 'bg-green-100 text-green-600 border-green-200' },
  { value: 'good', icon: Smile, label: 'Good', color: 'bg-rose-light text-primary border-primary/20' },
  { value: 'okay', icon: Meh, label: 'Okay', color: 'bg-peach-light text-accent-foreground border-peach/30' },
  { value: 'low', icon: Frown, label: 'Low', color: 'bg-lavender-light text-secondary-foreground border-lavender/30' },
  { value: 'difficult', icon: AlertCircle, label: 'Difficult', color: 'bg-coral/20 text-coral border-coral/30' },
];

const symptomCategories = [
  {
    title: 'Physical',
    symptoms: [
      { id: 'fatigue', label: 'Fatigue' },
      { id: 'nausea', label: 'Nausea' },
      { id: 'headache', label: 'Headache' },
      { id: 'back_pain', label: 'Back pain' },
      { id: 'cramping', label: 'Cramping' },
      { id: 'swelling', label: 'Swelling' },
      { id: 'breast_tenderness', label: 'Breast tenderness' },
    ],
  },
  {
    title: 'Digestive',
    symptoms: [
      { id: 'food_cravings', label: 'Food cravings' },
      { id: 'food_aversion', label: 'Food aversion' },
      { id: 'heartburn', label: 'Heartburn' },
      { id: 'constipation', label: 'Constipation' },
      { id: 'bloating', label: 'Bloating' },
    ],
  },
  {
    title: 'Emotional',
    symptoms: [
      { id: 'mood_swings', label: 'Mood swings' },
      { id: 'anxiety', label: 'Anxiety' },
      { id: 'irritability', label: 'Irritability' },
      { id: 'crying_spells', label: 'Crying spells' },
    ],
  },
  {
    title: 'Sleep',
    symptoms: [
      { id: 'insomnia', label: 'Insomnia' },
      { id: 'vivid_dreams', label: 'Vivid dreams' },
      { id: 'frequent_urination', label: 'Frequent urination' },
    ],
  },
  {
    title: 'Concerning (Please note)',
    symptoms: [
      { id: 'severe_headache', label: 'Severe headache' },
      { id: 'vision_changes', label: 'Vision changes' },
      { id: 'severe_abdominal_pain', label: 'Severe abdominal pain' },
      { id: 'heavy_bleeding', label: 'Heavy bleeding' },
      { id: 'no_fetal_movement', label: 'No fetal movement' },
    ],
  },
];

export const Symptoms = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const { addSymptom, getRecentSymptoms, checkSafetyAlerts } = useData();
  const recentSymptoms = getRecentSymptoms(7);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "How are you feeling?",
        description: "Please select your mood first 💖",
        variant: "destructive",
      });
      return;
    }

    addSymptom({
      date: new Date().toISOString(),
      symptoms: selectedSymptoms,
      mood: selectedMood,
      notes: notes || undefined,
    });

    const alert = checkSafetyAlerts();
    
    if (alert.hasAlert) {
      toast({
        title: "Health Notice 💗",
        description: alert.message,
      });
    } else {
      toast({
        title: "Logged! 🌸",
        description: "Thank you for checking in with yourself.",
      });
    }

    // Reset form
    setSelectedMood(null);
    setSelectedSymptoms([]);
    setNotes('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">How are you feeling? 💖</h1>
          <p className="text-muted-foreground">Track your symptoms and mood</p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setShowHistory(false)}
            className={`flex-1 py-2 rounded-lg font-medium transition-all text-sm ${
              !showHistory 
                ? 'bg-card text-foreground shadow-soft' 
                : 'text-muted-foreground'
            }`}
          >
            Log Today
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`flex-1 py-2 rounded-lg font-medium transition-all text-sm ${
              showHistory 
                ? 'bg-card text-foreground shadow-soft' 
                : 'text-muted-foreground'
            }`}
          >
            History
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div
              key="log"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Mood Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your mood today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between gap-2">
                    {moodOptions.map((mood) => (
                      <motion.button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedMood === mood.value
                            ? mood.color
                            : 'border-transparent bg-muted hover:bg-muted/80'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <mood.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{mood.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Symptoms */}
              <div className="space-y-4">
                {symptomCategories.map((category) => (
                  <Card key={category.title}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.symptoms.map((symptom) => (
                          <motion.button
                            key={symptom.id}
                            onClick={() => toggleSymptom(symptom.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                              selectedSymptoms.includes(symptom.id)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            {symptom.label}
                            {selectedSymptoms.includes(symptom.id) && (
                              <Check className="w-4 h-4 inline ml-1" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes (optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything else you'd like to note..."
                    className="w-full h-24 p-3 rounded-xl border-2 border-input bg-background resize-none focus:outline-none focus:border-primary/50"
                  />
                </CardContent>
              </Card>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                variant="gradient"
                size="xl"
                className="w-full"
              >
                <Heart className="w-5 h-5" />
                Save Check-in
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {recentSymptoms.length === 0 ? (
                <Card className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No symptoms logged yet</p>
                  <p className="text-sm text-muted-foreground">Start tracking to see your history 💖</p>
                </Card>
              ) : (
                recentSymptoms.map((symptom, index) => {
                  const moodOption = moodOptions.find(m => m.value === symptom.mood);
                  return (
                    <motion.div
                      key={symptom.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card>
                        <CardContent className="py-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${moodOption?.color || 'bg-muted'}`}>
                              {moodOption && <moodOption.icon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium capitalize">{symptom.mood}</span>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(symptom.date), 'MMM d')}
                                </span>
                              </div>
                              {symptom.symptoms.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {symptom.symptoms.slice(0, 3).map(s => (
                                    <span 
                                      key={s} 
                                      className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                                    >
                                      {s.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                  {symptom.symptoms.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{symptom.symptoms.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Symptoms;
