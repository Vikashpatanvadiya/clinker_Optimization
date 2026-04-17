import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import InputForms from './components/InputForms/InputForms';
import Analytics from './components/Analytics/Analytics';
import Reports from './components/Reports/Reports';
import OptimizationDashboard from './components/Optimization/OptimizationDashboard';
import SmartOptimizer from './components/SmartOptimizer/SmartOptimizer';
import ErrorBoundary from './components/ErrorBoundary';
import CommandPalette from './components/ui/CommandPalette';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { logDataIssues } from './utils/dataValidator';

// Inner App component that can use theme context
function AppContent() {
  const { appMode } = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Redirect to dashboard if on optimization view and mode changes to logistics
  useEffect(() => {
    if (appMode === 'logistics' && activeView === 'optimization') {
      setActiveView('logistics');
    }
    if (appMode === 'optimization' && activeView === 'logistics') {
      setActiveView('optimization');
    }
  }, [appMode, activeView]);

  const handleCommand = useCallback((commandId) => {
    switch (commandId) {
      case 'open-palette':
        setCommandPaletteOpen(true);
        break;
      case 'dashboard':
        setActiveView('dashboard');
        break;
      case 'optimization':
        if (appMode === 'optimization') setActiveView('optimization');
        break;
      case 'logistics':
        if (appMode === 'logistics') setActiveView('logistics');
        break;
      case 'input':
        setActiveView('input');
        break;
      case 'analytics':
        setActiveView('analytics');
        break;
      case 'reports':
        setActiveView('reports');
        break;
      default:
        break;
    }
  }, [appMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
        const clinkerData = await response.json();
        if (!clinkerData || typeof clinkerData !== 'object') throw new Error('Invalid data format');
        setData(clinkerData);
        try { logDataIssues(clinkerData); } catch (e) { console.warn('Validation:', e.message); }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setData({ ClinkerDemand: [], ClinkerCapacity: [], ProductionCost: [], LogisticsIUGU: [], IUGUConstraint: [], IUGUOpeningStock: [], IUGUClosingStock: [], IUGUType: [], HubOpeningStock: [] });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleViewChange = (view) => {
    // Prevent going to optimization in logistics mode and vice versa
    if (view === 'optimization' && appMode === 'logistics') {
      setActiveView('logistics');
      return;
    }
    if (view === 'logistics' && appMode === 'optimization') {
      setActiveView('optimization');
      return;
    }
    setActiveView(view);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Clinker Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-premium-darker transition-colors duration-300">
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onCommand={handleCommand} />
      
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeView={activeView} setActiveView={handleViewChange} />
      
      <div className="flex relative">
        <Sidebar activeView={activeView} setActiveView={handleViewChange} isOpen={sidebarOpen} />
        
        {/* Overlay for mobile */}
        <div
          className={`fixed inset-0 bg-black z-30 lg:hidden transition-opacity duration-200 ${
            sidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <main
          className="flex-1 min-h-[calc(100vh-4rem)]"
          style={{
            marginLeft: sidebarOpen ? '16rem' : '0',
            transition: 'margin-left 200ms ease-in-out',
          }}
        >
          <div className="p-3 sm:p-4 lg:p-6">
            {error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center max-w-md">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Data Loading Error</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{error}</p>
                  <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry</button>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={`${activeView}-${appMode}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <ErrorBoundary>
                    {activeView === 'dashboard' && <Dashboard data={data} />}
                    {activeView === 'optimization' && appMode === 'optimization' && <OptimizationDashboard data={data} />}
                    {activeView === 'logistics' && appMode === 'logistics' && <SmartOptimizer />}
                    {activeView === 'input' && <InputForms data={data} setData={setData} />}
                    {activeView === 'analytics' && <Analytics data={data} />}
                    {activeView === 'reports' && <Reports data={data} />}
                  </ErrorBoundary>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Main App wrapper with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
