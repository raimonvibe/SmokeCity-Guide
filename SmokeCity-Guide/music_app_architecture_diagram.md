# 🎵 Music App Architecture & Workflow Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[User Interface]
        AR[Audio Recorder]
        MR[Music Recognition]
        SP[Spotify Integration]
        AI[AI Analysis]
        TTS[Text-to-Speech]
    end
    
    subgraph "API Layer"
        ACR[ACRCloud API]
        SPOT[Spotify Web API]
        OAI[OpenAI GPT-4]
        GEN[Genius API]
        GCP[Google Cloud TTS]
    end
    
    subgraph "Data Layer"
        CACHE[Local Cache]
        STORE[Local Storage]
        AUDIO[Audio Buffers]
    end
    
    UI --> AR
    AR --> MR
    MR --> ACR
    MR --> SP
    SP --> SPOT
    SP --> AI
    AI --> OAI
    AI --> GEN
    AI --> TTS
    TTS --> GCP
    
    MR --> CACHE
    SP --> CACHE
    AI --> STORE
    AR --> AUDIO
    
    style UI fill:#e1f5fe
    style ACR fill:#fff3e0
    style SPOT fill:#e8f5e8
    style OAI fill:#fce4ec
    style GEN fill:#f3e5f5
    style GCP fill:#e0f2f1
```

## Music Recognition Workflow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant AudioRecorder
    participant MusicRecognition
    participant ACRCloud
    participant Cache
    
    User->>UI: Click "Listen" Button
    UI->>AudioRecorder: requestPermission()
    AudioRecorder->>User: Request Microphone Access
    User->>AudioRecorder: Grant Permission
    
    AudioRecorder->>AudioRecorder: initializeAudioContext()
    AudioRecorder->>MusicRecognition: startRecording(10s)
    
    loop Recording Audio
        AudioRecorder->>AudioRecorder: collectAudioData()
        AudioRecorder->>UI: updateAudioLevel()
    end
    
    AudioRecorder->>MusicRecognition: processAudioData()
    MusicRecognition->>Cache: checkCache(audioFingerprint)
    
    alt Cache Miss
        MusicRecognition->>ACRCloud: recognize(audioBuffer)
        ACRCloud->>MusicRecognition: songMetadata
        MusicRecognition->>Cache: storeResult()
    else Cache Hit
        Cache->>MusicRecognition: cachedResult
    end
    
    MusicRecognition->>UI: displayResult()
    UI->>User: Show Song Information
```

## Spotify Integration & Mood Playlist Creation

```mermaid
flowchart TD
    A[Song Recognized] --> B{Check Spotify Cache}
    B -->|Cache Hit| C[Use Cached Data]
    B -->|Cache Miss| D[Authenticate with Spotify]
    
    D --> E[Search Track by Title/Artist]
    E --> F{Track Found?}
    F -->|No| G[Search by Alternative Methods]
    F -->|Yes| H[Get Audio Features]
    
    G --> H
    H --> I[Analyze Mood Characteristics]
    
    I --> J{Valence > 0.6?}
    J -->|Yes| K[Happy Mood]
    J -->|No| L{Valence < 0.4?}
    L -->|Yes| M[Sad Mood]
    L -->|No| N[Neutral Mood]
    
    K --> O[Search Happy Songs]
    M --> P[Search Sad Songs]
    N --> Q[Search Similar Energy Songs]
    
    O --> R[Create Mood Playlist]
    P --> R
    Q --> R
    
    R --> S[Cache Results]
    S --> T[Display Playlist to User]
    
    style A fill:#e3f2fd
    style K fill:#c8e6c9
    style M fill:#ffcdd2
    style N fill:#fff9c4
```

## AI Lyric Analysis Pipeline

```mermaid
graph LR
    subgraph "Input Processing"
        A[Song Metadata] --> B[Search Genius API]
        B --> C[Extract Lyrics]
        C --> D[Clean & Format Text]
    end
    
    subgraph "AI Analysis"
        D --> E[Prepare OpenAI Prompt]
        E --> F[Send to GPT-4]
        F --> G[Parse AI Response]
    end
    
    subgraph "Enhancement"
        G --> H[Extract Key Themes]
        H --> I[Identify Literary Devices]
        I --> J[Cultural Context Analysis]
    end
    
    subgraph "Output Generation"
        J --> K[Format Analysis]
        K --> L[Generate Discussion Points]
        L --> M[Create Summary]
    end
    
    subgraph "Delivery"
        M --> N[Cache Results]
        N --> O[Display to User]
        O --> P[Optional TTS Narration]
    end
    
    style E fill:#fff3e0
    style F fill:#fce4ec
    style P fill:#e0f2f1
```

## Text-to-Speech Processing Flow

```mermaid
stateDiagram-v2
    [*] --> CheckInput
    CheckInput --> ValidateText: Text Provided
    CheckInput --> Error: No Text
    
    ValidateText --> CheckCache: Valid Text
    ValidateText --> Error: Invalid Text
    
    CheckCache --> ReturnCached: Cache Hit
    CheckCache --> PrepareSSML: Cache Miss
    
    PrepareSSML --> SelectVoice: SSML Ready
    SelectVoice --> ConfigureAudio: Voice Selected
    ConfigureAudio --> CallGoogleTTS: Audio Config Set
    
    CallGoogleTTS --> ProcessResponse: API Success
    CallGoogleTTS --> RetryRequest: API Error
    
    RetryRequest --> CallGoogleTTS: Retry < 3
    RetryRequest --> Error: Max Retries
    
    ProcessResponse --> CreateAudioURL: Audio Data Received
    CreateAudioURL --> CacheResult: URL Created
    CacheResult --> ReturnResult: Cached
    
    ReturnCached --> ReturnResult
    ReturnResult --> [*]
    Error --> [*]
```

