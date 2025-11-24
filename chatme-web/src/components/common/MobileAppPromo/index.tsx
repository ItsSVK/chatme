import React from 'react';
import { motion } from 'framer-motion';
import './MobileAppPromo.css';

export const MobileAppPromo: React.FC = () => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsDownloading(true);
    // Reset animation state after it completes
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <motion.div
      className="mobile-app-promo"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.1 }}
    >
      <div className="promo-card">
        <div className="promo-content">
          <div className="promo-text">
            <h3 className="promo-title">
              Get it on Android
            </h3>
          </div>
        </div>
        <div className="promo-actions">
          <a
            // https://github.com/ItsSVK/chatme/releases/download/v1.0.0/app-release.apk
            href="/chatme.apk"
            rel="noopener noreferrer"
            className={`download-btn ${isDownloading ? 'downloading' : ''}`}
            title="Download APK"
            onClick={handleDownload}
          >
            {isDownloading ? (
              <motion.svg
                key="check"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="download"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </motion.svg>
            )}
          </a>
          <a
            href="https://github.com/ItsSVK/chatme/releases/"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            title="View on GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
};
