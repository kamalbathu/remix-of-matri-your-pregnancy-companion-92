import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Calendar, BookOpen, Shield, Check, Users, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
const services = [{
  icon: Calendar,
  title: 'Booking Appointments',
  description: 'Choose the best time for an in-person visit or an easy-to-use scheduling feature.'
}, {
  icon: Heart,
  title: 'Symptom Tracking',
  description: 'Log your daily symptoms and track patterns throughout your maternal journey.'
}, {
  icon: BookOpen,
  title: 'Medical Notes',
  description: 'Access your medical history and keep important notes organized in one place.'
}];
const steps = [{
  number: '01',
  title: 'Create Your Profile',
  description: 'Sign up easily and securely to get started with personalized maternal care.'
}, {
  number: '02',
  title: 'Choose Your Service',
  description: 'Browse and book a consultation, track symptoms, or access guidance resources.'
}, {
  number: '03',
  title: 'Connect with Support',
  description: 'Get expert advice and emergency support whenever you need it most.'
}];
const stats = [{
  value: '2,500+',
  label: 'Healthy Mothers'
}, {
  value: '98%',
  label: 'Patient Satisfaction'
}, {
  value: '24/7',
  label: 'Support Available'
}];
const Index = () => {
  const navigate = useNavigate();
  const {
    user,
    isLoading
  } = useAuth();
  useEffect(() => {
    if (!isLoading && user) {
      navigate(user.maternalStage ? '/dashboard' : '/onboarding');
    }
  }, [user, isLoading, navigate]);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Logo size="lg" />
      </div>;
  }
  return <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About us</a>
          </div>
          <Button onClick={() => navigate('/auth')} className="rounded-full px-6">
            Join us
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/30 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your <span className="text-gradient">trusted partner</span>
                <br />in maternal healthcare.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Empowering your health at every step. Experience personalized maternal care from the comfort of your home. Connect with certified guidance and manage your journey with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => navigate('/auth')} size="lg" className="rounded-full px-8 gap-2">
                  Book an appointment
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => document.getElementById('about')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  Learn more about us
                </Button>
              </div>
              
              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <span>Trusted by mothers across the globe:</span>
                <div className="flex gap-4">
                  <Users className="w-5 h-5" />
                  <Star className="w-5 h-5" />
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* Appointment Card */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="relative">
              <Card className="shadow-card border-0 bg-card p-6 rounded-2xl">
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground mb-4">Easily book an appointment in 3 simple steps.</p>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Email Address</label>
                        <div className="bg-muted rounded-lg px-4 py-3 text-sm">Enter your email address</div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Contact Number</label>
                        <div className="bg-muted rounded-lg px-4 py-3 text-sm">+1 000 000 0000</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Date of Appointment</label>
                      <div className="bg-muted rounded-lg px-4 py-3 text-sm">Select preferred date</div>
                    </div>
                    <Button className="w-full rounded-full" onClick={() => navigate('/auth')}>
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Floating testimonial */}
              

              {/* Stats badge */}
              <motion.div initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.6
            }} className="absolute -top-4 -right-4 bg-card shadow-card rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">2400+</div>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Top <span className="text-gradient">services</span> we offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your health deserves the utmost attention and convenience. That's why we offer a suite of integrated services designed to cater to your needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => <motion.div key={service.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }}>
                <Card className="h-full hover:shadow-card transition-shadow border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How our <span className="text-gradient">platform</span> works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started with MATRI is seamless. Just follow these simple steps and begin your journey with healthcare.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => <motion.div key={step.number} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.15
          }} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {i < steps.length - 1 && <div className="hidden md:block absolute top-8 right-0 w-1/2 border-t-2 border-dashed border-primary/20" />}
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* About/Stats Section */}
      <section id="about" className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 wave-pattern opacity-50" />
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Let's Story: <span className="text-gradient">Get to know us</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                MATRI is more than just a maternal health service; it's a movement towards accessible, efficient, and compassionate healthcare. Born out of a passion for improving mothers' lives, we are driven by the mission to deliver exceptional care that's just a click away.
              </p>
              <p className="text-muted-foreground mb-8">
                We are built on the pillars of trust, innovation, personalization, and sensitivity, ensuring that every mother feels listened to for their unique needs.
              </p>
              <Button className="rounded-full px-8" onClick={() => navigate('/auth')}>
                Learn more about us
              </Button>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => <Card key={i} className="text-center p-6 border-0 bg-card shadow-soft">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </Card>)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} className="gradient-primary rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start your maternal journey?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of mothers who trust MATRI for their healthcare needs. Sign up today and experience personalized care.
            </p>
            <Button variant="secondary" size="lg" className="rounded-full px-8" onClick={() => navigate('/auth')}>
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="sm" />
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#services" className="hover:text-primary transition-colors">Services</a>
              <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MATRI. All rights reserved.
            </p>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
            MATRI provides general guidance and does not replace professional medical advice. Always consult healthcare providers for medical concerns.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;