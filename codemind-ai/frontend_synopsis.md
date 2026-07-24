# CodeMind AI — Frontend Synopsis & Architecture
## Enterprise AI Engineering Intelligence Platform (Frontend Architecture)

The **CodeMind AI Frontend** is a native, modular **Single-Page Application (SPA)** built with zero compiler overhead using **Native ES Modules**, **Vanilla HTML5/CSS3**, and **Dynamic Lazy-Loaded Components**. It delivers an Apple-quality visual experience with a Linear-style layout density, a GitHub-style repository workflow, a Snyk-style vulnerability center, a Datadog-style analytics suite, and a Stripe-style API playground.

---

## 1. System Folder Architecture

```
frontend/
├── index.html               # Main SPA HTML container & typography font imports
├── css/                     # Layered Modular Design System (Vanilla CSS)
│   ├── tokens.css           # CSS Root Tokens (Colors, 18px Panel Radii, Transitions)
│   ├── layout.css           # Grid Viewports, Fixed Console Layout, Workspace Scroll Panes
│   ├── typography.css       # Font Families (Satoshi, Clash Display, Inter, JetBrains Mono)
│   ├── animations.css       # Keyframe Animations (Glows, Pulses, Shimmer, Card Lifts)
│   ├── utilities.css        # Responsive Grids (.grid-cols-12, .col-span-4), Flex, Spacing
│   └── components.css       # Visual Primitives (.glass-panel, .btn-premium, .badge-premium)
│
└── js/                      # Native ES Modules Application Logic
    ├── app.js               # Application Bootstrap, Canvas Particle Network, Mouse Spotlights
    │
    ├── router/
    │   └── router.js        # Client-Side Hash Router (Landing ➔ Auth ➔ Console views)
    │
    ├── state/               # Reactive State Management Stores
    │   ├── userState.js     # User session, JWT Bearer Token, localStorage persistence
    │   ├── uiState.js       # Current view state, active console tab, active repo subtab
    │   └── repoState.js     # Active project workspace, file tree, active editor content
    │
    ├── utils/               # Event & Utility Helpers
    │   ├── eventBus.js      # Decoupled Pub/Sub Event Emitter for module communications
    │   └── logger.js        # Formatted console logger with timestamps
    │
    ├── views/               # Page Controllers & Section Views
    │   ├── landing.js       # Hero terminal animation, features, workflow, testimonials, pricing
    │   ├── auth.js          # Authentication modal dialog view
    │   ├── dashboard.js     # Executive CommandCenter Dashboard (Org health, cards, ticker)
    │   ├── repository.js    # Repository main container wrapper
    │   ├── repository/      # Subtab Workspace Views
    │   │   ├── overview.js        # Repository Health, A/A+ Quality Metrics, Compliance
    │   │   ├── codeExplorer.js    # VS Code style File Tree Explorer & Code Editor
    │   │   ├── reviewPanel.js     # LangGraph AI Review Pipeline, Monaco Diff Editor
    │   │   ├── securityPanel.js   # Snyk-style 12-column Vulnerability Log Grid
    │   │   ├── analyticsPanel.js  # Datadog-style SVG Line Charts & Donut Pie Slices
    │   │   ├── reportsPanel.js    # Compliance Audit Export (Markdown & JSON)
    │   │   └── settingsPanel.js   # Repository settings
    │   │
    │   ├── team.js          # Team members & permissions list
    │   ├── integrations.js  # External service adapters (GitHub, Slack, Jira)
    │   ├── playground.js    # Stripe-inspired API Sandbox & Snippet Generator
    │   ├── billing.js       # Enterprise subscription plans & invoice metrics
    │   ├── logs.js          # Immutable audit logging event feed
    │   └── settings.js      # Global organization settings
    │
    ├── components/          # Reusable UI Components
    │   ├── navigation/
    │   │   ├── sidebar.js          # Collapsible main sidebar navigation
    │   │   ├── breadcrumb.js       # Contextual breadcrumb bar (Org > Repo > View)
    │   │   └── commandCenter.js    # Cmd+K Command Palette modal search
    │   ├── widgets/
    │   │   └── toast.js            # Toast alert notifications
    │   └── dialogs/
    │       └── newProjectModal.js  # Repository import modal dialog
    │
    └── ai/                  # AI Assistants & Chat
        ├── assistant.js     # Bottom-right floating context-aware assistant bubble
        └── chat.py / chat.js# Semantic repository-wide chat workspace
```

