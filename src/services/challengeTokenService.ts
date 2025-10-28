import Cookies from 'js-cookie';

const CHALLENGE_TOKEN_KEY = 'challengeToken';
const CHALLENGE_ID_KEY = 'challengeId';

export const challengeTokenService = {
  //store challenge token and challenge id in cookies
  setChallengeToken: (challengeToken: string, challengeId: string) => {
    Cookies.set(CHALLENGE_TOKEN_KEY, challengeToken, {
      expires: 1, //expires in 1 day
      secure: true,
      sameSite: 'strict'
    });
    Cookies.set(CHALLENGE_ID_KEY, challengeId, {
      expires: 1, //expires in 1 day
      secure: true,
      sameSite: 'strict'
    });
  },

  //get challenge token from cookies
  getChallengeToken: (): string | null => {
    return Cookies.get(CHALLENGE_TOKEN_KEY) || null;
  },

  //get challenge id from cookies
  getChallengeId: (): string | null => {
    return Cookies.get(CHALLENGE_ID_KEY) || null;
  },

  //clear challenge token and challenge id from cookies
  clearChallengeToken: () => {
    Cookies.remove(CHALLENGE_TOKEN_KEY);
    Cookies.remove(CHALLENGE_ID_KEY);
  },

  //check if challenge token exists
  hasChallengeToken: (): boolean => {
    return !!Cookies.get(CHALLENGE_TOKEN_KEY);
  },

  //get both challenge token and challenge id
  getChallengeData: (): { challengeToken: string | null; challengeId: string | null } => {
    return {
      challengeToken: Cookies.get(CHALLENGE_TOKEN_KEY) || null,
      challengeId: Cookies.get(CHALLENGE_ID_KEY) || null
    };
  }
};
