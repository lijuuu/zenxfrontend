import axios from 'axios';
import { Challenge, User, UserProfile } from './types';
import { toast } from 'sonner';

// API endpoints
const API_URL = '/api';

// Get all challenges
export const getChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await axios.get(`${API_URL}/challenges`);
    return response.data.challenges || [];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

// Get a specific challenge by ID
export const getChallenge = async (challengeId: string): Promise<Challenge> => {
  try {
    const response = await axios.get(`${API_URL}/challenges/${challengeId}`);
    return response.data.challenge;
  } catch (error) {
    console.error(`Error fetching challenge ${challengeId}:`, error);
    throw error;
  }
};

// Create a new challenge
export const createChallenge = async (challengeData: Partial<Challenge>): Promise<Challenge> => {
  try {
    const response = await axios.post(`${API_URL}/challenges`, challengeData);
    toast.success('Challenge created successfully!');
    return response.data.challenge;
  } catch (error) {
    console.error('Error creating challenge:', error);
    toast.error('Failed to create challenge');
    throw error;
  }
};

// Update an existing challenge
export const updateChallenge = async (challengeId: string, challengeData: Partial<Challenge>): Promise<Challenge> => {
  try {
    const response = await axios.put(`${API_URL}/challenges/${challengeId}`, challengeData);
    toast.success('Challenge updated successfully!');
    return response.data.challenge;
  } catch (error) {
    console.error(`Error updating challenge ${challengeId}:`, error);
    toast.error('Failed to update challenge');
    throw error;
  }
};

// Delete a challenge
export const deleteChallenge = async (challengeId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/challenges/${challengeId}`);
    toast.success('Challenge deleted successfully!');
  } catch (error) {
    console.error(`Error deleting challenge ${challengeId}:`, error);
    toast.error('Failed to delete challenge');
    throw error;
  }
};

// Join a challenge
export const joinChallenge = async (challengeId: string, accessCode?: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/challenges/${challengeId}/join`, { accessCode });
    toast.success('Joined challenge successfully!');
  } catch (error) {
    console.error(`Error joining challenge ${challengeId}:`, error);
    toast.error('Failed to join challenge');
    throw error;
  }
};

// Leave a challenge
export const leaveChallenge = async (challengeId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/challenges/${challengeId}/leave`);
    toast.success('Left challenge successfully!');
  } catch (error) {
    console.error(`Error leaving challenge ${challengeId}:`, error);
    toast.error('Failed to leave challenge');
    throw error;
  }
};

// Get challenges created by a user
export const getUserChallenges = async (userId: string): Promise<Challenge[]> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/challenges`);
    return response.data.challenges || [];
  } catch (error) {
    console.error(`Error fetching challenges for user ${userId}:`, error);
    throw error;
  }
};

// Get challenges a user is participating in
export const getUserParticipatingChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await axios.get(`${API_URL}/users/me/participating-challenges`);
    return response.data.challenges || [];
  } catch (error) {
    console.error('Error fetching participating challenges:', error);
    throw error;
  }
};

// Search for users
export const searchUsers = async (query: string): Promise<User[]> => {
  // Mock implementation that simulates search results
  return [
    {
      id: "user1",
      username: "johndoe",
      fullName: "John Doe",
      profileImage: "https://i.pravatar.cc/300?img=1",
    },
    {
      id: "user2",
      username: "janedoe",
      fullName: "Jane Doe",
      profileImage: "https://i.pravatar.cc/300?img=2",
    },
    {
      id: "user3",
      username: "bobsmith",
      fullName: "Bob Smith",
      profileImage: "https://i.pravatar.cc/300?img=3",
    },
    {
      id: "user4",
      username: "alicejones",
      fullName: "Alice Jones",
      profileImage: "https://i.pravatar.cc/300?img=4",
    },
    {
      id: "user5",
      username: "mikebrown",
      fullName: "Mike Brown",
      profileImage: "https://i.pravatar.cc/300?img=5",
    }
  ].filter(
    (user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase())
  );
};

// Invite a user to a challenge
export const inviteUserToChallenge = async (challengeId: string, userId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/challenges/${challengeId}/invite`, { userId });
    toast.success('Invitation sent successfully!');
  } catch (error) {
    console.error(`Error inviting user ${userId} to challenge ${challengeId}:`, error);
    toast.error('Failed to send invitation');
    throw error;
  }
};

// Get challenge invitations
export const getChallengeInvitations = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/users/me/challenge-invitations`);
    return response.data.invitations || [];
  } catch (error) {
    console.error('Error fetching challenge invitations:', error);
    throw error;
  }
};

// Accept a challenge invitation
export const acceptChallengeInvitation = async (invitationId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/challenge-invitations/${invitationId}/accept`);
    toast.success('Invitation accepted!');
  } catch (error) {
    console.error(`Error accepting invitation ${invitationId}:`, error);
    toast.error('Failed to accept invitation');
    throw error;
  }
};

// Decline a challenge invitation
export const declineChallengeInvitation = async (invitationId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/challenge-invitations/${invitationId}/decline`);
    toast.success('Invitation declined');
  } catch (error) {
    console.error(`Error declining invitation ${invitationId}:`, error);
    toast.error('Failed to decline invitation');
    throw error;
  }
};

// Get challenge leaderboard
export const getChallengeLeaderboard = async (challengeId: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/challenges/${challengeId}/leaderboard`);
    return response.data.leaderboard || [];
  } catch (error) {
    console.error(`Error fetching leaderboard for challenge ${challengeId}:`, error);
    throw error;
  }
};

// Submit a solution to a challenge problem
export const submitChallengeSolution = async (
  challengeId: string,
  problemId: string,
  code: string,
  language: string
): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/challenges/${challengeId}/problems/${problemId}/submit`, {
      code,
      language,
    });
    return response.data.result;
  } catch (error) {
    console.error(`Error submitting solution for problem ${problemId} in challenge ${challengeId}:`, error);
    throw error;
  }
};

// Get user's progress in a challenge
export const getUserChallengeProgress = async (challengeId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/challenges/${challengeId}/progress`);
    return response.data.progress;
  } catch (error) {
    console.error(`Error fetching progress for challenge ${challengeId}:`, error);
    throw error;
  }
};

// Get trending challenges
export const getTrendingChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await axios.get(`${API_URL}/challenges/trending`);
    return response.data.challenges || [];
  } catch (error) {
    console.error('Error fetching trending challenges:', error);
    throw error;
  }
};

// Get recommended challenges for the current user
export const getRecommendedChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await axios.get(`${API_URL}/challenges/recommended`);
    return response.data.challenges || [];
  } catch (error) {
    console.error('Error fetching recommended challenges:', error);
    throw error;
  }
};
