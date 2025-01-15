import { Charity, UserProfile } from './types';
import { fetchUserProfile, fetchCharities, updateUserProfile } from './api';

// Keep the charities array for now as a fallback
export const charities: Charity[] = [
  {
    id: '1',
    name: 'Global Education Fund',
    description: 'Providing education access to underprivileged children worldwide',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
    impact: {
      description: 'Your donation helps provide education supplies and resources',
      metrics: [
        { amount: 10, impact: '1 month of school supplies' },
        { amount: 50, impact: '1 semester of textbooks' },
        { amount: 200, impact: '1 year of education for a child' }
      ]
    },
    totalRaised: 150000,
    goal: 500000,
    tags: ['education', 'children', 'global', 'literacy'],
    causes: ['education', 'youth development', 'poverty alleviation']
  },
  {
    id: '2',
    name: 'Clean Water Initiative',
    description: 'Bringing clean water to communities in need',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1637034318492-c5d36e4f6d99',
    impact: {
      description: 'Help provide clean water access to communities',
      metrics: [
        { amount: 20, impact: 'Clean water for 1 person for a month' },
        { amount: 100, impact: 'Water filter for a family' },
        { amount: 1000, impact: 'Community well construction' }
      ]
    },
    totalRaised: 75000,
    goal: 200000,
    tags: ['water', 'health', 'sanitation', 'community'],
    causes: ['health', 'infrastructure', 'sustainable development']
  },
  {
    id: '3',
    name: 'Tech Empowerment',
    description: 'Empowering underrepresented groups in technology',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    impact: {
      description: 'Support technology education and career development',
      metrics: [
        { amount: 25, impact: '1 coding workshop session' },
        { amount: 150, impact: 'Laptop for a student' },
        { amount: 500, impact: 'Complete coding bootcamp' }
      ]
    },
    totalRaised: 250000,
    goal: 750000,
    tags: ['technology', 'education', 'diversity', 'career'],
    causes: ['education', 'technology', 'social justice']
  }
];

export const getUserProfile = async () => {
  try {
    // For now, use a hardcoded user ID - in a real app, this would come from auth
    const userId = 'default-user';
    return await fetchUserProfile(userId);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      id: 'default-user',
      username: 'Default User',
      donations: [],
      totalDonated: 0,
      impactMetrics: {},
      interests: ['education', 'technology', 'health'],
      preferredCauses: ['education', 'social justice'],
      donationHistory: [],
      badges: [],
      unlockedBadges: []
    };
  }
};

export const getRecommendedCharities = async (userProfile: UserProfile) => {
  try {
    const allCharities = await fetchCharities();
    return allCharities
      .map(charity => ({
        ...charity,
        matchScore: calculateSimilarityScore(charity, userProfile)
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error fetching recommended charities:', error);
    // Fallback to local charities array
    return charities
      .map(charity => ({
        ...charity,
        matchScore: calculateSimilarityScore(charity, userProfile)
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }
};

export const saveUserProfile = async (profile: UserProfile) => {
  try {
    await updateUserProfile(profile.id, profile);
  } catch (error) {
    console.error('Error saving user profile:', error);
    // Fallback to localStorage for offline capability
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }
};

// Charity matching algorithm
const calculateSimilarityScore = (charity: Charity, userProfile: UserProfile): number => {
  let score = 0;

  // Match based on preferred causes
  const causesOverlap = charity.causes.filter(cause =>
    userProfile.preferredCauses.includes(cause)
  ).length;
  score += causesOverlap * 2;

  // Match based on tags and interests
  const tagsOverlap = charity.tags.filter(tag =>
    userProfile.interests.includes(tag)
  ).length;
  score += tagsOverlap;

  // Consider donation history if available
  const donationHistory = userProfile.donationHistory?.find(h => h.charityId === charity.id);
  if (donationHistory) {
    score += Math.min(donationHistory.interactionCount || 0, 5);
  }

  return score;
};