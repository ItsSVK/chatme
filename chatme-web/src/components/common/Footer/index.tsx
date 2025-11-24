import { motion } from 'framer-motion';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      <div className="footer-content">
        <span className="footer-text">Crafted with care by</span>
        <span className="footer-author" onClick={() => window.open('https://twitter.com/ShouvikMohanta', '_blank')}>Shouvik Mohanta</span>
      </div>
    </motion.footer>
  );
};
