import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Keep original interfaces for backward compatibility with frontend
export interface Symptom {
  id: string;
  userId: string;
  date: string;
  symptoms: string[];
  notes?: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'difficult';
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  type: 'checkup' | 'ultrasound' | 'blood-test' | 'consultation' | 'other';
  notes?: string;
  completed: boolean;
}

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  stage: 'pre-pregnancy' | 'pregnancy' | 'postpartum' | 'all';
  weekRange?: [number, number];
  category: 'nutrition' | 'exercise' | 'mental-health' | 'baby-development' | 'self-care';
  icon: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  contactName: string;
  contactNumber: string;
  relation?: string;
}

interface DataContextType {
  symptoms: Symptom[];
  appointments: Appointment[];
  emergencyContacts: EmergencyContact[];
  isLoadingData: boolean;
  addSymptom: (symptom: Omit<Symptom, 'id' | 'userId'>) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'userId'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'userId'>) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  getRecentSymptoms: (days?: number) => Symptom[];
  getUpcomingAppointments: () => Appointment[];
  getEducationalContent: () => EducationalContent[];
  checkSafetyAlerts: () => { hasAlert: boolean; message: string; symptoms: string[] };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Safety alert rules - symptoms that warrant consultation
const alertSymptoms = {
  severe: ['severe_headache', 'vision_changes', 'severe_abdominal_pain', 'heavy_bleeding', 'no_fetal_movement'],
  moderate: ['persistent_vomiting', 'high_fever', 'swelling', 'chest_pain'],
};

