export interface FamilyMember {
  id: number;
  name: string;
  role: 'cook' | 'member';
  avatar: string;
  preferences: string[];
}

export interface MealPlan {
  day: string;
  meal: string;
  votes: {
    up: number;
    down: number;
  };
  comments: number;
}

export interface Vote {
  memberId: number;
  type: 'up' | 'down';
}