import axiosInstance from "@/utils/axiosInstance";
import {
  ChallengeDocument,
  ChallengeConfig,
} from "./challengeTypes";

export const createChallenge = async (data: {
  title: string;
  processedProblemIds: string[];
  isPrivate?: boolean;
  timeLimit?: number;
  startTime?: number;
  config: ChallengeConfig;
  password?: string;
  inviteUserIds?: string[];
}) => {
  try {
    const response = await axiosInstance.post('/challenges', {
      title: data.title,
      processedProblemIds: data.processedProblemIds,
      isPrivate: data.isPrivate,
      timeLimit: data.timeLimit,
      startTime: data.startTime,
      config: data.config,
      password: data.password,
    }, {
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload as ChallengeDocument;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const getUserChallengeHistory = async (data: {
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
}) => {
  try {
    const response = await axiosInstance.get("/challenges/history", {
      params: {
        page: data.page,
        pageSize: data.pageSize,
        isPrivate: data.isPrivate,
      },
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user challenge history:', error);
    throw error;
  }
};


export const getActiveOpenChallenges = async (data: {
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
}) => {
  try {
    const response = await axiosInstance.get("/challenges/public/open", {
      params: {
        page: data.page,
        pageSize: data.pageSize,
      },
      headers: { 'X-Requires-Auth': 'false' }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user challenge history:', error);
    throw error;
  }
};

export const getOwnersActiveChallenges = async (data: {
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
}) => {
  try {
    const response = await axiosInstance.get("/challenges/owner/open", {
      params: {
        page: data.page,
        pageSize: data.pageSize,
      },
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user challenge history:', error);
    throw error;
  }
};


export const abandonChallenge = async ({ creatorId, challengeId }: { creatorId: string; challengeId: string }) => {
  try {
    const response = await axiosInstance.post('/challenges/abandon', {
      creatorId,
      challengeId,
    }, {
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error abandoning challenge:', error);
    throw error;
  }
};