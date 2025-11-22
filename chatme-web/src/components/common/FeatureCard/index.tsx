import { motion } from 'framer-motion';
import './FeatureCard.css';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  borderColor: string;
  iconBgColor: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  borderColor,
  iconBgColor,
  delay = 0,
}) => {
  return (
    <motion.div
      className="feature-card glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02, 
        transition: { duration: 0.15, ease: "easeOut" }
      }}
      style={{ borderColor }}
    >
      <div className="feature-icon" style={{ backgroundColor: iconBgColor }}>
        <span>{icon}</span>
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
};
