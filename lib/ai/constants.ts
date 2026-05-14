import { StateElectionData, MythBustingEntry } from '@/types';

export const SYSTEM_PROMPT = `You are Civix, a global election process guide. Your job is to help users understand and navigate the election process — registration, timelines, voting methods, ballot information, and post-election steps. You have deep knowledge of elections in the United States, Canada, and specifically India (Election Commission of India).

CORE RULES:
1. ALWAYS identify the user's jurisdiction (country, state/province, county if US) before giving any specific deadlines, rules, or instructions. If you don't know it, ask.
2. NEVER tell a user they cannot do something without checking current rules.
3. NEVER express any opinion on candidates, parties, or ballot measures. Stay strictly procedural.
4. ALWAYS orient around time. Tell the user what they can still do vs. what has passed.
5. Myth-busting: If a user asks about a claim, give a jurisdiction-specific answer with a source reference.
6. Structure every response with: [Situation Summary] → [What you can do right now] → [Next step or deadline].
7. If a user seems confused, offer the simplified 3-step path: 'Register → Learn your ballot → Vote.'
8. Use official sources (e.g., vote.gov for US, elections.ca for Canada, eci.gov.in or ceowestbengal.nic.in for India).
9. Keep responses under 150 words unless the user explicitly asks for more detail.
10. Never use jargon without immediately explaining it.
11. PROACTIVE MAPPING: If you identify a specific address, polling station, or landmark (from an image or text), you MUST include the tag [MAP: actual address or landmark here] at the end of your response.
12. JOURNEY GUIDANCE: You are an active navigator. If the user has just registered or identified their location, nudge them toward 'Preparing' (deadlines/ballot). If they have prepared, nudge them toward 'Voting' (polling places/booth status).
13. PRIVACY-FIRST MAPPING: If a user provides a 'Part Number' or 'Assembly Constituency' (common in India), use these to identify the polling booth location and trigger the [MAP: address] tag. Remind users they can find their Part Number using the 'Voter ID Guide' in the sidebar or on the back of their card.`;

export const GREETING_MESSAGE = "Hi, I'm Civix — I help you understand and navigate elections. Where are you voting? (Country + state/province is enough to start.)";

export const LOCATION_REQUEST_MESSAGE = "Good question. To give you accurate info, I need to know where you're voting — which country and state/province?";

export const US_STATES_ELECTION_DATA: StateElectionData[] = [
  {
    state: 'Texas',
    electionDate: '2026-11-03',
    registrationDeadline: '2026-10-04',
    mailBallotRequestDeadline: '2026-10-24',
    earlyVotingStart: '2026-10-20',
    earlyVotingEnd: '2026-10-31',
    registrationUrl: 'https://www.votetexas.gov/register',
    pollingPlaceUrl: 'https://www.votetexas.gov/polling-place'
  },
  {
    state: 'California',
    electionDate: '2026-11-03',
    registrationDeadline: '2026-10-19',
    mailBallotRequestDeadline: '2026-10-28',
    earlyVotingStart: '2026-10-11',
    earlyVotingEnd: '2026-11-02',
    registrationUrl: 'https://registertovote.gov/ca',
    pollingPlaceUrl: 'https://www.sos.ca.gov/elections/polling-place'
  },
  {
    state: 'New York',
    electionDate: '2026-11-03',
    registrationDeadline: '2026-10-09',
    mailBallotRequestDeadline: '2026-10-28',
    earlyVotingStart: '2026-10-25',
    earlyVotingEnd: '2026-11-02',
    registrationUrl: 'https://dmv.ny.gov/motor-voter',
    pollingPlaceUrl: 'https://vote.ny.gov'
  },
  {
    state: 'Florida',
    electionDate: '2026-11-03',
    registrationDeadline: '2026-10-06',
    mailBallotRequestDeadline: '2026-10-24',
    earlyVotingStart: '2026-10-27',
    earlyVotingEnd: '2026-10-31',
    registrationUrl: 'https://registertovotefl.gov',
    pollingPlaceUrl: 'https://dos.myflorida.com/elections'
  },
  {
    state: 'Georgia',
    electionDate: '2026-11-03',
    registrationDeadline: '2026-10-05',
    mailBallotRequestDeadline: '2026-10-24',
    earlyVotingStart: '2026-10-13',
    earlyVotingEnd: '2026-10-31',
    registrationUrl: 'https://www.mvp.sos.ga.gov',
    pollingPlaceUrl: 'https://www.mvp.sos.ga.gov'
  },
  // India Regions
  {
    state: 'West Bengal',
    electionDate: '2026-05-10',
    registrationDeadline: '2026-04-15',
    mailBallotRequestDeadline: '2026-05-01',
    earlyVotingStart: '2026-05-05',
    earlyVotingEnd: '2026-05-08',
    registrationUrl: 'https://voters.eci.gov.in/',
    pollingPlaceUrl: 'https://ceowestbengal.nic.in/'
  },
  {
    state: 'Maharashtra',
    electionDate: '2026-05-15',
    registrationDeadline: '2026-04-20',
    mailBallotRequestDeadline: '2026-05-05',
    earlyVotingStart: '2026-05-10',
    earlyVotingEnd: '2026-05-13',
    registrationUrl: 'https://voters.eci.gov.in/',
    pollingPlaceUrl: 'https://ceo.maharashtra.gov.in/'
  }
];

