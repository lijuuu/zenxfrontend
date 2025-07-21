# WebSocket Challenge Implementation Reference

## WebSocket Event Constants

### Event Types (from `src/lib/ws.ts`)

```typescript
// Server Health
export const PING_SERVER = "PING_SERVER"

// User Presence Events
export const USER_JOINED = "USER_JOINED"
export const USER_LEFT = "USER_LEFT"
export const OWNER_LEFT = "OWNER_LEFT"
export const OWNER_JOINED = "OWNER_JOINED"

// Challenge Lifecycle Events
export const CHALLENGE_STARTED = "CHALLENGE_STARTED"
export const CREATOR_ABANDON = "CREATOR_ABANDON"

// Challenge Actions
export const JOIN_CHALLENGE = "JOIN_CHALLENGE"
export const RETRIEVE_CHALLENGE = "RETRIEVE_CHALLENGE"
```

## WebSocket Connection

### Connection Setup
- **URL**: `ws://localhost:7777/ws` (default)
- **Pattern**: Singleton WebSocket connection
- **Location**: `src/lib/ws.ts`

```typescript
let socket: WebSocket | null = null;

export const getWS = (url: string = "ws://localhost:7777/ws"): WebSocket => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url);
  }
  return socket;
};
```

## Message Formats

### Outgoing Message Structure
```typescript
{
  type: string,
  payload: any
}
```

### Incoming Message Structure
```typescript
{
  type: string,
  status?: string,
  payload?: any,
  error?: string
}
```

### Common Payloads

#### JOIN_CHALLENGE / REFETCH_CHALLENGE Payload
```typescript
{
  userId: string,
  challengeId: string,
  password: string,
  token: string  // Bearer token format
}
```

#### Event Response Payload Examples
```typescript
// Success Response
{
  type: "JOIN_CHALLENGE",
  status: "success",
  payload: {
    challenge: ChallengeDocument
  }
}

// Error Response
{
  type: "JOIN_CHALLENGE", 
  status: "error",
  error: "Invalid password"
}
```

## Core Implementation Files

### 1. WebSocket Manager (`src/lib/ws.ts`)
- Manages singleton WebSocket connection
- Defines all event type constants
- Handles connection creation and state checking

### 2. WebSocket Handler (`src/lib/wsHandler.ts`)
- Initializes WebSocket connection with event listeners
- Routes incoming messages to callbacks and event bus
- Manages callback registration for request-response patterns

### 3. Event Bus (`src/lib/eventBus.ts`)
- Pub/sub system for broadcasting events to multiple components
- Manages event listeners with automatic cleanup
- Type-safe event handling

### 4. React Hook (`src/hooks/useWSEvent.ts`)
- React hook for subscribing to WebSocket events
- Automatic cleanup on component unmount
- Stable handler references to prevent re-renders

## Usage Patterns

### Sending Events with Callbacks
```typescript
sendWSEvent(JOIN_CHALLENGE, payload, (response) => {
  // Handle direct response
});
```

### Subscribing to Broadcast Events
```typescript
useWSEvent(USER_JOINED, (payload) => {
  // Handle broadcast event
});
```

### Event Handler Registration
```typescript
const eventCallbacks: Record<string, (response: WSResponse, context: any) => void> = {
  [PING_SERVER]: (_, { setLatency, pingSentAtRef }) => {
    setLatency(Date.now() - pingSentAtRef.current);
  },
  [JOIN_CHALLENGE]: (response, { setChallenge, setError }) => {
    if (response.status === "error") {
      setError(response.error);
    } else {
      setChallenge(response.payload.challenge);
    }
  }
};
```

## Challenge Data Types

### Complete TypeScript Interfaces (from `src/api/challengeTypes.ts`)

```typescript
export type Submission = {
  submissionId: string;
  timeTaken: number; // milliseconds
  points: number;
  userCode: string;
};

export type ChallengeProblemMetadata = {
  problemId: string;
  score: number;
  timeTaken: number; // milliseconds
  completedAt: number; // unix timestamp
};

export type ParticipantMetadata = {
  problemsDone: Record<string, ChallengeProblemMetadata>;
  problemsAttempted: number;
  totalScore: number;
  joinTime: number; // unix timestamp
  lastConnected: number; // unix timestamp
};

export type LeaderboardEntry = {
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  rank: number;
};

export type ChallengeConfig = {
  maxUsers: number;
  maxEasyQuestions: number;
  maxMediumQuestions: number;
  maxHardQuestions: number;
};

export type ChallengeDocument = {
  challengeId: string;
  creatorId: string;
  title: string;
  isPrivate: boolean;
  password: string;
  status: "pending" | "active" | "completed"; // match Go `ChallengeStatus` enum
  timeLimit: number; // milliseconds
  startTime: number; // unix timestamp
  participants: Record<string, ParticipantMetadata>;
  submissions: Record<string, Record<string, Submission>>;
  leaderboard: LeaderboardEntry[];
  config: ChallengeConfig;
  processedProblemIds: string[];
};

export type Session = {
  userId: string;
  challengeId: string;
  lastActive: number; // unix timestamp
  sessionHash: string;
};
```

## Current Implementation Location

The main WebSocket usage is implemented in:
- **Primary Usage**: `src/pages/JoinChallenge.tsx` - Complete challenge joining flow with real-time updates
- **Core Libraries**: `src/lib/ws.ts`, `src/lib/wsHandler.ts`, `src/lib/eventBus.ts`
- **React Integration**: `src/hooks/useWSEvent.ts`
- **Type Definitions**: `src/api/challengeTypes.ts`