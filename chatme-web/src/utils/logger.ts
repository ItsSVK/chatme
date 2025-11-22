/**
 * Logger Utility
 * Provides environment-aware logging that only shows in development
 */

class Logger {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Debug logs - only shown in development
   */
  debug(...args: any[]) {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  /**
   * Info logs - only shown in development
   */
  info(...args: any[]) {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  /**
   * Warning logs - shown in both dev and production
   */
  warn(...args: any[]) {
    console.warn(...args);
  }

  /**
   * Error logs - shown in both dev and production
   */
  error(...args: any[]) {
    console.error(...args);
  }

  /**
   * Success logs - only shown in development
   */
  success(...args: any[]) {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
