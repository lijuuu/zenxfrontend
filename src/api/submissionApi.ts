import axiosInstance from "@/utils/axiosInstance";
import { Submission } from "@/api/types";

export const getUserSubmissions = async (
  userId: string,
  problemId?: string,
  page: number = 1,
  limit: number = 10
): Promise<Submission[]> => {
  try {
    const response = await axiosInstance.get(
      "/problems/submission/history",
      {
        params: {
          userId: userId,
          problemId: problemId || "", 
          page,
          limit,
        },
        headers: {
          "X-Requires-Auth": "false", 
        },
      }
    );

    //extract submissions from the response payload
    const submissions = response.data.payload.submissions as Submission[];
    return submissions;
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    throw new Error("Failed to fetch user submissions");
  }
};