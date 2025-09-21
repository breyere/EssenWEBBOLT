import React, { useState } from 'react';
import { ChefHat, User, Heart, Star } from 'lucide-react';
import { FamilyMember } from '../types';

interface ProfileManagerProps {
  members: FamilyMember[];
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ members }) => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Family Profiles</h2>
        <p className="text-slate-300">Manage your family members and preferences</p>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="profile-pebble relative group cursor-pointer"
          >
            {/* 3D Glass Pebble */}
            <div className="glass-pebble w-24 h-24 mx-auto mb-4 relative">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/20">
                <div className="w-full h-full rounded-full flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                
                {/* Chef Badge for Helen */}
                {member.role === 'cook' && (
                  <div className="chef-badge absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border border-amber-300/50">
                    <ChefHat className="w-4 h-4 text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/30"></div>
                  </div>
                )}
              </div>
              
              {/* Floating highlight */}
              <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-gradient-to-br from-white/60 to-transparent blur-sm"></div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-white mb-1">{member.name}</h3>
              <div className="flex justify-center space-x-1">
                {member.preferences.slice(0, 2).map((pref, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-white/20 text-slate-300 backdrop-blur-sm"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Member Detail */}
      {selectedMember && (
        <div className="liquid-glass p-8 rounded-3xl border bg-white/10 border-white/20 backdrop-blur-xl">
          <div className="flex items-center space-x-6 mb-6">
            <div className="glass-pebble w-20 h-20 relative">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/20">
                <div className="w-full h-full rounded-full flex items-center justify-center text-3xl">
                  {selectedMember.avatar}
                </div>
              </div>
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-gradient-to-br from-white/60 to-transparent blur-sm"></div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                {selectedMember.name}
                {selectedMember.role === 'cook' && (
                  <ChefHat className="w-6 h-6 text-amber-400" />
                )}
              </h3>
              <p className="text-slate-300 capitalize">{selectedMember.role}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Food Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {selectedMember.preferences.map((pref, idx) => (
                <span
                  key={idx}
                  className="preference-tag px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-white/20 backdrop-blur-sm"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSelectedMember(null)}
            className="mt-6 glass-button px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/20"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;