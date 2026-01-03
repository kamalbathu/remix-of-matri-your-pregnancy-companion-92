import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const categoryColors: Record<string, { bg: string; text: string }> = {
  'nutrition': { bg: 'bg-green-100', text: 'text-green-700' },
  'exercise': { bg: 'bg-peach-light', text: 'text-accent-foreground' },
  'mental-health': { bg: 'bg-lavender-light', text: 'text-secondary-foreground' },
  'baby-development': { bg: 'bg-rose-light', text: 'text-primary' },
  'self-care': { bg: 'bg-gold-light', text: 'text-gold' },
};

const stageDescriptions = {
  'pre-pregnancy': {
    title: 'Preparing for Pregnancy',
    description: 'Helpful resources for your conception journey',
    emoji: '🌱',
  },
  'pregnancy': {
    title: 'Your Pregnancy Journey',
    description: 'Week by week guidance for you and baby',
    emoji: '🤰',
  },
  'postpartum': {
    title: 'New Motherhood',
    description: 'Support for your postpartum recovery',
    emoji: '👶',
  },
};

export const Learn = () => {
  const { user } = useAuth();
  const { getEducationalContent } = useData();
  const content = getEducationalContent();
  
  const stageInfo = user?.maternalStage 
    ? stageDescriptions[user.maternalStage]
    : { title: 'Your Journey', description: 'Resources tailored for you', emoji: '✨' };

  // Group content by category
  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof content>);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Learn & Grow 🌸</h1>
          <p className="text-muted-foreground">Knowledge is your superpower</p>
        </div>

        {/* Stage Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{stageInfo.emoji}</span>
                <div>
                  <h2 className="text-lg font-semibold text-primary-foreground">
                    {stageInfo.title}
                  </h2>
                  <p className="text-primary-foreground/80 text-sm">
                    {stageInfo.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Tip */}
        {user?.maternalStage === 'pregnancy' && user?.pregnancyWeek && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="peach">
              <CardContent className="py-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-peach/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Week {user.pregnancyWeek} Tip</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.pregnancyWeek <= 12 && "Your baby's major organs are forming. Stay hydrated and get plenty of rest! 💧"}
                      {user.pregnancyWeek > 12 && user.pregnancyWeek <= 20 && "You might start feeling baby move soon! This is an exciting milestone. 🦋"}
                      {user.pregnancyWeek > 20 && user.pregnancyWeek <= 28 && "Baby is growing quickly now. Good time to start thinking about your birth plan. 📝"}
                      {user.pregnancyWeek > 28 && user.pregnancyWeek <= 36 && "Your baby is getting ready for the world! Practice your breathing exercises. 🧘‍♀️"}
                      {user.pregnancyWeek > 36 && "Almost there! Make sure your hospital bag is packed and ready. 🎒"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content by Category */}
        {Object.entries(groupedContent).map(([category, items], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + categoryIndex * 0.05 }}
          >
            <h2 className="text-lg font-semibold mb-3 capitalize">
              {category.replace('-', ' ')}
            </h2>
            <div className="space-y-3">
              {items.map((item, index) => {
                const colors = categoryColors[item.category] || { bg: 'bg-muted', text: 'text-muted-foreground' };
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.03 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card className="cursor-pointer hover:shadow-card">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {content.length === 0 && (
          <Card className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No content available yet</p>
            <p className="text-sm text-muted-foreground">Complete your profile to see personalized content 💖</p>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="bg-muted/50 rounded-2xl p-4 mt-8">
          <p className="text-xs text-muted-foreground text-center">
            📚 This content is for educational purposes only. Always consult your healthcare provider for medical advice.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Learn;