// Static educational content (can be enhanced with DB content later)
const educationalContentData: EducationalContent[] = [
  {
    id: '1',
    title: 'Preparing Your Body',
    description: 'Essential vitamins and nutrients for conception',
    stage: 'pre-pregnancy',
    category: 'nutrition',
    icon: '🥗',
  },
  {
    id: '2',
    title: 'Gentle Movement',
    description: 'Safe exercises to boost fertility and wellbeing',
    stage: 'pre-pregnancy',
    category: 'exercise',
    icon: '🧘‍♀️',
  },
  {
    id: '3',
    title: 'First Trimester Tips',
    description: 'What to expect in weeks 1-12',
    stage: 'pregnancy',
    weekRange: [1, 12],
    category: 'baby-development',
    icon: '🌱',
  },
  {
    id: '4',
    title: 'Growing Together',
    description: 'Your baby\'s development in weeks 13-26',
    stage: 'pregnancy',
    weekRange: [13, 26],
    category: 'baby-development',
    icon: '🦋',
  },
  {
    id: '5',
    title: 'Preparing for Birth',
    description: 'Getting ready for the big day',
    stage: 'pregnancy',
    weekRange: [27, 42],
    category: 'self-care',
    icon: '🌸',
  },
  {
    id: '6',
    title: 'Postpartum Recovery',
    description: 'Caring for yourself after birth',
    stage: 'postpartum',
    category: 'self-care',
    icon: '💖',
  },
  {
    id: '7',
    title: 'Mental Wellness',
    description: 'Nurturing your emotional health',
    stage: 'all',
    category: 'mental-health',
    icon: '🧠',
  },
  {
    id: '8',
    title: 'Nutrition Guide',
    description: 'Eating well for you and baby',
    stage: 'pregnancy',
    category: 'nutrition',
    icon: '🍎',
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch all user data when user changes
  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setSymptoms([]);
      setAppointments([]);
      setEmergencyContacts([]);
      setIsLoadingData(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setIsLoadingData(true);
    
    try {
      // Fetch symptoms - map from DB schema to frontend schema
      const { data: symptomsData } = await supabase
        .from('symptoms_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (symptomsData) {
        // Group symptoms by logged_date to combine into the frontend format
        const symptomsByDate = new Map<string, Symptom>();
        
        symptomsData.forEach(s => {
          const dateKey = s.logged_date;
          const existing = symptomsByDate.get(dateKey);
          
          if (existing) {
            existing.symptoms.push(s.symptom_type);
            if (s.notes) existing.notes = s.notes;
          } else {
            // Map severity to mood
            let mood: Symptom['mood'] = 'okay';
            if (s.severity === 5) mood = 'great';
            else if (s.severity === 4) mood = 'good';
            else if (s.severity === 3) mood = 'okay';
            else if (s.severity === 2) mood = 'low';
            else if (s.severity === 1) mood = 'difficult';
            
            symptomsByDate.set(dateKey, {
              id: s.id,
              userId: s.user_id,
              date: s.created_at,
              symptoms: [s.symptom_type],
              notes: s.notes || undefined,
              mood,
            });
          }
        });
        
        setSymptoms(Array.from(symptomsByDate.values()));
      }

      // Fetch appointments - map from DB schema to frontend schema
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });
      
      if (appointmentsData) {
        setAppointments(appointmentsData.map(a => {
          const apptDate = new Date(a.appointment_date);
          return {
            id: a.id,
            userId: a.user_id,
            title: a.doctor_name || 'Appointment',
            date: apptDate.toISOString().split('T')[0],
            time: apptDate.toTimeString().slice(0, 5),
            type: 'checkup' as const, // Default type since not in DB
            notes: a.notes || undefined,
            completed: a.status === 'completed',
          };
        }));
      }

      // Fetch emergency contacts
      const { data: contactsData } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id);
      
      if (contactsData) {
        setEmergencyContacts(contactsData.map(c => ({
          id: c.id,
          userId: c.user_id,
          contactName: c.contact_name,
          contactNumber: c.contact_number,
          relation: c.relation || undefined,
        })));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    
    setIsLoadingData(false);
  };

  const addSymptom = async (symptom: Omit<Symptom, 'id' | 'userId'>) => {
    if (!user) return;

    const loggedDate = new Date().toISOString().split('T')[0];
    
    // Map mood to severity
    let severity = 3;
    if (symptom.mood === 'great') severity = 5;
    else if (symptom.mood === 'good') severity = 4;
    else if (symptom.mood === 'okay') severity = 3;
    else if (symptom.mood === 'low') severity = 2;
    else if (symptom.mood === 'difficult') severity = 1;

    // Insert each symptom as a separate row
    const insertPromises = symptom.symptoms.map((symptomType, index) => 
      supabase
        .from('symptoms_log')
        .insert({
          user_id: user.id,
          symptom_type: symptomType,
          severity,
          notes: index === 0 ? symptom.notes : undefined, // Only add notes to first entry
          logged_date: loggedDate,
        })
        .select()
        .single()
    );

    try {
      const results = await Promise.all(insertPromises);
      const firstResult = results[0];
      
      if (firstResult.data) {
        // Add to local state
        const newSymptom: Symptom = {
          id: firstResult.data.id,
          userId: user.id,
          date: firstResult.data.created_at,
          symptoms: symptom.symptoms,
          notes: symptom.notes,
          mood: symptom.mood,
        };
        
        setSymptoms(prev => [newSymptom, ...prev]);
      }
    } catch (error) {
      console.error('Error adding symptoms:', error);
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'userId'>) => {
    if (!user) return;

    // Combine date and time into a timestamp
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        doctor_name: appointment.title,
        hospital: '',
        appointment_date: appointmentDate.toISOString(),
        notes: appointment.notes,
        status: appointment.completed ? 'completed' : 'upcoming',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding appointment:', error);
      return;
    }

    if (data) {
      const newAppointment: Appointment = {
        id: data.id,
        userId: data.user_id,
        title: data.doctor_name || 'Appointment',
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        notes: data.notes || undefined,
        completed: data.status === 'completed',
      };
      
      setAppointments(prev => [...prev, newAppointment].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    const dbUpdates: Record<string, any> = {};
    
    if (updates.title !== undefined) dbUpdates.doctor_name = updates.title;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.completed !== undefined) dbUpdates.status = updates.completed ? 'completed' : 'upcoming';
    
    if (updates.date !== undefined || updates.time !== undefined) {
      const existingApt = appointments.find(a => a.id === id);
      if (existingApt) {
        const newDate = updates.date || existingApt.date;
        const newTime = updates.time || existingApt.time;
        dbUpdates.appointment_date = new Date(`${newDate}T${newTime}`).toISOString();
      }
    }

    const { error } = await supabase
      .from('appointments')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment:', error);
      return;
    }

    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    ));
  };

  const deleteAppointment = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      return;
    }

    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id' | 'userId'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({
        user_id: user.id,
        contact_name: contact.contactName,
        contact_number: contact.contactNumber,
        relation: contact.relation,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding emergency contact:', error);
      return;
    }

    if (data) {
      setEmergencyContacts(prev => [...prev, {
        id: data.id,
        userId: data.user_id,
        contactName: data.contact_name,
        contactNumber: data.contact_number,
        relation: data.relation || undefined,
      }]);
    }
  };

  const deleteEmergencyContact = async (id: string) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting emergency contact:', error);
      return;
    }

    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  const getRecentSymptoms = (days = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return symptoms.filter(s => new Date(s.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(apt => apt.date >= today && !apt.completed)
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getEducationalContent = () => {
    if (!user?.maternalStage) return educationalContentData.filter(c => c.stage === 'all');
    
    return educationalContentData.filter(content => {
      if (content.stage === 'all') return true;
      if (content.stage !== user.maternalStage) return false;
      
      if (content.weekRange && user.pregnancyWeek) {
        return user.pregnancyWeek >= content.weekRange[0] && user.pregnancyWeek <= content.weekRange[1];
      }
      
      return true;
    });
  };

  const checkSafetyAlerts = () => {
    const recentSymptoms = getRecentSymptoms(1);
    const todaySymptoms = recentSymptoms[0]?.symptoms || [];
    
    const severeMatches = todaySymptoms.filter(s => alertSymptoms.severe.includes(s));
    const moderateMatches = todaySymptoms.filter(s => alertSymptoms.moderate.includes(s));
    
    if (severeMatches.length > 0) {
      return {
        hasAlert: true,
        message: 'Please seek medical attention promptly. Some of your symptoms may need immediate evaluation.',
        symptoms: severeMatches,
      };
    }
    
    if (moderateMatches.length >= 2) {
      return {
        hasAlert: true,
        message: 'Consider reaching out to your healthcare provider to discuss your symptoms.',
        symptoms: moderateMatches,
      };
    }
    
    return { hasAlert: false, message: '', symptoms: [] };
  };

  return (
    <DataContext.Provider value={{
      symptoms,
      appointments,
      emergencyContacts,
      isLoadingData,
      addSymptom,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addEmergencyContact,
      deleteEmergencyContact,
      getRecentSymptoms,
      getUpcomingAppointments,
      getEducationalContent,
      checkSafetyAlerts,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
