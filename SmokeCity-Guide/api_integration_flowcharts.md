# 🔌 API Integration Flowcharts & Diagrams

## ACRCloud Music Recognition Flow

```mermaid
sequenceDiagram
    participant App as Music App
    participant Mic as Microphone
    participant ACR as ACRCloud API
    participant Cache as Local Cache
    
    Note over App,Cache: Music Recognition Process
    
    App->>Mic: Request Audio Permission
    Mic-->>App: Permission Granted
    
    App->>Mic: Start Audio Capture (10s)
    
    loop Audio Recording
        Mic->>App: Audio Chunk
        App->>App: Buffer Audio Data
    end
    
    App->>App: Process Audio Buffer
    App->>App: Generate Audio Fingerprint
    
    App->>Cache: Check Fingerprint Cache
    alt Cache Hit
        Cache-->>App: Cached Recognition Result
    else Cache Miss
        App->>ACR: POST /v1/identify
        Note right of ACR: Audio fingerprint analysis
        ACR-->>App: Recognition Result
        App->>Cache: Store Result
    end
    
    App->>App: Parse & Format Result
    App->>App: Display Song Information
```

## Spotify API Authentication & Data Flow

```mermaid
flowchart TD
    A[App Startup] --> B[Check Stored Token]
    B --> C{Token Valid?}
    
    C -->|Yes| D[Use Existing Token]
    C -->|No| E[Request New Token]
    
    E --> F[Prepare Credentials]
    F --> G[Base64 Encode Client ID:Secret]
    G --> H[POST to /api/token]
    
    H --> I{Auth Success?}
    I -->|No| J[Handle Auth Error]
    I -->|Yes| K[Store Access Token]
    
    K --> D
    D --> L[Make API Requests]
    
    L --> M[Search Tracks]
    L --> N[Get Audio Features]
    L --> O[Create Playlists]
    
    M --> P{Rate Limit?}
    N --> P
    O --> P
    
    P -->|Yes| Q[Wait & Retry]
    P -->|No| R[Process Response]
    
    Q --> L
    R --> S[Cache Results]
    S --> T[Return Data to UI]
    
    J --> U[Show Error Message]
    
    style E fill:#fff3e0
    style K fill:#e8f5e8
    style P fill:#ffcdd2
    style S fill:#e1f5fe
```

## OpenAI GPT-4 Lyric Analysis Pipeline

```mermaid
graph LR
    subgraph "Input Preparation"
        A[Song Metadata] --> B[Fetch Lyrics from Genius]
        B --> C[Clean & Validate Text]
        C --> D[Prepare Analysis Prompt]
    end
    
    subgraph "AI Processing"
        D --> E[Check Token Limits]
        E --> F[Send to OpenAI API]
        F --> G[Stream Response]
        G --> H[Parse JSON Response]
    end
    
    subgraph "Post-Processing"
        H --> I[Extract Analysis Sections]
        I --> J[Format for Display]
        J --> K[Generate Discussion Points]
        K --> L[Create Summary]
    end
    
    subgraph "Error Handling"
        F --> M{API Error?}
        M -->|Yes| N[Retry Logic]
        M -->|No| G
        N --> O{Max Retries?}
        O -->|No| F
        O -->|Yes| P[Fallback Response]
    end
    
    L --> Q[Cache Analysis]
    P --> Q
    Q --> R[Return to UI]
    
    style F fill:#fce4ec
    style M fill:#ffcdd2
    style Q fill:#e1f5fe
```

## Genius API Lyrics Retrieval Process

