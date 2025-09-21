import React, { useState, useEffect } from 'react';
import { Lock, Users, Calendar, Sparkles, Settings, Moon, Sun } from 'lucide-react';
import ProfileManager from './components/ProfileManager';
import WeeklyPlanner from './components/WeeklyPlanner';
import MealGenerator from './components/MealGenerator';
import SecurityLock from './components/SecurityLock';
import Navigation from './components/Navigation';
import { FamilyMember, MealPlan } from './types';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('planner');
  const [gyroscope, setGyroscope] = useState({ x: 0, y: 0, z: 0 });

  const familyMembers: FamilyMember[] = [
    { id: 1, name: 'Helen', role: 'cook', avatar: '👩‍🍳', preferences: ['vegetarian', 'italian'] },
    { id: 2, name: 'Paul', role: 'member', avatar: '👨', preferences: ['meat', 'spicy'] },
    { id: 3, name: 'Hannes', role: 'member', avatar: '👦', preferences: ['pasta', 'pizza'] },
    { id: 4, name: 'Jonas', role: 'member', avatar: '🧑', preferences: ['fish', 'healthy'] },
    { id: 5, name: 'Mark', role: 'member', avatar: '👱‍♂️', preferences: ['bbq', 'burgers'] },
    { id: 6, name: 'Emil', role: 'member', avatar: '👶', preferences: ['simple', 'mild'] }
  ];

  const [mealPlan, setMealPlan] = useState<MealPlan[]>([
    { day: 'Monday', meal: 'Spaghetti Carbonara', votes: { up: 3, down: 1 }, comments: 2 },
    { day: 'Tuesday', meal: 'Grilled Salmon', votes: { up: 4, down: 0 }, comments: 1 },
    { day: 'Wednesday', meal: 'Chicken Tikka Masala', votes: { up: 2, down: 2 }, comments: 3 },
    { day: 'Thursday', meal: 'Vegetable Stir Fry', votes: { up: 5, down: 1 }, comments: 0 },
    { day: 'Friday', meal: 'Homemade Pizza', votes: { up: 6, down: 0 }, comments: 4 },
    { day: 'Saturday', meal: 'BBQ Ribs', votes: { up: 3, down: 1 }, comments: 2 },
    { day: 'Sunday', meal: 'Roast Chicken', votes: { up: 4, down: 0 }, comments: 1 }
  ]);

  // Gyroscope effect simulation
  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setGyroscope({
        x: event.gamma || 0,
        y: event.beta || 0,
        z: event.alpha || 0
      });
    };

    // Fallback mouse movement for desktop
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20;
      const y = (event.clientY / window.innerHeight - 0.5) * 20;
      setGyroscope({ x, y, z: 0 });
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const lightingStyle = {
    '--gyro-x': `${gyroscope.x}deg`,
    '--gyro-y': `${gyroscope.y}deg`,
    '--light-x': `${50 + gyroscope.x * 2}%`,
    '--light-y': `${50 + gyroscope.y * 2}%`,
  } as React.CSSProperties;

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profiles':
        return <ProfileManager members={familyMembers} />;
      case 'planner':
        return <WeeklyPlanner mealPlan={mealPlan} setMealPlan={setMealPlan} />;
      case 'generator':
        return <MealGenerator members={familyMembers} onGenerate={setMealPlan} />;
      default:
        return <WeeklyPlanner mealPlan={mealPlan} setMealPlan={setMealPlan} />;
    }
  };

  if (isLocked) {
    return <SecurityLock onUnlock={handleUnlock} isDarkMode={isDarkMode} />;
  }

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'
      }`}
      style={lightingStyle}
    >
      {/* Dynamic lighting overlay */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${
          isDarkMode ? 'opacity-30' : 'opacity-20'
        }`}
        style={{
          background: `radial-gradient(circle at var(--light-x, 50%) var(--light-y, 50%), 
            ${isDarkMode 
              ? 'rgba(147, 197, 253, 0.2) 0%, rgba(147, 197, 253, 0.1) 30%, transparent 60%'
              : 'rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 30%, transparent 60%'
            })`
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className={`liquid-glass p-6 m-4 rounded-3xl border ${
          isDarkMode 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white/20 border-white/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`glass-orb w-12 h-12 rounded-2xl flex items-center justify-center ${
                isDarkMode ? 'bg-white/10' : 'bg-white/30'
              }`}>
                <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Familien Essensplan
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Family Meal Planner
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`glass-button w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/30 hover:bg-white/40'
                }`}
              >
                {isDarkMode ? 
                  <Sun className="w-5 h-5 text-yellow-400" /> : 
                  <Moon className="w-5 h-5 text-slate-600" />
                }
              </button>
              
              <button 
                onClick={() => setIsLocked(true)}
                className={`glass-button w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/30 hover:bg-white/40'
                }`}
              >
                <Lock className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isDarkMode={isDarkMode} 
        />

        {/* Main Content */}
        <main className="p-4">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;