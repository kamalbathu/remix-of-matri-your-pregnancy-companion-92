import { motion } from 'framer-motion';
import { Phone, AlertTriangle, Heart, Shield, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useData } from '@/contexts/DataContext';

const emergencyContacts = [
  {
    title: 'Emergency Services',
    number: '911',
    description: 'For life-threatening emergencies',
    icon: Phone,
    color: 'bg-coral/20 text-coral',
    urgent: true,
  },
  {
    title: 'Poison Control',
    number: '1-800-222-1222',
    description: '24/7 poison emergency helpline',
    icon: Shield,
    color: 'bg-rose-light text-primary',
    urgent: false,
  },
  {
    title: 'Postpartum Support',
    number: '1-800-944-4773',
    description: 'Postpartum Support International',
    icon: Heart,
    color: 'bg-lavender-light text-secondary-foreground',
    urgent: false,
  },
  {
    title: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free 24/7 mental health support',
    icon: MessageCircle,
    color: 'bg-peach-light text-accent-foreground',
    urgent: false,
  },
];

const warningSymptoms = [
  'Severe headache that doesn\'t go away',
  'Changes in vision (blurry, spots, flashing)',
  'Severe abdominal pain',
  'Heavy vaginal bleeding',
  'No fetal movement for extended periods',
  'Sudden swelling of face, hands, or feet',
  'High fever (above 101°F / 38.3°C)',
  'Difficulty breathing',
  'Chest pain',
  'Thoughts of harming yourself or baby',
];

export const Emergency = () => {
  const { checkSafetyAlerts } = useData();
  const safetyAlert = checkSafetyAlerts();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Emergency Support 💗</h1>
          <p className="text-muted-foreground">Help is always available</p>
        </div>

        {/* Active Alert */}
        {safetyAlert.hasAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-coral/50 bg-coral/10">
              <CardContent className="py-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Health Notice</h3>
                    <p className="text-muted-foreground">{safetyAlert.message}</p>
                    {safetyAlert.symptoms.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {safetyAlert.symptoms.map(s => (
                          <span 
                            key={s} 
                            className="text-xs px-2 py-1 bg-coral/20 text-coral rounded-full"
                          >
                            {s.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Emergency Contacts */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Emergency Contacts</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={contact.urgent ? 'border-coral/30' : ''}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${contact.color} flex items-center justify-center`}>
                        <contact.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{contact.title}</h3>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                      </div>
                      <Button 
                        variant={contact.urgent ? "emergency" : "outline"}
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => {
                          if (contact.number.startsWith('Text')) {
                            window.open('sms:741741', '_blank');
                          } else {
                            window.open(`tel:${contact.number.replace(/-/g, '')}`, '_blank');
                          }
                        }}
                      >
                        {contact.number.startsWith('Text') ? 'Text' : 'Call'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="lavender">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-coral" />
                When to Seek Help
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Contact your healthcare provider immediately if you experience:
              </p>
              <ul className="space-y-2">
                {warningSymptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-coral mt-1">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a 
                href="https://www.acog.org/womens-health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm">ACOG - Women's Health</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              <a 
                href="https://www.marchofdimes.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm">March of Dimes</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              <a 
                href="https://www.postpartum.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm">Postpartum Support International</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <div className="bg-rose-light/50 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground text-center">
            🏥 MATRI provides general guidance only. For medical emergencies, always call emergency services immediately.
            This app does not provide medical diagnosis or treatment.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Emergency;
