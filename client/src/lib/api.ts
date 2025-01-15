import { UserProfile, Charity, Donation } from './types';

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const response = await fetch(`/api/profile/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
}

export async function fetchCharities(): Promise<Charity[]> {
  const response = await fetch('/api/charities');
  if (!response.ok) {
    throw new Error('Failed to fetch charities');
  }
  return response.json();
}

export async function createDonation(donation: Donation): Promise<void> {
  const response = await fetch('/api/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donation),
  });
  if (!response.ok) {
    throw new Error('Failed to create donation');
  }
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
  const response = await fetch(`/api/profile/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
}
