import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const textSizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${sizes[size]} gradient-primary rounded-2xl flex items-center justify-center shadow-soft`}>
        <span className="text-primary-foreground font-bold" style={{ fontSize: size === 'xl' ? '2rem' : size === 'lg' ? '1.5rem' : '1rem' }}>
          M
        </span>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-gradient`}>
          MATRI
        </span>
      )}
    </motion.div>
  );
};
