import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Plus, Check, X, Clock, 
  Stethoscope, Activity, Droplet, MessageCircle, MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/Layout';
import { useData, Appointment } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

type AppointmentType = Appointment['type'];

const appointmentTypes: { value: AppointmentType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'checkup', label: 'Checkup', icon: Stethoscope, color: 'bg-rose-light text-primary' },
  { value: 'ultrasound', label: 'Ultrasound', icon: Activity, color: 'bg-lavender-light text-secondary-foreground' },
  { value: 'blood-test', label: 'Blood Test', icon: Droplet, color: 'bg-coral/20 text-coral' },
  { value: 'consultation', label: 'Consultation', icon: MessageCircle, color: 'bg-peach-light text-accent-foreground' },
  { value: 'other', label: 'Other', icon: MoreHorizontal, color: 'bg-muted text-muted-foreground' },
];

export const Appointments = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedType, setSelectedType] = useState<AppointmentType>('checkup');
  const [notes, setNotes] = useState('');

  const { appointments, addAppointment, updateAppointment, deleteAppointment, getUpcomingAppointments } = useData();
  
  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = appointments
    .filter(apt => isPast(new Date(apt.date)) || apt.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !time) {
      toast({
        title: "Please fill in all fields",
        description: "We need the details to schedule your appointment 💖",
        variant: "destructive",
      });
      return;
    }

    addAppointment({
      title,
      date,
      time,
      type: selectedType,
      notes: notes || undefined,
      completed: false,
    });

    toast({
      title: "Appointment scheduled! 📅",
      description: "We'll remind you when it's coming up.",
    });

    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setSelectedType('checkup');
    setNotes('');
    setShowAddForm(false);
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const typeInfo = appointmentTypes.find(t => t.value === appointment.type) || appointmentTypes[4];
    const Icon = typeInfo.icon;
    
    return (
      <Card className={appointment.completed ? 'opacity-60' : ''}>
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeInfo.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={`font-medium ${appointment.completed ? 'line-through' : ''}`}>
                    {appointment.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    <span>{getDateLabel(appointment.date)}</span>
                    <span>•</span>
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!appointment.completed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => updateAppointment(appointment.id, { completed: true })}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      deleteAppointment(appointment.id);
                      toast({ title: "Appointment removed" });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {appointment.notes && (
                <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded-lg">
                  {appointment.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Your Care Schedule 💖</h1>
            <p className="text-muted-foreground">Keep track of your appointments</p>
          </div>
          <Button
            variant={showAddForm ? "outline" : "gradient"}
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </Button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card variant="lavender">
                <CardHeader>
                  <CardTitle className="text-lg">New Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Appointment title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Type</p>
                      <div className="flex flex-wrap gap-2">
                        {appointmentTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setSelectedType(type.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                              selectedType === type.value
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted text-muted-foreground border-transparent'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      placeholder="Notes (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-20 p-3 rounded-xl border-2 border-input bg-background resize-none focus:outline-none focus:border-primary/50"
                    />

                    <Button type="submit" variant="gradient" className="w-full">
                      Schedule Appointment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upcoming */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Upcoming</h2>
          {upcomingAppointments.length === 0 ? (
            <Card className="text-center py-8">
              <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No upcoming appointments</p>
              <p className="text-sm text-muted-foreground">Tap + to add one 💖</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AppointmentCard appointment={apt} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Completed</h2>
            <div className="space-y-3">
              {pastAppointments.slice(0, 5).map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
