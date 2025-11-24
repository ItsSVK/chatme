import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '../../components/common/AnimatedBackground';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { FeatureCard } from '../../components/common/FeatureCard';
import { MobileAppPromo } from '../../components/common/MobileAppPromo';
import { Footer } from '../../components/common/Footer';
import './HomeScreen.css';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    // Pass state to indicate user came from home screen
    navigate('/chat', { state: { fromHome: true } });
  };

  return (
    <div className="home-screen">
      <AnimatedBackground variant="home" />
      
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>

      <div className="home-content">
        {/* Logo */}
        <motion.div
          className="logo-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo">
            <img src="/chatme-transparent.svg" alt="ChatMe Logo" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="title-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="title gradient-text">Ready to Chat?</h1>
          <p className="subtitle">Connect anonymously with people around the world</p>
        </motion.div>

        {/* Features */}
        <motion.div
          className="features"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FeatureCard
            icon="🔒"
            title="Anonymous"
            description="Your privacy is protected"
            borderColor="#8B5CF6"
            iconBgColor="rgba(139, 92, 246, 0.12)"
            delay={0.6}
          />
          <FeatureCard
            icon="⚡"
            title="Real-time"
            description="Instant messaging experience"
            borderColor="#F59E0B"
            iconBgColor="rgba(245, 158, 11, 0.12)"
            delay={0.7}
          />
          <FeatureCard
            icon="🌍"
            title="Global"
            description="Chat with anyone, anywhere"
            borderColor="#3B82F6"
            iconBgColor="rgba(59, 130, 246, 0.12)"
            delay={0.8}
          />
        </motion.div>

        {/* Start Button */}
        <motion.button
          className="start-button gradient-bg"
          onClick={handleStartChat}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Chatting
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="12 5 19 12 12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>

        {/* Mobile App Promo */}
        <div>
        <MobileAppPromo/>
        </div>
      </div>

      <Footer />
    </div>
  );
};
