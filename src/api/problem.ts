import axiosInstance from "@/utils/axiosInstance"
import qs from "qs"

export interface BulkProblemMetadata {
  problemId: string
  title: string
  difficulty: string
  tags: string[]
}


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
