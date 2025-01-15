import { z } from 'zod';

export interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  impact: {
    description: string;
    metrics: {
      amount: number;
      impact: string;
    }[];
  };
  totalRaised: number;
  goal: number;
  tags: string[];
  causes: string[];
}

export interface Donation {
  id: string;
  charityId: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'impact' | 'consistency' | 'diversity';
  unlockedAt?: string;
  progress?: number;
  requirement: number;
}

export interface UserProfile {
  id: string; 
  username: string; 
  donations: Donation[];
  totalDonated: number;
  impactMetrics: Record<string, number>;
  interests: string[];
  preferredCauses: string[];
  donationHistory: {
    charityId: string;
    interactionCount: number;
    lastInteraction: string;
  }[];
  badges: Badge[];
  unlockedBadges: string[];
}