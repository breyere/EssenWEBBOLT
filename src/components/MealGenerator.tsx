import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, ChefHat, Utensils } from 'lucide-react';
import { FamilyMember, MealPlan } from '../types';

interface MealGeneratorProps {
  members: FamilyMember[];
  onGenerate: (meals: MealPlan[]) => void;
}

const MealGenerator: React.FC<MealGeneratorProps> = ({ members, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [cookingTime, setCookingTime] = useState('medium');

  const sampleMeals = [
    'Mediterranean Pasta with Herbs',
    'Asian Fusion Stir Fry',
    'Classic Italian Risotto',
    'Grilled Chicken with Vegetables',
    'Homemade Burger Night',
    'Fresh Salmon with Quinoa',
    'Vegetarian Curry Bowl',
    'Mexican Taco Tuesday',
    'French Ratatouille',
    'Japanese Teriyaki Bowl',
    'Greek Moussaka',
    'Thai Green Curry',
    'American BBQ Ribs',
    'Indian Butter Chicken'
  ];

  const generateMealPlan = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with physics-based animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const newMealPlan: MealPlan[] = days.map(day => ({
      day,
      meal: sampleMeals[Math.floor(Math.random() * sampleMeals.length)],
      votes: { up: 0, down: 0 },
      comments: 0
    }));
    
    onGenerate(newMealPlan);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="glass-orb w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/30">
            <Sparkles className="w-8 h-8 text-purple-300" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">AI Meal Generator</h2>
        <p className="text-slate-300">Let AI create personalized meal plans for your family</p>
      </div>

      {/* Family Preferences Overview */}
      <div className="liquid-glass p-6 rounded-3xl bg-white/10 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <ChefHat className="w-5 h-5 text-amber-400" />
          <span>Family Preferences</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {members.map(member => (
            <div key={member.id} className="text-center">
              <div className="glass-pebble w-16 h-16 mx-auto mb-2 relative">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20">
                  <div className="w-full h-full rounded-full flex items-center justify-center text-lg">
                    {member.avatar}
                  </div>
                </div>
                <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-gradient-to-br from-white/60 to-transparent blur-sm"></div>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">{member.name}</h4>
              <div className="space-y-1">
                {member.preferences.slice(0, 2).map((pref, idx) => (
                  <div key={idx} className="text-xs px-2 py-1 rounded-full bg-white/20 text-slate-300">
                    {pref}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generation Controls */}
      <div className="liquid-glass p-8 rounded-3xl bg-white/10 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Customization</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Additional Preferences
            </label>
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., more vegetarian options, spicy food, comfort food..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-sm focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dietary Restrictions
            </label>
            <input
              type="text"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder="e.g., gluten-free, dairy-free, nut allergies..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-sm focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cooking Time Preference
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['quick', 'medium', 'elaborate'].map(time => (
                <button
                  key={time}
                  onClick={() => setCookingTime(time)}
                  className={`glass-button py-3 px-4 rounded-xl border transition-all duration-300 capitalize ${
                    cookingTime === time
                      ? 'bg-blue-500/30 border-blue-400/50 text-blue-300'
                      : 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateMealPlan}
          disabled={isGenerating}
          className={`generate-button relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 ${
            isGenerating
              ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isGenerating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                <span>Generate Meal Plan</span>
              </>
            )}
          </div>
          
          {/* Liquid ripple effect */}
          <div className={`absolute inset-0 ${isGenerating ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
          </div>
        </button>
      </div>

      {/* Generation Animation Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="liquid-glass p-8 rounded-3xl bg-white/10 border border-white/20 text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin">
                <div className="absolute inset-2 rounded-full bg-black/80 backdrop-blur-sm"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Utensils className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Creating Your Perfect Meal Plan</h3>
            <p className="text-slate-300">AI is analyzing family preferences...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealGenerator;