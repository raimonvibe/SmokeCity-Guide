# 🎨 User Interface & Experience Flowcharts

## Main Application User Flow

```mermaid
flowchart TD
    A[App Launch] --> B[Check Permissions]
    B --> C{Microphone Access?}
    
    C -->|Granted| D[Show Main Interface]
    C -->|Denied| E[Show Permission Request]
    
    E --> F[Request Permissions]
    F --> G{User Grants?}
    G -->|Yes| D
    G -->|No| H[Show Limited Mode]
    
    D --> I[Display Listen Button]
    I --> J[User Clicks Listen]
    
    J --> K[Start Audio Recording]
    K --> L[Show Recording Animation]
    L --> M[Display Audio Levels]
    
    M --> N[Auto-stop After 10s]
    N --> O[Show Processing State]
    O --> P[Display Recognition Results]
    
    P --> Q{Song Recognized?}
    Q -->|Yes| R[Show Song Details]
    Q -->|No| S[Show No Match Message]
    
    R --> T[Load Additional Features]
    T --> U[Show Lyrics Button]
    T --> V[Show Analysis Button]
    T --> W[Show Playlist Button]
    
    U --> X[Display Lyrics]
    V --> Y[Show AI Analysis]
    W --> Z[Create Mood Playlist]
    
    S --> AA[Suggest Retry]
    AA --> J
    
    style D fill:#e3f2fd
    style R fill:#c8e6c9
    style S fill:#ffcdd2
```

## Audio Recording Interface States

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> RequestingPermission: User clicks Listen
    RequestingPermission --> PermissionDenied: Permission denied
    RequestingPermission --> Recording: Permission granted
    
    PermissionDenied --> Idle: Show error message
    
    Recording --> Processing: Recording complete (10s)
    Recording --> Cancelled: User cancels
    
    Cancelled --> Idle: Reset interface
    
    Processing --> Success: Song recognized
    Processing --> NoMatch: No song found
    Processing --> Error: Recognition failed
    
    Success --> ShowingResults: Display song info
    NoMatch --> Idle: Show retry option
    Error --> Idle: Show error message
    
    ShowingResults --> LoadingLyrics: User requests lyrics
    ShowingResults --> LoadingAnalysis: User requests analysis
    ShowingResults --> CreatingPlaylist: User requests playlist
    ShowingResults --> Idle: User starts new search
    
    LoadingLyrics --> DisplayingLyrics: Lyrics loaded
    LoadingAnalysis --> DisplayingAnalysis: Analysis loaded
    CreatingPlaylist --> DisplayingPlaylist: Playlist created
    
    DisplayingLyrics --> ShowingResults: Back to results
    DisplayingAnalysis --> ShowingResults: Back to results
    DisplayingPlaylist --> ShowingResults: Back to results
    
    state Recording {
        [*] --> Initializing
        Initializing --> Listening: Audio context ready
        Listening --> Capturing: Recording started
        Capturing --> [*]: Recording stopped
    }
    
    state Processing {
        [*] --> Uploading
        Uploading --> Analyzing: Data sent to API
        Analyzing --> [*]: Response received
    }
```

## Responsive Design Breakpoints

```mermaid
graph TD
    subgraph "Mobile Portrait (320px - 480px)"
        A[Single Column Layout]
        B[Stacked Navigation]
        C[Large Touch Targets]
        D[Simplified Controls]
    end
    
    subgraph "Mobile Landscape (481px - 768px)"
        E[Two Column Layout]
        F[Horizontal Navigation]
        G[Compact Controls]
        H[Side-by-side Content]
    end
    
    subgraph "Tablet (769px - 1024px)"
        I[Three Column Layout]
        J[Tab Navigation]
        K[Medium Controls]
        L[Grid Content Layout]
    end
    
    subgraph "Desktop (1025px+)"
        M[Multi-column Layout]
        N[Full Navigation Menu]
        O[Hover Interactions]
        P[Advanced Features]
    end
    
    subgraph "Adaptive Features"
        Q[Touch vs Mouse Input]
        R[Screen Orientation]
        S[Network Speed]
        T[Device Capabilities]
    end
    
    A --> E
    E --> I
    I --> M
    
    Q --> A
    Q --> E
    Q --> I
    Q --> M
    
    style A fill:#ffcdd2
    style E fill:#fff9c4
    style I fill:#c8e6c9
    style M fill:#e3f2fd
