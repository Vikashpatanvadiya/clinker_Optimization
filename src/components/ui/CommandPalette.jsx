import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  BarChart3,
  Settings,
  FileText,
  Play,
  Download,
  Home,
  Upload,
  Calculator,
  AlertTriangle,
  GitBranch,
  Sparkles,
  Factory,
  Truck,
  X
} from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, onCommand }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: Home, shortcut: '1', category: 'Navigation' },
    { id: 'optimization', label: 'Go to Optimization', icon: BarChart3, shortcut: '2', category: 'Navigation' },
    { id: 'input', label: 'Go to Data Management', icon: Upload, shortcut: '3', category: 'Navigation' },
    { id: 'analytics', label: 'Go to Analytics', icon: Calculator, shortcut: '4', category: 'Navigation' },
    { id: 'reports', label: 'Go to Reports', icon: FileText, shortcut: '5', category: 'Navigation' },
    { id: 'run-optimization', label: 'Run Optimization', icon: Play, shortcut: 'R', category: 'Actions' },
    { id: 'export-pdf', label: 'Export PDF Report', icon: Download, shortcut: 'E', category: 'Actions' },
    { id: 'tab-summary', label: 'Show Summary Tab', icon: Sparkles, category: 'Tabs' },
    { id: 'tab-charts', label: 'Show Charts Tab', icon: BarChart3, category: 'Tabs' },
    { id: 'tab-flow', label: 'Show Flow Diagram', icon: GitBranch, category: 'Tabs' },
    { id: 'tab-production', label: 'Show Production Tab', icon: Factory, category: 'Tabs' },
    { id: 'tab-transport', label: 'Show Transport Tab', icon: Truck, category: 'Tabs' },
    { id: 'tab-violations', label: 'Show Violations', icon: AlertTriangle, category: 'Tabs' },
    { id: 'scenario', label: 'Open Scenario Simulator', icon: Settings, category: 'Tools' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onCommand(filteredCommands[selectedIndex].id);
          onClose();
          setQuery('');
        }
        break;
      case 'Escape':
        onClose();
        setQuery('');
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, onCommand, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Global keyboard shortcut to open
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onCommand('open-palette');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose, onCommand]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">esc</kbd>
              <span>to close</span>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-80 overflow-y-auto py-2">
            {Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {category}
                </div>
                {cmds.map((cmd) => {
                  const currentIndex = flatIndex++;
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        onCommand(cmd.id);
                        onClose();
                        setQuery('');
                      }}
                      className={`w-full flex items-center px-4 py-2.5 text-left transition-colors ${
                        currentIndex === selectedIndex
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3 opacity-60" />
                      <span className="flex-1">{cmd.label}</span>
                      {cmd.shortcut && (
                        <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded mr-1">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center">
                <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded mr-1">↵</kbd>
                select
              </span>
            </div>
            <div className="flex items-center">
              <Command className="h-3 w-3 mr-1" />
              <span>K to toggle</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
