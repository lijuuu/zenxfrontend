import axiosInstance from "@/utils/axiosInstance"
import qs from "qs"

export interface BulkProblemMetadata {
  problemId: string
  title: string
  difficulty: string
  tags: string[]
}

interface ProblemMetadataExt {
  problemId: string
  title: string
  description: string
  tags: string[]
  testcaseRun: { run: any[] }
  difficulty: string
  supportedLanguages: string[]
  validated: boolean
  placeholderMaps: Record<string, any>
}

export const getProblemMetadataExtended = async (
  problemId: string
): Promise<ProblemMetadataExt> => {
  try {
    const response = await axiosInstance.get("/problems/metadata", {
      params: { problemId },
      headers: { "X-Requires-Auth": "false" },
    })

    const problemData = response?.data?.payload || {}

    return {
      problemId: problemData.problemId || '',
      title: problemData.title || 'Untitled',
      description: problemData.description || '',
      tags: problemData.tags || [],
      testcaseRun: problemData.testcaseRun || { run: [] },
      difficulty: mapDifficulty(problemData.difficulty || ''),
      supportedLanguages: problemData.supportedLanguages || [],
      validated: problemData.validated || false,
      placeholderMaps: problemData.placeholderMaps || {},
    }
  } catch (error) {
    console.error("Error fetching problem metadata:", error)
    throw new Error("Failed to fetch problem metadata")
  }
}

const mapDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case 'E': return 'Easy';
    case 'M': return 'Medium';
    case 'H': return 'Hard';
    case 'easy': return 'Easy';
    case 'medium': return 'Medium';
    case 'hard': return 'Hard';
    default: return difficulty;
  }
};


export const getBulkProblemMetadata = async (
  problemIds: string[]
): Promise<BulkProblemMetadata[]> => {
  try {
    if (!problemIds.length) return []

    const response = await axiosInstance.get("/problems/bulk/metadata", {
      params: { problemIds },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      headers: {
        "X-Requires-Auth": "false",
      },
    })

    return response?.data?.payload?.bulkProblemMetadata || []
  } catch (error) {
    console.error("Error fetching bulk problem metadata:", error)
    throw new Error("Failed to fetch bulk problem metadata")
  }
}