```

## Theme Management System

```mermaid
flowchart LR
    A[User Preference] --> B{Theme Setting}
    
    B -->|Light| C[Light Theme Variables]
    B -->|Dark| D[Dark Theme Variables]
    B -->|Auto| E[System Preference Check]
    
    E --> F{System Theme}
    F -->|Light| C
    F -->|Dark| D
    
    C --> G[Apply Light Colors]
    D --> H[Apply Dark Colors]
    
    G --> I[Update CSS Variables]
    H --> I
    
    I --> J[Animate Transition]
    J --> K[Save Preference]
    K --> L[Update UI Elements]
    
    subgraph "Theme Variables"
        M[Background Colors]
        N[Text Colors]
        O[Accent Colors]
        P[Border Colors]
        Q[Shadow Values]
    end
    
    I --> M
    I --> N
    I --> O
    I --> P
    I --> Q
    
    subgraph "UI Updates"
        R[Navigation Bar]
        S[Content Areas]
        T[Buttons & Controls]
        U[Modal Dialogs]
        V[Loading States]
    end
    
    L --> R
    L --> S
    L --> T
    L --> U
    L --> V
    
    style C fill:#fff9c4
    style D fill:#424242
    style J fill:#e3f2fd
```

## Modal Dialog Management

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Modal
    participant Backdrop
    participant Content
    
    User->>UI: Trigger Modal Action
    UI->>Modal: createModal(type, data)
    
    Modal->>Backdrop: createBackdrop()
    Modal->>Content: loadContent(data)
    
    Backdrop->>Backdrop: fadeIn()
    Content->>Content: slideIn()
    
    Modal->>UI: modalReady()
    UI->>User: Show Modal
    
    alt User Closes Modal
        User->>Modal: clickClose()
        Modal->>Content: slideOut()
        Modal->>Backdrop: fadeOut()
        Modal->>UI: modalClosed()
    
    else User Clicks Backdrop
        User->>Backdrop: clickBackdrop()
        Backdrop->>Modal: requestClose()
        Modal->>Content: slideOut()
        Modal->>Backdrop: fadeOut()
        Modal->>UI: modalClosed()
    
    else Escape Key Pressed
        User->>UI: pressEscape()
        UI->>Modal: forceClose()
        Modal->>Content: slideOut()
        Modal->>Backdrop: fadeOut()
        Modal->>UI: modalClosed()
    end
    
    UI->>UI: cleanupModal()
    UI->>User: Return to Main Interface
```

## Loading States & Animations

```mermaid
graph TD
    A[Action Triggered] --> B{Loading Type}
    
    B -->|Quick < 1s| C[Inline Spinner]
    B -->|Medium 1-5s| D[Progress Bar]
    B -->|Long > 5s| E[Full Screen Loader]
    
    C --> F[Show Small Spinner]
    F --> G[Disable Trigger Element]
    
    D --> H[Show Progress Container]
    H --> I[Animate Progress Bar]
    I --> J[Update Progress Text]
    
    E --> K[Show Overlay]
    K --> L[Display Loading Animation]
    L --> M[Show Cancel Option]
    
    G --> N{Action Complete?}
    J --> N
    M --> N
    
    N -->|Success| O[Hide Loading State]
    N -->|Error| P[Show Error State]
    N -->|Cancelled| Q[Reset to Initial State]
    
    O --> R[Show Success Feedback]
    P --> S[Show Error Message]
    Q --> T[Enable Controls]
    
    R --> U[Return to Normal State]
    S --> V[Offer Retry Option]
    T --> U
    
    V --> W{User Retries?}
    W -->|Yes| A
    W -->|No| U
    
    style C fill:#e3f2fd
    style D fill:#fff9c4
    style E fill:#ffcdd2
    style O fill:#c8e6c9
```

## Accessibility Features Flow

