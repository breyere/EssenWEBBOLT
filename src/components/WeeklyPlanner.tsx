import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Sparkles, Calendar } from 'lucide-react';
import { MealPlan } from '../types';

interface WeeklyPlannerProps {
  mealPlan: MealPlan[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan[]>>;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ mealPlan, setMealPlan }) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleVote = (day: string, voteType: 'up' | 'down') => {
    setMealPlan(prev => prev.map(plan => 
      plan.day === day 
        ? { 
            ...plan, 
            votes: { 
              ...plan.votes, 
              [voteType]: plan.votes[voteType] + 1 
            }
          }
        : plan
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Weekly Meal Plan</h2>
        <p className="text-slate-300">Plan and vote on family meals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mealPlan.map((plan, index) => (
          <div
            key={plan.day}
            className={`meal-card liquid-glass p-6 rounded-3xl border transition-all duration-500 cursor-pointer ${
              plan.day === currentDay
                ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400/50 shadow-lg shadow-blue-500/20'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
            onClick={() => setSelectedDay(selectedDay === plan.day ? '' : plan.day)}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`glass-orb px-3 py-1 rounded-full text-sm font-medium ${
                plan.day === currentDay
                  ? 'bg-white/30 text-white'
                  : 'bg-white/20 text-slate-300'
              }`}>
                {plan.day}
              </div>
              
              {plan.day === currentDay && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Today</span>
                </div>
              )}
            </div>

            {/* Meal */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">{plan.meal}</h3>
            </div>

            {/* Voting Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(plan.day, 'up');
                  }}
                  className="vote-button flex items-center space-x-1 px-3 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 transition-all duration-300"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{plan.votes.up}</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(plan.day, 'down');
                  }}
                  className="vote-button flex items-center space-x-1 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 transition-all duration-300"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm font-medium">{plan.votes.down}</span>
                </button>
              </div>

              {/* Comments */}
              {plan.comments > 0 && (
                <div className="comment-orb relative">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{plan.comments}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/40 pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            {selectedDay === plan.day && (
              <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Add a comment...</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 glass-button py-2 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm border border-blue-500/30">
                    Suggest Changes
                  </button>
                  <button className="flex-1 glass-button py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm border border-green-500/30">
                    Mark as Cooked
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="liquid-glass p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {mealPlan.reduce((acc, plan) => acc + plan.votes.up, 0)}
          </div>
          <div className="text-sm text-slate-300">Total Likes</div>
        </div>
        
        <div className="liquid-glass p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">
            {mealPlan.reduce((acc, plan) => acc + plan.votes.down, 0)}
          </div>
          <div className="text-sm text-slate-300">Dislikes</div>
        </div>
        
        <div className="liquid-glass p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {mealPlan.reduce((acc, plan) => acc + plan.comments, 0)}
          </div>
          <div className="text-sm text-slate-300">Comments</div>
        </div>
        
        <div className="liquid-glass p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">7</div>
          <div className="text-sm text-slate-300">Meals Planned</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;