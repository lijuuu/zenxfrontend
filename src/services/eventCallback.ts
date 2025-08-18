import { toast } from "sonner";
import { PING_SERVER, JOIN_CHALLENGE, RETRIEVE_CHALLENGE } from "@/lib/ws";

interface WSResponse {
  type: string;
  status?: string;
  payload?: any;
  error?: string;
}

export const eventCallbacks: Record<string, (response: WSResponse, context: any) => void> = {
  [PING_SERVER]: (_, { setLatency, pingSentAtRef }) => {
    setLatency(Date.now() - pingSentAtRef.current);
  },
  [JOIN_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents, setParticipantIds, setProblemIds }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: JOIN_CHALLENGE, payload: response }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.status === "error" && response.error) {
      setError(response.error);
      toast.error(`Failed to join challenge: ${response.error}`);
    } else if (response?.payload?.challenge) {
      setChallenge(response?.payload.challenge);
      const participantIds = Object.keys(response?.payload?.challenge?.participants || []);
      setParticipantIds(participantIds);
      const problemIds = response?.payload?.challenge?.processedProblemIds || [];
      setProblemIds(problemIds)
      toast.success("Successfully joined challenge!");
    }
  },
  [RETRIEVE_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents, setParticipantIds,setProblemIds }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: RETRIEVE_CHALLENGE, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.status === "error" && response.error) {
      setError(response.error);
      toast.error(`Failed to refetch challenge: ${response.error}`);
    } else if (response?.payload?.challenge) {
      const participantIds = Object.keys(response?.payload?.challenge?.participants || []);
      setParticipantIds(participantIds);
      const problemIds = response?.payload?.challenge?.processedProblemIds || [];
      setProblemIds(problemIds)
      setChallenge(response?.payload.challenge);
    }
  },
};