# ChatMe - WebSocket Message Flow

## Complete Message Flow Documentation

### Connection Flow

```
┌─────────────┐                              ┌─────────────┐
│   Client    │                              │   Backend   │
│  (Mobile)   │                              │  (Worker)   │
└─────────────┘                              └─────────────┘
       │                                              │
       │  1. WebSocket Connection Request            │
       │─────────────────────────────────────────────>│
       │                                              │
       │  2. Connection Accepted (101 Switching)     │
       │<─────────────────────────────────────────────│
       │                                              │
       │  3. Client: {type: 'search'}                │
       │─────────────────────────────────────────────>│
       │                                              │
       │  4. Server: {type: 'searching'}             │
       │<─────────────────────────────────────────────│
       │                                              │
```

### Matching Flow (Two Users)

```
┌──────────┐              ┌──────────┐              ┌──────────┐
│  User A  │              │  Backend │              │  User B  │
└──────────┘              └──────────┘              └──────────┘
     │                         │                         │
     │  {type: 'search'}       │                         │
     │────────────────────────>│                         │
     │                         │                         │
     │  {type: 'searching'}    │                         │
     │<────────────────────────│                         │
     │                         │                         │
     │                         │     {type: 'search'}    │
     │                         │<────────────────────────│
     │                         │                         │
     │  {type: 'matched',      │  {type: 'matched',     │
     │   partnerId: 'B...'}    │   partnerId: 'A...'}   │
     │<────────────────────────│────────────────────────>│
     │                         │                         │
```

### Chat Flow

```
┌──────────┐              ┌──────────┐              ┌──────────┐
│  User A  │              │  Backend │              │  User B  │
└──────────┘              └──────────┘              └──────────┘
     │                         │                         │
     │  {type: 'message',      │                         │
     │   text: 'Hello!'}       │                         │
     │────────────────────────>│                         │
     │                         │                         │
     │                         │  {type: 'message',     │
     │                         │   text: 'Hello!',      │
     │                         │   from: 'A...'}        │
     │                         │────────────────────────>│
     │                         │                         │
     │                         │  {type: 'message',     │
     │                         │   text: 'Hi there!'}   │
     │                         │<────────────────────────│
     │                         │                         │
     │  {type: 'message',      │                         │
     │   text: 'Hi there!',    │                         │
     │   from: 'B...'}         │                         │
     │<────────────────────────│                         │
     │                         │                         │
```

### "Next" Chat Flow

```
┌──────────┐              ┌──────────┐              ┌──────────┐
│  User A  │              │  Backend │              │  User B  │
└──────────┘              └──────────┘              └──────────┘
     │                         │                         │
     │  [User A clicks Next]   │                         │
     │                         │                         │
     │  {type: 'search'}       │                         │
     │────────────────────────>│                         │
     │                         │                         │
     │  {type: 'searching'}    │  {type: 'partner_     │
     │<────────────────────────│   disconnected'}       │
     │                         │────────────────────────>│
     │                         │                         │
     │                         │  [B back in queue]      │
     │  [A searching for       │  {type: 'searching'}   │
     │   new partner]          │────────────────────────>│
     │                         │                         │
```

### Disconnect Flow

```
┌──────────┐              ┌──────────┐              ┌──────────┐
│  User A  │              │  Backend │              │  User B  │
└──────────┘              └──────────┘              └──────────┘
     │                         │                         │
     │  {type: 'end_chat'}     │                         │
     │────────────────────────>│                         │
     │                         │                         │
     │  {type: 'chat_ended'}   │  {type: 'partner_     │
     │<────────────────────────│   disconnected'}       │
     │                         │────────────────────────>│
     │                         │                         │
     │  WebSocket Close        │  [B back in queue]      │
     │────────────────────────>│                         │
     │                         │                         │
     │  Connection Closed      │                         │
     │<────────────────────────│                         │
     │                         │                         │
```

### Keep-Alive (Ping/Pong) Flow

```
┌──────────┐              ┌──────────┐
│  Client  │              │  Backend │
└──────────┘              └──────────┘
     │                         │
     │  [Every 30 seconds]     │
     │                         │
     │  {type: 'ping'}         │
     │────────────────────────>│
     │                         │
     │  {type: 'pong'}         │
     │<────────────────────────│
     │                         │
```

## Message Type Reference

### Client → Server

| Type | Payload | When | Purpose |
|------|---------|------|---------|
| `search` | None | User starts search or clicks "Next" | Find a chat partner |
| `message` | `{text: string}` | User sends message | Send chat message |
| `end_chat` | None | User clicks "End Chat" | Disconnect from chat |
| `ping` | None | Every 30 seconds | Keep connection alive |

### Server → Client

