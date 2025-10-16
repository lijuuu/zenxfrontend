//websocket event types constants
//must mirror backend constants

//server events (server to client)
export const PING_SERVER = "PING_SERVER";

//user events (server to client)
export const USER_JOINED = "USER_JOINED";
export const USER_LEFT = "USER_LEFT";
export const CREATOR_ABANDON = "CREATOR_ABANDON";
export const CHALLENGE_STARTED = "CHALLENGE_STARTED";
export const OWNER_LEFT = "OWNER_LEFT";
export const OWNER_JOINED = "OWNER_JOINED";
export const NEW_OWNER_ASSIGNED = "NEW_OWNER_ASSIGNED";

//client requests (client to server)
export const JOIN_CHALLENGE = "JOIN_CHALLENGE";
export const RETRIEVE_CHALLENGE = "RETRIEVE_CHALLENGE";
export const GET_ALL_CHALLENGES = "GET_ALL_CHALLENGES";
export const GET_CHALLENGE_DATA = "GET_CHALLENGE_DATA";
export const GET_CHALLENGE_MIN = "GET_CHALLENGE_MIN";
export const GET_PARTICIPANT_DATA = "GET_PARTICIPANT_DATA";
export const GET_PARTICIPANTS_DATA = "GET_PARTICIPANTS_DATA";
export const GET_NOTIFICATIONS = "GET_NOTIFICATIONS";
export const GET_CHAT = "GET_CHAT";
export const GET_LEADERBOARD = "GET_LEADERBOARD";

//push events (client to server)
export const PUSH_NEW_CHAT = "PUSH_NEW_CHAT";
export const PUSH_NEW_NOTIFICATION = "PUSH_NEW_NOTIFICATION";
export const PUSH_SUBMISSION = "PUSH_SUBMISSION";

//accept events (server to client)
export const ACCEPT_CHALLENGE_DATA = "ACCEPT_CHALLENGE_DATA";
export const ACCEPT_CHALLENGE_MIN = "ACCEPT_CHALLENGE_MIN";
export const ACCEPT_PARTICIPANT_DATA = "ACCEPT_PARTICIPANT_DATA";
export const ACCEPT_PARTICIPANTS_DATA = "ACCEPT_PARTICIPANTS_DATA";
export const ACCEPT_NOTIFICATIONS = "ACCEPT_NOTIFICATIONS";
export const ACCEPT_CHAT = "ACCEPT_CHAT";
export const ACCEPT_LEADERBOARD = "ACCEPT_LEADERBOARD";
export const ACCEPT_NEW_CHAT = "ACCEPT_NEW_CHAT";
export const ACCEPT_NEW_NOTIFICATION = "ACCEPT_NEW_NOTIFICATION";
export const ACCEPT_NEW_SUBMISSION = "ACCEPT_NEW_SUBMISSION";

//game events (server to client)
export const LEADERBOARD_UPDATE = "LEADERBOARD_UPDATE";
export const NEW_SUBMISSION = "NEW_SUBMISSION";
export const GAME_FINISHED = "GAME_FINISHED";
export const CHAT_MESSAGE = "CHAT_MESSAGE";

//legacy constants for backward compatibility
export const WHOLE_CHAT = "WHOLECHAT";
export const WHOLE_NOTIFICATION = "WHOLENOTIFICATION";
export const CURRENT_LEADERBOARD = "CURRENT_LEADERBOARD";
