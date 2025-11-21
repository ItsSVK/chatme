import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { HomeScreen } from './screens/HomeScreen';
import { ChatScreen } from './screens/ChatScreen';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatScreen />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
