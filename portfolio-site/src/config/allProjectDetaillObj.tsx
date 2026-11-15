import stra from "../assets/excalidraw strategy.png";
import movix from "../assets/excalidraw movix.png";
import wavvy from "../assets/wavvy.png";
export const ProjectDetail = [
  {
    id: "strategy-game",
    title: "Strategy Game",
    subtitle:
      "Turn-based strategy game built with custom state management and AI systems.",
    systems: [
      {
        title: "State Engine",
        detail:
          "Custom Redux-like dispatcher with pure reducers handling movement, combat, and turns.",
      },
      {
        title: "Fog of War",
        detail:
          "Manhattan distance-based vision system tied to unit positions per render cycle.",
      },
      {
        title: "AI System",
        detail:
          "Greedy pathfinding AI with obstacle handling and delayed action execution for visual clarity.",
      },
      {
        title: "Terrain Logic",
        detail:
          "Grid-based terrain modifiers affecting movement cost and combat stats.",
      },
    ],
    challenges: [
      "Preventing player input during AI execution using a blocking state flag.",
      "Visualizing AI decisions using staggered execution delays.",
      "Designing fog-of-war visibility logic based on distance calculations per unit.",
    ],
    stateStructure: `state = { grid, units, turn, unitLocations, ui }`,
    architectureImg: stra,
  },
  {
    id: "wavvy",
    title: "Wavvy",
    featured: true,
    subtitle:
      "Real-time group chat platform with end-to-end socket integration and presence tracking.",
    systems: [
      {
        title: "Socket Management",
        detail:
          "Centralized socket lifecycle within a Zustand store — implementing a singleton connection pattern that prevents multiple socket instantiations via connection state tracking.",
      },
      {
        title: "Presence Engine",
        detail:
          "Real-time online status tracking using server-side maps keyed by userId, broadcasted via Socket.io to all clients on join/disconnect events.",
      },
      {
        title: "Message Persistence",
        detail:
          "Optimistic UI updates for instant messaging, synchronized with a PostgreSQL backend through a RESTful API and real-time socket events for multi-client state consistency.",
      },
      {
        title: "Group Room Logic",
        detail:
          "Dynamic room management using socket.join/leave rooms patterned by groupId, enabling targeted message broadcasting to active group participants only.",
      },
    ],
    challenges: [
      "Architecting around serverless lifecycle limitations by implementing an automatic reconnection strategy and state re-hydration on socket re-establishment.",
      "Ensuring UI consistency between the primary database (PostgreSQL) and temporary socket-based state using optimistic updates and rollback handling.",
      "Managing socket connection overhead by implementing singleton patterns to prevent 'ghost' connections during React component re-renders.",
    ],
    stateStructure: `chatState = { socket, onlineUsers: [{ userId, username }], messages: [Message], users: [User], isLoading }`,
    architectureImg: wavvy,
  },
  {
    id: "movix",
    title: "Movix",
    subtitle:
      "Full-stack movie streaming platform with auth, reviews and watch history.",
    systems: [
      {
        title: "Review State Engine",
        detail:
          "Normalized useReducer with byIds/allIds structure — all CRUD operations flow through a custom useReview hook with useCallback and useMemo to prevent re-renders.",
      },
      {
        title: "Authentication",
        detail:
          "JWT auth with role-based authorization plus Google OAuth — tokens passed via URL params on OAuth callback, consumed and cleaned on mount.",
      },
      {
        title: "REST API Architecture",
        detail:
          "Layered Express backend — routes → controllers → services → models — with input validation middleware, rate limiting, and Winston structured logging.",
      },
      {
        title: "Watch History",
        detail:
          "localStorage persistence tracking continue-watching state per movie and series, including season and episode position with deduplication and 10-entry cap.",
      },
    ],
    challenges: [
      "Preventing stale state in search by using an ignore flag pattern inside useEffect to cancel outdated fetch responses.",
      "Handling Google OAuth token handoff — backend redirects with token in URL params, frontend consumes and cleans the URL on mount.",
      "Designing normalized review state to support fast lookups by ID without scanning arrays on every render.",
    ],
    stateStructure: `reviewState = { byIds: { [id]: { id, movie_id, rating, review } }, allIds: [...], loading, error }`,
    architectureImg: movix,
  },
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    featured: true,
    subtitle:
      "Privacy-first expense tracker for Ethiopia: an Android app parses CBE and telebirr SMS on the phone and syncs only structured transactions to a Next.js backend.",
    systems: [
      {
        title: "On-device SMS Parser",
        detail:
          "A pure function with ~50 regex templates for CBE and telebirr messages, implemented twice (Kotlin on the phone, TypeScript on the server) and tested against the same fixtures. It self-checks arithmetic (amount + fees must equal the printed total), flags uncertain messages for review, and never guesses an unknown format.",
      },
      {
        title: "Privacy-first Sync",
        detail:
          "The SMS inbox itself is the queue: the app stores one watermark date, parses locally, and sends only the extracted fields (never the message text) in batches of 50. Progress is saved after each batch, and a unique (user_id, dedupe_key) index makes every retry idempotent.",
      },
      {
        title: "Device Pairing & Auth",
        detail:
          "The phone pairs once with a single-use 8-digit code (10-minute expiry) and receives a random device token. Only its SHA-256 hash is stored, so each phone can be revoked independently. The server derives user_id from the session or token and never trusts it from the request body.",
      },
      {
        title: "Background Sync",
        detail:
          "A manifest-registered SmsReceiver inspects only the sender, then schedules a WorkManager job with a network constraint, exponential backoff and an hourly fallback, so new transactions arrive without opening the app.",
      },
      {
        title: "Ledger Engine",
        detail:
          "Money is stored as integer cents with fees kept separate. One shared SQL definition of 'spent' feeds both the summary and the category breakdown so they always add up. Loans and moves between a user's own CBE and telebirr accounts are matched (closest-first, same amount within 10 minutes) and excluded, while their fees still count.",
      },
      {
        title: "Rules & Balance Audit",
        detail:
          "Choosing a category can be remembered by person, description or amount; one SQL pass fills only empty rows and never overrides a manual choice. Because every SMS carries the balance after the transaction, an audit checks each balance against the previous one to measure parser accuracy and expose missing messages.",
      },
    ],
    challenges: [
      "Handling 50+ message wordings with inconsistent punctuation, fee formats and missing dates by adding an on-device report that groups unrecognised messages by wording (digits and links hidden), taking recognition from about a third of money-related messages to all of them.",
      "Syncing reliably over a flaky mobile connection: the first version inserted rows one at a time and restarted from zero after a dropped request. Fixed with a single-statement batch insert, per-batch progress on the phone, and idempotent retries.",
      "Keeping totals trustworthy: identical messages with no reference needed a fallback key (timestamp, amount, balance), own-account transfers needed matching so they aren't counted as spending, and the balance audit showed which gaps were messages the phone had deleted.",
    ],
    stateStructure: `transaction = { id, userId, institution, direction, kind, amount (cents), fee, balanceAfter, counterparty, reference, dedupeKey, occurredAt, categoryId, isInternal, needsReview }  |  syncState = { deviceToken, lastSyncedSmsDate }`,
    // architectureImg: tracker,
  },
];
