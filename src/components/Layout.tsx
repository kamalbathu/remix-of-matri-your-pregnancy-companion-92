import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, Calendar, BookOpen, Phone, User, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/symptoms', icon: Heart, label: 'Symptoms' },
  { path: '/appointments', icon: Calendar, label: 'Schedule' },
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/emergency', icon: Phone, label: 'Help' },
];

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
              className="rounded-full"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-24 pt-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
