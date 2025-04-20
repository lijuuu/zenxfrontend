
import { Challenge } from './types';

// Generate random challenge IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate random access codes
const generateAccessCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Generate random timestamps within the last 30 days
const generateTimestamp = () => {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  return Math.floor((thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo)) / 1000); // Convert to seconds
};

// Generate random number of participants (1-20)
const generateParticipants = () => Math.floor(Math.random() * 20) + 1;

// Generate random difficulty
const generateDifficulty = (): string => {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
};

// Generate an array of problem IDs
const generateProblemIds = () => {
  const count = Math.floor(Math.random() * 5) + 1; // 1-5 problems
  return Array.from({ length: count }, () => generateId());
};

export const generateMockChallenges = (count: number): Challenge[] => {
  return Array.from({ length: count }, (_, index) => {
    const isPrivate = Math.random() > 0.5;
    return {
      id: generateId(),
      title: `Challenge ${index + 1}`,
      creatorId: generateId(),
      difficulty: generateDifficulty(),
      accessCode: isPrivate ? generateAccessCode() : undefined,
      problemIds: generateProblemIds(),
      timeLimit: 3600, // 1 hour in seconds
      createdAt: generateTimestamp(),
      participantIds: Array.from({ length: generateParticipants() }, () => generateId()),
      status: 'active',
      isPrivate,
      isActive: true,
      participantUsers: Array.from({ length: Math.min(4, generateParticipants()) }, () => ({
        userID: generateId(),
        userName: `User ${generateId().substring(0, 4)}`,
        avatarURL: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      }))
    };
  });
};
