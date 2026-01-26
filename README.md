# Eureka

A real-time, two-player geography guessing game built with Node.js and Socket.IO. One player ("The Beacon") sets a secret location on the map, while the other ("The Seeker") attempts to find it using proximity hints. The interface features a custom "VIVELE" design system with glassmorphism effects and a narrative-driven onboarding experience.

## Interesting Techniques

### CSS & Visual Effects

- **[CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)**: The entire "VIVELE" design system is built on CSS variables defined in [style.css](./public/css/style.css), enabling theme consistency and runtime customization. Variables cascade through gradients, shadows, and component styles.

- **[CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)**: Modern CSS nesting syntax is used throughout [style.css](./public/css/style.css) to scope component styles without requiring a preprocessor, improving maintainability and reducing selector specificity conflicts.

- **[backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)**: Applied extensively for glassmorphism effects in [style.css](./public/css/style.css) and [entry-transition.css](./public/css/entry-transition.css). Creates real-time blur and saturation effects on overlays, giving the "glass cockpit" aesthetic with `blur(20px) saturate(160%)`.

- **[CSS Animations & @keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)**: Multiple sophisticated animations including:
  - `elegantSparkle`: Subtle rotation and opacity transitions for decorative elements
  - `rippleBlast`: Expanding circular waves using `box-shadow` and `vmax` units for the entry transition
  - `constructText`: Character-by-character reveal with blur-to-focus effect
  - `liquidShimmer`: Animated gradient background positions for text effects
  - `breathingText`: Scale and drop-shadow pulsing for dynamic typography

- **[CSS Transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)**: Used for 3D card effects, hover states, and entry animations. Includes `translateY()`, `scale()`, and `rotate()` with hardware-accelerated transforms via `will-change` optimization.

- **[CSS Filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)**: Multiple filter effects applied:
  - `drop-shadow()` for depth and elevation on text and icons
  - `blur()` for focus transitions and glass effects
  - `sepia()` and `hue-rotate()` applied to map tiles for thematic color tinting
  - `saturate()` combined with backdrop-filter for enhanced visual richness