---

## 2. Design System Tokens & Typography Stack

### Color Palette Definitions (`css/tokens.css`)
* **Background (`--bg`)**: `#050505` (Deep Space Dark)
* **Panel Background (`--panel`)**: `#0E0E11` (Deep Charcoal Glass)
* **Surface Background (`--surface`)**: `#151518` (Elevation Layer)
* **Primary Brand Accent (`--primary`)**: `#FF3B30` (Apple Matte Crimson)
* **Secondary Brand Accent (`--secondary`)**: `#FF6B6B` (Coral Accent)
* **AI Accent (`--accent`)**: `#7C5CFF` (Indigo/Purple for AI Agents & Pipelines)
* **Information (`--info`)**: `#4DA3FF` (Light Blue)
* **Success (`--success`)**: `#22C55E` (Emerald Green)
* **Warning (`--warning`)**: `#F59E0B` (Amber)
* **Panel Border Radius (`--radius-lg`)**: `18px` (Curved Glass Cards & Modals)

### Typography Stack (`css/typography.css`)
* **Logo Brand (`.font-logo`)**: `Clash Display` (via Fontshare API)
* **Main Headings (`h1` to `h6`, `.font-heading`)**: `Satoshi` (via Fontshare API)
* **Body & UI Controls**: `Inter` (via Google Fonts)
* **Code & Monaco Editor (`.font-code`)**: `JetBrains Mono` (via Google Fonts)

---

## 3. Architecture & Interaction Flow

```
                           index.html
                               │
                       js/app.js (Bootstrap)
                               │
               ┌───────────────┼───────────────┐
               │               │               │
         js/router.js    js/state/       js/utils/eventBus.js
          (SPA Router)  (State Stores)   (Event Dispatcher)
               │               │               │
       ┌───────┴───────┐       └───────┬───────┘
       │               │               │
   Landing View   Console Views   UI Components
  (landing.js)    (dashboard.js,  (sidebar.js,
                  repository.js,  commandCenter.js,
                  security.js)    toast.js)
```

---

## 4. Key Frontend Features

1. **Native Client-Side Hash Router (`js/router/router.js`)**: Smoothly toggles between primary views (`landing`, `auth`, `console`) and console subviews without page reloads.
2. **Reactive State Stores (`js/state/`)**:
   - `userState`: Manages JWT Bearer token authentication and user profiles with `localStorage` fallback.
   - `repoState`: Maintains the active project, file tree hierarchy, and current code content.
   - `uiState`: Controls active view routes, modal overlays, and command palette (`Cmd+K`).
3. **Decoupled Pub/Sub Event Bus (`js/utils/eventBus.js`)**: Allows components to trigger events cleanly (e.g. `eventBus.emit("projectChanged")` re-renders workspace views without direct coupling).
4. **Interactive Monaco Diff Editor (`js/views/repository/reviewPanel.js`)**: Dynamically lazy-loads the Microsoft Monaco Editor CDN, rendering side-by-side original vs suggested code diffs with single-click **"Apply Patch"** functionality.
5. **Snyk-Style Vulnerability Center (`js/views/repository/securityPanel.js`)**: Displays 12-column grid logs with CWE taxonomy badges, severity indicators, and line references.
6. **Datadog-Style Analytics (`js/views/repository/analyticsPanel.js`)**: SVG line trend graphs and donut distribution charts for vulnerability metrics.
7. **Stripe-Style API Playground (`js/views/playground.js`)**: Code snippet generator (cURL, Python, JavaScript) and endpoint execution sandbox.
