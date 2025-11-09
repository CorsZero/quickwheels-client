/**
 * Quick Wheel Vehicle Rental App
 * Main App Component
 * Description: Root component with providers, routing, and layout
 * Tech: React + TypeScript + CSS Modules + React Router
 */

import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdsProvider } from './contexts/AdsContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AdsProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AdsProvider>
    </AuthProvider>
  );
}

export default App;
