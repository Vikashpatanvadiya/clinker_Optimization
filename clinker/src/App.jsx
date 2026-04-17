import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import InputForms from './components/InputForms/InputForms';
import Analytics from './components/Analytics/Analytics';
import Reports from './components/Reports/Reports';
import SmartOptimizer from './components/SmartOptimizer/SmartOptimizer';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [activeView, setActiveView] = useState('optimizer');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed on mobile

  // Close sidebar on mobile when view changes
  const handleViewChange = (view) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-premium-darker transition-colors duration-300">
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeView={activeView}
            setActiveView={handleViewChange}
          />
          
          <div className="flex relative">
            <AnimatePresence>
              {sidebarOpen && (
                <Sidebar 
                  activeView={activeView}
                  setActiveView={handleViewChange}
                />
              )}
            </AnimatePresence>
            
            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <main className={`flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] ${
              sidebarOpen ? 'lg:ml-64' : 'ml-0'
            }`}>
              <div className="p-3 sm:p-4 lg:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ErrorBoundary>
                      {activeView === 'optimizer' && <SmartOptimizer />}
                      {activeView === 'dashboard' && <Dashboard />}
                      {activeView === 'input' && <InputForms />}
                      {activeView === 'analytics' && <Analytics />}
                      {activeView === 'reports' && <Reports />}
                    </ErrorBoundary>
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;