```mermaid
stateDiagram-v2
    [*] --> SearchSong
    SearchSong --> ParseSearchResults: API Response
    SearchSong --> HandleSearchError: API Error
    
    ParseSearchResults --> CheckMatches: Results Found
    ParseSearchResults --> NoResults: No Results
    
    CheckMatches --> SelectBestMatch: Multiple Matches
    CheckMatches --> GetLyrics: Single Match
    
    SelectBestMatch --> GetLyrics: Match Selected
    
    GetLyrics --> FetchLyricsPage: Song ID Found
    GetLyrics --> HandleLyricsError: Fetch Error
    
    FetchLyricsPage --> ExtractLyrics: HTML Response
    FetchLyricsPage --> HandlePageError: Page Error
    
    ExtractLyrics --> CleanLyrics: Raw Lyrics
    CleanLyrics --> ValidateLyrics: Cleaned Text
    
    ValidateLyrics --> CacheLyrics: Valid Lyrics
    ValidateLyrics --> HandleValidationError: Invalid
    
    CacheLyrics --> ReturnLyrics: Cached
    
    HandleSearchError --> RetrySearch: Retry Available
    HandleSearchError --> FallbackSearch: Max Retries
    
    HandleLyricsError --> RetryLyrics: Retry Available
    HandleLyricsError --> NoLyrics: Max Retries
    
    HandlePageError --> RetryPage: Retry Available
    HandlePageError --> NoLyrics: Max Retries
    
    HandleValidationError --> NoLyrics: Validation Failed
    
    RetrySearch --> SearchSong
    RetryLyrics --> GetLyrics
    RetryPage --> FetchLyricsPage
    
    FallbackSearch --> AlternativeSearch
    AlternativeSearch --> GetLyrics: Found
    AlternativeSearch --> NoLyrics: Not Found
    
    NoResults --> [*]
    NoLyrics --> [*]
    ReturnLyrics --> [*]
```

## Google Cloud Text-to-Speech Workflow

```mermaid
sequenceDiagram
    participant UI as User Interface
    participant TTS as TTS Manager
    participant Cache as Audio Cache
    participant GCP as Google Cloud TTS
    participant Audio as Audio Player
    
    UI->>TTS: convertToSpeech(text, options)
    
    TTS->>TTS: validateInput(text)
    TTS->>Cache: checkCache(textHash)
    
    alt Cache Hit
        Cache-->>TTS: cachedAudioData
        TTS->>Audio: createAudioURL(data)
    else Cache Miss
        TTS->>TTS: prepareSSML(text, options)
        TTS->>TTS: selectVoice(options)
        TTS->>TTS: configureAudio(options)
        
        TTS->>GCP: POST /v1/text:synthesize
        Note right of GCP: Neural voice synthesis
        
        GCP-->>TTS: audioContent (base64)
        TTS->>TTS: decodeAudioData()
        TTS->>Cache: storeAudio(hash, data)
        TTS->>Audio: createAudioURL(data)
    end
    
    Audio-->>UI: audioURL
    UI->>Audio: playAudio()
    
    Note over UI,Audio: User can control playback
```

## Rate Limiting & Request Management

```mermaid
graph TD
    A[API Request] --> B[Rate Limiter Check]
    
    B --> C{Within Limits?}
    C -->|Yes| D[Add to Request Queue]
    C -->|No| E[Calculate Wait Time]
    
    E --> F[Queue Request with Delay]
    F --> G[Wait for Rate Limit Reset]
    G --> D
    
    D --> H[Process Request Queue]
    H --> I[Execute Request]
    
    I --> J{Request Success?}
    J -->|Yes| K[Update Rate Limit Counters]
    J -->|No| L{Retry Eligible?}
    
    L -->|Yes| M[Exponential Backoff]
    L -->|No| N[Return Error]
    
    M --> O[Add to Retry Queue]
    O --> P[Wait Backoff Period]
    P --> I
    
    K --> Q[Return Success Response]
    
    subgraph "Rate Limit Tracking"
        R[Requests Per Minute]
        S[Daily Request Count]
        T[Reset Timestamps]
        U[Backoff Multipliers]
    end
    
    B --> R
    B --> S
    E --> T
    M --> U
    
    style C fill:#fff9c4
    style E fill:#ffcdd2
    style K fill:#c8e6c9
    style N fill:#ffcdd2
```