| Type | Payload | When | Purpose |
|------|---------|------|---------|
| `searching` | None | User in queue | Inform user they're searching |
| `matched` | `{partnerId: string}` | Match found | Provide partner info |
| `message` | `{text: string, from: string}` | Partner sends message | Deliver message |
| `partner_disconnected` | None | Partner leaves | Inform disconnection |
| `pong` | None | Response to ping | Confirm connection alive |
| `chat_ended` | None | Chat session ends | Confirm end of chat |

## State Machine

### Connection States

```
disconnected
    ↓
connecting (WebSocket connecting)
    ↓
connected (WebSocket open)
    ↓
searching (In queue, looking for partner)
    ↓
matched (Connected with partner)
    ↓
[Back to searching or disconnected]
```

### State Transitions

```typescript
// Initial connection
'disconnected' → 'connecting' → 'connected'

// Start search
'connected' → 'searching'

// Found match
'searching' → 'matched'

// Next chat
'matched' → 'searching'

// End chat
'matched' → 'disconnected'

// Partner disconnected
'matched' → 'searching' (auto search)

// Error
any → 'error'

// Reconnect attempt
'error' → 'connecting'
```

## Error Handling

### Network Disconnection

```
┌──────────┐              ┌──────────┐
│  Client  │              │  Backend │
└──────────┘              └──────────┘
     │                         │
     │  [Network lost]         │
     │  Connection Lost        │
     │                         │
     │  [Auto reconnect]       │
     │                         │
     │  Attempt 1/5            │
     │────────────────────────>│
     │  Failed                 │
     │                         │
     │  Attempt 2/5            │
     │────────────────────────>│
     │  Success!               │
     │<────────────────────────│
     │                         │
     │  {type: 'search'}       │
     │────────────────────────>│
     │  Resume searching       │
```

### Max Reconnect Attempts

```
Connection Lost
    ↓
Attempt 1 (wait 3s)
    ↓
Attempt 2 (wait 3s)
    ↓
Attempt 3 (wait 3s)
    ↓
Attempt 4 (wait 3s)
    ↓
Attempt 5 (wait 3s)
    ↓
Max attempts reached → 'error' state
User must manually reconnect
```

## Backend Queue Algorithm

### FIFO Queue Logic

```
User A connects → Queue: [A]
User B connects → Queue: [A, B] → Match A↔B → Queue: []
User C connects → Queue: [C]
User D connects → Queue: [C, D] → Match C↔D → Queue: []
User E connects → Queue: [E]
User A clicks Next → Queue: [E, A] → Match E↔A → Queue: []
```

### Duplicate Prevention

```
User A in queue: [A]
User A sends 'search' again: [A] (not added, already in queue)
```

### Cleanup

```
User disconnects → Remove from queue
Partner check → Remove invalid connections
Queue persistence → Saved to Durable Object storage
```

## Real-World Scenarios

### Scenario 1: Two Users Chat Normally

1. User A: Opens app → "Start Chatting"
2. User B: Opens app → "Start Chatting"
3. Backend: Matches A ↔ B
4. Both: See "Online" status
5. Exchange messages
6. User A: "End Chat" → Home screen
7. User B: Sees "Partner disconnected"

### Scenario 2: User Clicks "Next"

1. User A and B chatting
2. User A: Clicks "Next"
3. User A: Searching...
4. User B: "Partner disconnected" → Auto-search
5. User C joins
6. Backend: Matches A ↔ C or B ↔ C

### Scenario 3: Network Interruption

1. User A and B chatting
2. User A: Network lost
3. User A: Auto-reconnect (up to 5 attempts)
4. User B: "Partner disconnected"
5. User A: Reconnects → Searches for new partner
6. Both find new matches

### Scenario 4: App Backgrounded

1. User A chatting
2. User A: Switches to another app
3. Connection maintained (ping stops)
4. User A: Returns to app
5. Ping resumes
6. Chat continues

## Console Log Examples

### Successful Connection

```
[WebSocket] Connecting to: wss://chatme-backend.workers.dev
[WebSocket] Connected successfully
[ChatScreen] Starting search on mount
[WebSocket] Sent: {type: 'search'}
[WebSocket] Received: {type: 'searching'}
[WebSocket] Received: {type: 'matched', partnerId: '8a7b9c...'}
```

### Sending Messages

```
[WebSocket] Sent: {type: 'message', text: 'Hello!'}
[WebSocket] Received: {type: 'message', text: 'Hi there!', from: '8a7b9c...'}
```

### Partner Disconnection

```
[WebSocket] Received: {type: 'partner_disconnected'}
[WebSocket] Partner disconnected
```

### Reconnection

```
[WebSocket] Closed: code=1006, reason=
[WebSocket] Reconnect attempt 1/5
[WebSocket] Connecting to: wss://chatme-backend.workers.dev
[WebSocket] Connected successfully
```

This documentation provides a complete reference for understanding the message flow and state management in the ChatMe application.

