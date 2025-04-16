
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-600';
    case 'medium':
      return 'bg-amber-600';
    case 'hard':
      return 'bg-red-600';
    default:
      return 'bg-zinc-600';
  }
};
