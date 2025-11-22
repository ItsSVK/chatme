import { motion } from 'framer-motion';
import './AnimatedBackground.css';

interface AnimatedBackgroundProps {
  variant?: 'home' | 'chat';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'home' }) => {
  return (
    <div className="animated-background">
      {/* Gradient Background */}
      <div className={`gradient-layer ${variant}`} />
      
      {/* Floating Orbs */}
      <motion.div
        className="orb orb-1"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="orb orb-2"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="orb orb-3"
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />
    </div>
  );
};
