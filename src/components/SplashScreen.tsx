import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

interface SplashScreenProps {
  isLoading: boolean;
}

const SplashScreen = ({ isLoading }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          {/* Mesh gradient background */}
          <div className="absolute inset-0 mesh-gradient" />
          
          {/* Animated glow orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-primary/20 blur-[100px]"
              animate={{
                x: [-100, 100, -100],
                y: [-50, 50, -50],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '20%', left: '30%' }}
            />
            <motion.div
              className="absolute w-80 h-80 rounded-full bg-secondary/20 blur-[100px]"
              animate={{
                x: [100, -100, 100],
                y: [50, -50, 50],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              style={{ bottom: '20%', right: '30%' }}
            />
          </div>

          {/* Logo with animations */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2 
              }}
              className="relative"
            >
              {/* Logo glow effect */}
              <div className="absolute inset-0 blur-2xl opacity-60">
                <img 
                  src={logo} 
                  alt="" 
                  className="h-28 w-auto"
                  aria-hidden="true"
                />
              </div>
              
              {/* Main logo */}
              <motion.img 
                src={logo} 
                alt="AI DEALS" 
                className="h-28 w-auto relative z-10 drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]"
                animate={{
                  filter: [
                    'drop-shadow(0 0 30px rgba(168,85,247,0.5))',
                    'drop-shadow(0 0 50px rgba(168,85,247,0.8))',
                    'drop-shadow(0 0 30px rgba(168,85,247,0.5))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Loading spinner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="relative w-6 h-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <motion.span 
                className="text-sm text-muted-foreground font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Loading...
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
