
import { Challenge } from './types';

// Generate random challenge IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate random access codes
const generateAccessCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Generate random timestamps within the last 30 days
const generateTimestamp = () => {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  return Math.floor(thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo));
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
      creator_id: generateId(),
      difficulty: generateDifficulty(),
      access_code: isPrivate ? generateAccessCode() : undefined,
      problem_ids: generateProblemIds(),
      time_limit: 3600, // 1 hour in seconds
      created_at: generateTimestamp(),
      participant_ids: Array.from({ length: generateParticipants() }, () => generateId()),
      status: 'active',
      isPrivate,
      participants: generateParticipants(),
      participantUsers: Array.from({ length: Math.min(4, generateParticipants()) }, () => ({
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        name: `User ${generateId().substring(0, 4)}`
      }))
    };
  });
};