export const MYTH_BUSTING_KB: MythBustingEntry[] = [
  {
    claim: "Felons can't vote",
    reality: "Varies by state. Some states restore voting rights immediately after release, others after parole/probation, a few have permanent restrictions. Maine and Vermont allow voting from prison.",
    source: "https://www.ncsl.org/elections-and-campaigns/felon-voting-rights"
  },
  {
    claim: "You need a government-issued photo ID to vote everywhere",
    reality: "ID requirements vary by state. 18 states have no ID requirement. Some accept non-photo ID. Always check your state's specific rules.",
    source: "https://www.ncsl.org/elections-and-campaigns/voter-id"
  },
  {
    claim: "If you're homeless you can't register",
    reality: "You can register using a shelter address, a street corner description, or a park — rules vary by state but homelessness does not disqualify you.",
    source: "https://vote.gov"
  },
  {
    claim: "Non-citizens can vote in federal elections",
    reality: "Federal law prohibits non-citizens from voting in federal elections. A small number of localities allow non-citizen voting in local races only.",
    source: "https://www.usa.gov/who-can-vote"
  },
  {
    claim: "Voting twice to 'test the system' is legal",
    reality: "Voting more than once in the same election is a federal felony punishable by up to 2 years in prison and a fine.",
    source: "52 U.S.C. § 10307"
  },
  {
    claim: "Mail-in ballots are more likely to not be counted",
    reality: "Rejection rates for mail ballots are low (under 1% in most states) but they can be rejected for missing signatures or late arrival. Following instructions carefully and tracking your ballot reduces this risk.",
    source: "https://www.brennancenter.org"
  }
];

export const SUGGESTED_ENTRY_FLOWS = [
  {
    label: "Start from scratch",
    icon: "🗳️",
    prompt: "I've never voted before. Where do I start?"
  },
  {
    label: "Check my deadlines",
    icon: "📅",
    prompt: "What election deadlines should I know about?"
  },
  {
    label: "Understand my ballot",
    icon: "📄",
    prompt: "What will be on my ballot and what does it all mean?"
  },
  {
    label: "Something I heard isn't true",
    icon: "🔍",
    prompt: "I heard something about voting rules — can you fact-check it?"
  },
  {
    label: "It's election day",
    icon: "🚨",
    prompt: "It's election day — what do I need to know right now?"
  }
];

export const ELECTION_PROTECTION_HOTLINE = "1-866-OUR-VOTE (1-866-687-8683)";

export const OFFICIAL_SOURCES = {
  us: {
    registration: "https://vote.gov",
    stateSpecific: "https://www.usa.gov/election-office",
    pollingPlace: "https://www.vote.gov/register/",
    ballotInfo: "https://ballotpedia.org"
  },
  canada: "https://www.elections.ca",
  uk: "https://www.electoralcommission.org.uk"
};