## API Error Handling Strategy

```mermaid
flowchart TD
    A[API Call] --> B{Response Status}
    
    B -->|200-299| C[Success Response]
    B -->|400| D[Bad Request]
    B -->|401| E[Unauthorized]
    B -->|403| F[Forbidden]
    B -->|404| G[Not Found]
    B -->|429| H[Rate Limited]
    B -->|500-599| I[Server Error]
    B -->|Network| J[Network Error]
    
    C --> K[Parse & Return Data]
    
    D --> L[Validate Request Data]
    L --> M[Fix & Retry]
    L --> N[Show User Error]
    
    E --> O[Refresh Auth Token]
    O --> P{Auth Success?}
    P -->|Yes| M
    P -->|No| Q[Re-authenticate]
    
    F --> R[Check API Permissions]
    R --> S[Contact Support]
    
    G --> T[Try Alternative Endpoint]
    T --> U{Alternative Found?}
    U -->|Yes| M
    U -->|No| V[Graceful Degradation]
    
    H --> W[Exponential Backoff]
    W --> X[Wait & Retry]
    
    I --> Y{Retry Count < Max?}
    Y -->|Yes| Z[Retry with Delay]
    Y -->|No| AA[Fallback Strategy]
    
    J --> BB[Check Network Status]
    BB --> CC{Online?}
    CC -->|Yes| Z
    CC -->|No| DD[Offline Mode]
    
    M --> A
    X --> A
    Z --> A
    
    style C fill:#c8e6c9
    style H fill:#fff9c4
    style I fill:#ffcdd2
    style J fill:#ffcdd2
```

## Caching Strategy Diagram

```mermaid
graph TB
    subgraph "Cache Layers"
        A[Memory Cache - Fast Access]
        B[Local Storage - Persistent]
        C[IndexedDB - Large Data]
        D[Service Worker - Network Cache]
    end
    
    subgraph "Cache Types"
        E[API Response Cache]
        F[Audio Buffer Cache]
        G[Lyrics Cache]
        H[Analysis Cache]
        I[Image Cache]
    end
    
    subgraph "Cache Policies"
        J[TTL - Time To Live]
        K[LRU - Least Recently Used]
        L[Size Limits]
        M[Invalidation Rules]
    end
    
    E --> A
    E --> B
    F --> A
    F --> C
    G --> B
    H --> B
    I --> D
    
    A --> J
    B --> K
    C --> L
    D --> M
    
    subgraph "Cache Operations"
        N[Get from Cache]
        O[Set to Cache]
        P[Invalidate Cache]
        Q[Clear Cache]
    end
    
    J --> N
    K --> O
    L --> P
    M --> Q
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#fce4ec
```

## API Response Processing Pipeline

```mermaid
graph LR
    subgraph "Raw Response"
        A[HTTP Response] --> B[Status Check]
        B --> C[Headers Parsing]
        C --> D[Body Extraction]
    end
    
    subgraph "Data Validation"
        D --> E[JSON Parsing]
        E --> F[Schema Validation]
        F --> G[Data Sanitization]
    end
    
    subgraph "Data Transformation"
        G --> H[Normalize Structure]
        H --> I[Type Conversion]
        I --> J[Field Mapping]
    end
    
    subgraph "Enhancement"
        J --> K[Add Metadata]
        K --> L[Calculate Derived Fields]
        L --> M[Apply Business Logic]
    end
    
    subgraph "Output"
        M --> N[Cache Result]
        N --> O[Return to Caller]
        O --> P[Update UI]
    end
    
    subgraph "Error Paths"
        B --> Q[Status Error]
        E --> R[Parse Error]
        F --> S[Validation Error]
        Q --> T[Error Handler]
        R --> T
        S --> T
        T --> U[Fallback Response]
    end
    
    style E fill:#fff3e0
    style F fill:#e8f5e8
    style N fill:#e1f5fe
    style T fill:#ffcdd2
```
