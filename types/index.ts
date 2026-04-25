export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UserLocation {
  country: string;
  state?: string;
  county?: string;
}

export interface ConversationState {
  location: UserLocation | null;
  phase: 'greeting' | 'collecting_location' | 'active' | 'completed';
  currentPath?: string;
  messages: Message[];
}

export interface ElectionDeadlines {
  registrationDeadline: string;
  mailBallotRequestDeadline: string;
  earlyVotingStart: string;
  earlyVotingEnd: string;
  electionDay: string;
}

export interface StateElectionData {
  state: string;
  electionDate: string;
  registrationDeadline: string;
  mailBallotRequestDeadline: string;
  earlyVotingStart: string;
  earlyVotingEnd: string;
  registrationUrl: string;
  pollingPlaceUrl: string;
}

export interface MythBustingEntry {
  claim: string;
  reality: string;
  source: string;
}