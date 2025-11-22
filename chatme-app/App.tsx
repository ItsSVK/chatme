import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SplashScreen, HomeScreen, ChatScreen } from './src/screens';

type Screen = 'splash' | 'home' | 'chat';

/**
 * Root App Component
 * Manages the initial app state and screen transitions
 */
function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  const handleSplashFinish = () => {
    setCurrentScreen('home');
  };

  const handleStartChat = () => {
    setCurrentScreen('chat');
  };

  const handleEndChat = () => {
    setCurrentScreen('home');
  };

  const handleNextChat = () => {
    // Reset chat screen (you can add logic here to find a new chat partner)
    setCurrentScreen('chat');
  };

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={handleSplashFinish} />
        )}
        {currentScreen === 'chat' && (
          <ChatScreen onEndChat={handleEndChat} onNextChat={handleNextChat} />
        )}
        {currentScreen === 'home' && (
          <HomeScreen onStartChat={handleStartChat} />
        )}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
