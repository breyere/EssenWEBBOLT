import React from 'react';
import { Users, Calendar, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, isDarkMode }) => {
  const navItems = [
    { id: 'profiles', label: 'Profiles', icon: Users },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'generator', label: 'AI Generator', icon: Sparkles },
  ];

  return (
    <nav className={`liquid-glass mx-4 mb-4 p-2 rounded-2xl border ${
      isDarkMode 
        ? 'bg-black/20 border-white/10' 
        : 'bg-white/20 border-white/30'
    }`}>
      <div className="flex justify-center space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-button flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? isDarkMode
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'bg-white/40 text-slate-800 shadow-lg'
                  : isDarkMode
                    ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-white/20 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                isActive && item.id === 'generator' ? 'text-purple-400' : ''
              }`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;