## Error Handling & Recovery Patterns

```mermaid
graph TD
    A[API Request] --> B{Request Successful?}
    B -->|Yes| C[Process Response]
    B -->|No| D{Error Type?}
    
    D -->|Network Error| E[Retry with Backoff]
    D -->|Rate Limit| F[Wait & Retry]
    D -->|Auth Error| G[Re-authenticate]
    D -->|Invalid Data| H[Validate & Sanitize]
    D -->|Server Error| I[Fallback Strategy]
    
    E --> J{Retry Count < Max?}
    J -->|Yes| A
    J -->|No| K[Show User Error]
    
    F --> L[Calculate Wait Time]
    L --> M[Wait]
    M --> A
    
    G --> N[Get New Token]
    N --> A
    
    H --> O[Clean Data]
    O --> A
    
    I --> P[Use Cached Data]
    P --> Q{Cache Available?}
    Q -->|Yes| C
    Q -->|No| K
    
    C --> R[Success]
    K --> S[Graceful Degradation]
    
    style A fill:#e3f2fd
    style R fill:#c8e6c9
    style K fill:#ffcdd2
    style S fill:#fff9c4
```

## Performance Optimization Strategy

```mermaid
mindmap
  root((Performance Optimization))
    Caching
      API Response Cache
      Audio Buffer Cache
      UI Component Cache
      Service Worker Cache
    
    Loading
      Lazy Loading Images
      Code Splitting
      Progressive Enhancement
      Preload Critical Resources
    
    Audio Processing
      Web Workers
      Buffer Optimization
      Compression
      Streaming
    
    Network
      Request Batching
      Connection Pooling
      CDN Usage
      Offline Support
    
    Monitoring
      Core Web Vitals
      Error Tracking
      Performance Metrics
      User Analytics
```

## User Experience Flow

```mermaid
journey
    title User Journey: Music Recognition to Playlist Creation
    section Discovery
      Open App: 5: User
      Grant Permissions: 3: User
      See Interface: 4: User
    
    section Recognition
      Play Music: 5: User
      Click Listen: 5: User
      Wait for Recognition: 3: User
      See Results: 5: User
    
    section Exploration
      Read Lyrics: 4: User
      Listen to Analysis: 4: User
      Explore Mood Playlist: 5: User
      Save Favorites: 5: User
    
    section Sharing
      Share Song: 4: User
      Share Playlist: 4: User
      Discuss Analysis: 5: User
```

## Testing Strategy Pyramid

```mermaid
graph TD
    subgraph "Testing Pyramid"
        A[Unit Tests - 70%]
        B[Integration Tests - 20%]
        C[E2E Tests - 10%]
    end
    
    subgraph "Unit Test Coverage"
        D[Audio Processing Functions]
        E[API Response Parsing]
        F[Utility Functions]
        G[Component Logic]
    end
    
    subgraph "Integration Tests"
        H[API Integrations]
        I[Audio Recording Flow]
        J[Cache Management]
        K[Error Handling]
    end
    
    subgraph "E2E Tests"
        L[Complete User Journeys]
        M[Cross-Browser Testing]
        N[Performance Testing]
        O[Accessibility Testing]
    end
    
    A --> D
    A --> E
    A --> F
    A --> G
    
    B --> H
    B --> I
    B --> J
    B --> K
    
    C --> L
    C --> M
    C --> N
    C --> O
    
    style A fill:#c8e6c9
    style B fill:#fff9c4
    style C fill:#ffcdd2
```

## Deployment Pipeline

```mermaid
gitgraph
    commit id: "Initial Setup"
    branch development
    checkout development
    commit id: "Add Music Recognition"
    commit id: "Add Spotify Integration"
    commit id: "Add AI Analysis"
    
    branch feature/tts
    checkout feature/tts
    commit id: "Implement TTS"
    commit id: "Add Voice Selection"
    
    checkout development
    merge feature/tts
    commit id: "Integration Testing"
    
    branch staging
    checkout staging
    merge development
    commit id: "Staging Deploy"
    commit id: "Performance Testing"
    
    checkout main
    merge staging
    commit id: "Production Deploy"
    commit id: "Monitor & Optimize"
```

## Security Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[User Interface]
        B[Environment Variables]
        C[Local Storage]
    end
    
    subgraph "Security Layers"
        D[HTTPS Enforcement]
        E[API Key Management]
        F[CORS Configuration]
        G[Content Security Policy]
        H[Input Validation]
    end
    
    subgraph "External APIs"
        I[ACRCloud]
        J[Spotify]
        K[OpenAI]
        L[Genius]
        M[Google Cloud]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> H
    G --> H
    
    H --> I
    H --> J
    H --> K
    H --> L
    H --> M
    
    style D fill:#ffcdd2
    style E fill:#ffcdd2
    style F fill:#ffcdd2
    style G fill:#ffcdd2
    style H fill:#ffcdd2
```