```mermaid
mindmap
  root((Accessibility Features))
    Keyboard Navigation
      Tab Order Management
      Focus Indicators
      Keyboard Shortcuts
      Skip Links
    
    Screen Reader Support
      ARIA Labels
      Live Regions
      Semantic HTML
      Alt Text
    
    Visual Accessibility
      High Contrast Mode
      Font Size Controls
      Color Blind Support
      Motion Reduction
    
    Audio Accessibility
      Visual Audio Indicators
      Transcript Support
      Volume Controls
      Audio Descriptions
    
    Motor Accessibility
      Large Touch Targets
      Voice Commands
      Gesture Alternatives
      Timeout Extensions
```

## Error State Management

```mermaid
stateDiagram-v2
    [*] --> Normal
    
    Normal --> NetworkError: Connection lost
    Normal --> APIError: API failure
    Normal --> ValidationError: Invalid input
    Normal --> PermissionError: Access denied
    
    NetworkError --> RetryPrompt: Show retry option
    APIError --> ErrorMessage: Display error
    ValidationError --> InputFeedback: Highlight issues
    PermissionError --> PermissionPrompt: Request access
    
    RetryPrompt --> Normal: Retry successful
    RetryPrompt --> PersistentError: Retry failed
    
    ErrorMessage --> Normal: User acknowledges
    ErrorMessage --> ContactSupport: Persistent issue
    
    InputFeedback --> Normal: Input corrected
    InputFeedback --> HelpDialog: User needs help
    
    PermissionPrompt --> Normal: Permission granted
    PermissionPrompt --> LimitedMode: Permission denied
    
    PersistentError --> OfflineMode: Enable offline
    PersistentError --> ContactSupport: Escalate issue
    
    ContactSupport --> Normal: Issue resolved
    HelpDialog --> Normal: Help provided
    LimitedMode --> Normal: Permissions changed
    OfflineMode --> Normal: Connection restored
    
    state NetworkError {
        [*] --> CheckingConnection
        CheckingConnection --> ConnectionLost: No internet
        CheckingConnection --> ServerDown: Server unreachable
        ConnectionLost --> [*]: Connection restored
        ServerDown --> [*]: Server back online
    }
```

## Progressive Enhancement Strategy

```mermaid
graph LR
    subgraph "Base Layer - Core Functionality"
        A[Basic HTML Structure]
        B[Essential CSS]
        C[Core JavaScript]
    end
    
    subgraph "Enhancement Layer 1 - Improved UX"
        D[Advanced CSS Animations]
        E[Interactive Elements]
        F[Form Validation]
    end
    
    subgraph "Enhancement Layer 2 - Rich Features"
        G[Audio Processing]
        H[Real-time Updates]
        I[Advanced Animations]
    end
    
    subgraph "Enhancement Layer 3 - Cutting Edge"
        J[Web Workers]
        K[Service Workers]
        L[Push Notifications]
    end
    
    A --> D
    B --> D
    C --> E
    
    D --> G
    E --> H
    F --> H
    
    G --> J
    H --> K
    I --> L
    
    subgraph "Feature Detection"
        M[Check Browser Support]
        N[Graceful Degradation]
        O[Polyfill Loading]
    end
    
    M --> A
    M --> D
    M --> G
    M --> J
    
    N --> A
    O --> D
    
    style A fill:#c8e6c9
    style D fill:#fff9c4
    style G fill:#e3f2fd
    style J fill:#fce4ec
```

## Component Lifecycle Management

```mermaid
sequenceDiagram
    participant App as Application
    participant CM as Component Manager
    participant Comp as Component
    participant DOM as DOM Element
    participant Events as Event Listeners
    
    App->>CM: createComponent(type, props)
    CM->>Comp: new Component(props)
    
    Comp->>Comp: initialize()
    Comp->>DOM: createElement()
    Comp->>Events: attachEventListeners()
    
    Comp->>CM: componentReady()
    CM->>App: componentCreated()
    
    loop Component Active
        App->>Comp: updateProps(newProps)
        Comp->>Comp: shouldUpdate(newProps)
        alt Should Update
            Comp->>DOM: updateElement()
            Comp->>Events: updateListeners()
        end
    end
    
    App->>CM: destroyComponent(id)
    CM->>Comp: cleanup()
    
    Comp->>Events: removeEventListeners()
    Comp->>DOM: removeElement()
    Comp->>Comp: destroy()
    
    Comp->>CM: componentDestroyed()
    CM->>App: componentRemoved()
```