- **[CSS Grid & Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)**: Grid layout for responsive player card arrangements (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`), and Flexbox for centering, alignment, and the entry overlay layout.

- **[CSS clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)**: Used in [entry-transition.css](./public/css/entry-transition.css) for fluid typography scaling: `font-size: clamp(4rem, 15vw, 8rem)` ensures responsive text that adapts to viewport width.

- **[CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)**: Optimizes animation performance by hinting to the browser about upcoming property changes, used in the entry transition curtain for smoother opacity transitions.

- **[CSS Cubic Bezier Easing](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#cubic-bezier_easing)**: Custom easing functions like `cubic-bezier(0.22, 1, 0.36, 1)` and `cubic-bezier(0.4, 0.0, 0.2, 1)` create natural, physics-based motion curves for transitions and animations.

- **[CSS Radial Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient)**: Complex multi-layer radial gradients create fluid wave patterns in the entry transition, simulating interference patterns with overlapping circular gradients.

- **[CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)**: Comprehensive responsive design with breakpoints for tablet (769px-1024px), mobile (≤768px), small mobile (≤480px), and landscape orientation. Includes support for `prefers-reduced-motion` and `prefers-contrast` accessibility features.

- **[CSS Pseudo-elements (::before, ::after)](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)**: Extensively used for decorative elements, sparkle animations, accent lines, and ripple effects without adding DOM nodes.

- **[CSS Background Clip (text)](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip)**: Gradient text effects using `background-clip: text` with `-webkit-text-fill-color: transparent` for animated gradient text in the entry sequence.

### JavaScript Patterns & Techniques

- **[Debouncing](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)**: Implemented in [MapFacade.js](./public/js/MapFacade.js) to prevent rapid-fire map click events, improving performance and user experience.

- **[Facade Pattern](https://refactoring.guru/design-patterns/facade)**: The `MapFacade` class in [MapFacade.js](./public/js/MapFacade.js) abstracts the Leaflet.js API, providing a simplified, game-specific interface that decouples the game logic from the mapping library.

- **[Command Pattern](https://refactoring.guru/design-patterns/command)**: Server-side commands (`SetLocationCommand`, `MakeGuessCommand`) in [Commands.js](./src/game/Commands.js) encapsulate game actions as objects, enabling undo/redo capabilities and action queuing.

- **[State Machine Pattern](https://en.wikipedia.org/wiki/Finite-state_machine)**: Game state management through explicit phases (`WAITING`, `SETTING`, `GUESSING`, `ROUND_END`, `GAME_END`) in [Game.js](./src/game/Game.js), ensuring predictable state transitions.

- **[Observer Pattern](https://refactoring.guru/design-patterns/observer)**: Socket.IO event system broadcasts state changes to all connected clients, implementing a publish-subscribe model for real-time synchronization.

- **[ES6 Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)**: Modern class syntax used throughout the codebase (`MapFacade`, `GameUI`, `StoryManager`, `Game`) for encapsulation and inheritance.

- **[Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)**: Used in [main.js](./public/js/main.js) for merging game state updates efficiently without mutating the original object.

- **[Event Delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)**: Event listeners attached to parent elements handle dynamic child interactions, reducing memory footprint and improving performance.

- **[Rest Parameters & Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)**: Used in the debounce implementation and throughout the codebase for flexible function arguments.

- **[Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)**: Used for dynamic string construction in UI updates and game state messages.

### Real-time Communication

- **[Socket.IO Rooms](https://socket.io/docs/v4/rooms/)**: Game sessions use Socket.IO rooms to isolate communication between players in the same game, preventing cross-game message leakage.

- **[Socket.IO Namespaces](https://socket.io/docs/v4/namespaces/)**: Server-side event handling organized through namespaces for scalable architecture.

- **[Event-driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture)**: The entire game flow is event-driven, with Socket.IO events triggering state changes, UI updates, and game logic execution.

## Technologies & Libraries

### Core Dependencies

- **[Express.js 5.1.0](https://expressjs.com/)**: Modern web framework for Node.js handling HTTP requests, static file serving, and middleware. The server configuration is in [server.js](./server.js).

- **[Socket.IO 4.8.1](https://socket.io/)**: Real-time bidirectional event-based communication library. Enables instant game state synchronization between players. Socket handlers are organized in [src/socket/socketHandler.js](./src/socket/socketHandler.js).

- **[Leaflet.js 1.7.1](https://leafletjs.com/)**: Open-source JavaScript library for mobile-friendly interactive maps. Used for rendering the world map, markers, polygons (ellipse hints), and polylines (result connections). Integrated via CDN in [index.html](./public/index.html).

- **[haversine-distance 1.2.4](https://www.npmjs.com/package/haversine-distance)**: NPM package for calculating the great-circle distance between two points on Earth using the haversine formula. Used in [Scoring.js](./src/utils/Scoring.js) to determine guess accuracy.

### External Services & APIs

- **[OpenStreetMap](https://www.openstreetmap.org/)**: Tile server providing the base map layers via Leaflet's tile layer API.

- **[Nominatim Geocoding API](https://nominatim.org/)**: Reverse geocoding service used to convert coordinates to human-readable addresses and location information.

- **[REST Countries API](https://restcountries.com/)**: Used to fetch country flag images and country information based on location coordinates.

- **[Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)**: REST API endpoint (`/api/rest_v1/page/summary/`) used to fetch fun facts and location information for discovered places.

### Typography

- **[Playfair Display](https://fonts.google.com/specimen/Playfair+Display)**: Google Fonts serif typeface used for headings and titles, providing elegant, classical typography. Loaded with weight 700.

- **[Quicksand](https://fonts.google.com/specimen/Quicksand)**: Google Fonts sans-serif typeface used for body text and UI elements, offering modern readability. Loaded with weights 400 and 700.

### Development Tools

- **Node.js**: JavaScript runtime environment for server-side execution.

- **npm**: Package manager for dependency management, defined in [package.json](./package.json).

## Project Structure

```text
eureka/
├── public/                          # Frontend assets served statically
│   ├── css/                        # Stylesheets
│   │   ├── style.css              # Core VIVELE design system & component styles
│   │   ├── entry-transition.css    # Entry animation sequence (ripple effects, text reveal)
│   │   └── story-guide.css        # Narrative overlay & story guide UI
│   ├── js/                         # Client-side JavaScript modules
│   │   ├── main.js                # Application entry point, event orchestration
│   │   ├── MapFacade.js           # Facade pattern wrapper for Leaflet.js
│   │   ├── GameUI.js              # UI state management & DOM manipulation
│   │   └── StoryManager.js        # Narrative flow & story guide controller
│   └── index.html                 # Main HTML document
├── src/                            # Server-side source code
│   ├── game/                      # Game logic & state management
│   │   ├── Game.js                # Core game class, state machine implementation
│   │   ├── GameManager.js         # Singleton manager for active game sessions
│   │   └── Commands.js            # Command pattern implementations (SetLocation, MakeGuess)
│   ├── socket/                    # Socket.IO event handlers
│   │   └── socketHandler.js      # Socket connection setup & event routing
│   └── utils/                     # Utility functions
│       └── Scoring.js             # Distance calculation & point scoring logic
├── server.js                       # Express server entry point & configuration
├── package.json                    # NPM dependencies & project metadata
├── package-lock.json              # Locked dependency versions
├── ai_mentor_instructions.json    # AI assistant configuration & guidelines
└── README.md                       # This file
```

### Directory Descriptions

- **public/**: Contains all client-facing assets. The directory is served statically by Express, making files directly accessible via HTTP. The modular CSS architecture separates concerns: design system, animations, and feature-specific styles.

- **public/css/**: Modular stylesheet architecture. [style.css](./public/css/style.css) defines the VIVELE design system with CSS custom properties, component styles, and responsive breakpoints. [entry-transition.css](./public/css/entry-transition.css) handles the cinematic entry sequence with ripple animations and kinetic typography. [story-guide.css](./public/css/story-guide.css) provides the 3D card styling for the narrative overlay.

- **public/js/**: Client-side modules following separation of concerns. [main.js](./public/js/main.js) orchestrates initialization, Socket.IO events, and coordinates between modules. [MapFacade.js](./public/js/MapFacade.js) abstracts Leaflet.js operations, providing a game-specific API. [GameUI.js](./public/js/GameUI.js) manages DOM updates and UI state. [StoryManager.js](./public/js/StoryManager.js) handles the narrative guide overlay and story progression.

- **src/**: Server-side source code organized by domain. This separation enables better testability and maintainability.

- **src/game/**: Core game logic implementing the state machine pattern. [Game.js](./src/game/Game.js) manages individual game sessions, player roles, rounds, and state transitions. [GameManager.js](./src/game/GameManager.js) is a singleton that tracks all active games and maps socket connections to game instances. [Commands.js](./src/game/Commands.js) implements the command pattern for game actions, enabling extensibility and potential undo/redo functionality.

- **src/socket/**: Socket.IO event handling layer. [socketHandler.js](./src/socket/socketHandler.js) sets up connection listeners, routes events to appropriate game instances, and manages player lifecycle (join, disconnect, cleanup).

- **src/utils/**: Shared utility functions. [Scoring.js](./src/utils/Scoring.js) contains the haversine distance calculation and logarithmic point scoring algorithm that rewards proximity.

- **server.js**: Express server configuration and entry point. Sets up static file serving, routes the root path to [index.html](./public/index.html), initializes Socket.IO, and delegates socket configuration to the handler module.

## Design System: VIVELE

The project implements a custom design system called "VIVELE" (Pearl Purple), featuring:

- **Five-tone color palette**: Deep, Mid, Bright, Light, and Pale variations of purple/magenta
- **Glassmorphism effects**: Backdrop-filter blur and saturation for translucent UI elements
- **3D card effects**: Multi-layer borders, outlines, and shadows creating depth
- **Responsive typography**: Fluid scaling with clamp() and viewport-relative units
- **Accessibility**: WCAG AA compliant touch targets (44px minimum), focus states, and reduced motion support

The design system is defined through CSS custom properties in [style.css](./public/css/style.css), enabling easy theming and future customization.
