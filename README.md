# Eureka

A real-time, two-player geography guessing game built with Node.js and Socket.IO. One player ("The Beacon") sets a secret location on the map, while the other ("The Seeker") attempts to find it using proximity hints. The interface features a custom "VIVELE" design system with glassmorphism effects and a narrative-driven onboarding experience.

## Interesting Techniques

### CSS & Styling

- **[CSS Custom Properties (CSS Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)**: The "VIVELE" design system uses CSS variables to define a five-tone color palette (`--vivele-deep`, `--vivele-mid`, `--vivele-bright`, `--vivele-light`, `--vivele-pale`) and semantic design tokens in [style.css](./public/css/style.css), enabling theme consistency and easy customization.

- **[CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)**: Utilized to scope component styles without a preprocessor, improving maintainability and reducing selector specificity issues.

- **[backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)**: Applies real-time blur and saturation effects (`blur(20px) saturate(160%)`) to create glassmorphism effects on panels and overlays, creating depth without additional DOM elements.

- **[CSS Animations with cubic-bezier](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)**: Implements physics-based easing functions (`cubic-bezier(0.22, 1, 0.36, 1)`) for natural motion in ripple effects and 3D card entry sequences, creating a premium feel.

- **[CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)**: Used for responsive player card layouts with `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`, automatically adapting to screen size.

- **[CSS Transform & will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)**: Optimized animations using `transform` properties and `will-change` hints for GPU acceleration, reducing jank during transitions.

- **[Media Queries with prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)**: Respects user accessibility preferences by disabling animations when `prefers-reduced-motion: reduce` is detected.

- **[Media Queries with prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)**: Enhances visual contrast for users with high contrast mode enabled.

- **[CSS clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)**: Used in typography (`font-size: clamp(4rem, 15vw, 8rem)`) for fluid, responsive text sizing that scales smoothly between breakpoints.

- **[CSS Box Shadow with Multiple Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)**: Creates depth and 3D effects using multiple shadow layers, including inset shadows for inner depth.

- **[CSS Radial Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient)**: Used in entry transitions to create fluid wave patterns and ambient glows with interference effects.

### JavaScript Patterns

- **[Facade Pattern](https://refactoring.guru/design-patterns/facade)**: The [MapFacade.js](./public/js/MapFacade.js) class abstracts the third-party Leaflet library, providing a simplified, consistent interface for map operations while hiding complexity.

- **[State Machine Pattern](https://en.wikipedia.org/wiki/Finite-state_machine)**: [Game.js](./src/game/Game.js) manages game sessions through explicit phases (`WAITING`, `SETTING`, `GUESSING`, `ROUND_END`, `GAME_END`) with controlled transitions, ensuring predictable state flow.

- **[Observer Pattern](https://refactoring.guru/design-patterns/observer)**: Uses Socket.IO's event system to broadcast state changes (score updates, location reveals) to connected clients, decoupling game logic from UI updates.

- **[Command Pattern](https://refactoring.guru/design-patterns/command)**: [Commands.js](./src/game/Commands.js) encapsulates user actions (`SetLocationCommand`, `MakeGuessCommand`) as objects, enabling undo/redo capabilities and action queuing.

- **[Strategy Pattern](https://refactoring.guru/design-patterns/strategy)**: [Scoring.js](./src/utils/Scoring.js) implements interchangeable scoring algorithms (`LogarithmicScoring`, `LinearScoring`), allowing runtime strategy selection.

- **[Debouncing](https://developer.mozilla.org/en-US/docs/Glossary/Debounce)**: Map click events are debounced (200ms) in [MapFacade.js](./public/js/MapFacade.js) to prevent rapid-fire interactions and improve performance.

- **[Event Delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)**: Used for dynamic quiz button handling, reducing event listener overhead.

### Performance Optimizations

- **[RequestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)**: Implicitly used by CSS animations for smooth, frame-synced rendering.

- **[Touch Action CSS Property](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)**: Configured (`touch-action: pan-x pan-y pinch-zoom`) to optimize map interactions on mobile devices, preventing unwanted scrolling.

- **[CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment)**: Implicit containment through isolated component styles reduces layout recalculations.

## Technologies & Libraries

### Core Dependencies

- **[Express 5.1.0](https://expressjs.com/)**: Web framework for handling HTTP requests and serving static assets. Express 5 introduces improved async/await support and better error handling.

- **[Socket.IO 4.8.1](https://socket.io/)**: Real-time, bidirectional event-based communication library. Enables instant game state synchronization between server and clients using WebSockets with fallback to HTTP long-polling.

- **[Leaflet 1.7.1](https://leafletjs.com/)**: Lightweight, open-source JavaScript library for interactive maps. Used for rendering the world map, markers, polygons (hint ellipses), and polylines (result connections).

- **[haversine-distance 1.2.4](https://www.npmjs.com/package/haversine-distance)**: Calculates the great-circle distance between two points on Earth using the haversine formula, accounting for Earth's curvature for accurate distance measurements.

### External Services & APIs

- **[OpenStreetMap](https://www.openstreetmap.org/)**: Provides free, open-source map tiles via tile servers (`{s}.tile.openstreetmap.org`).

- **[Nominatim API](https://nominatim.org/)**: OpenStreetMap's reverse geocoding service, used to convert coordinates to human-readable addresses and extract country information.

- **[Google Fonts](https://fonts.google.com/)**: 
  - [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (700 weight): Elegant serif font for headings and titles
  - [Quicksand](https://fonts.google.com/specimen/Quicksand) (400, 700 weights): Modern sans-serif for body text and UI elements

- **[Leaflet Color Markers](https://github.com/pointhi/leaflet-color-markers)**: Custom marker icons for different game states (green for actual location, orange for guesses).

### Design System

- **VIVELE Palette**: Custom five-tone purple gradient system (`#B869B5` → `#F191FF`) creating a cohesive, modern aesthetic.

- **Glassmorphism**: Modern UI trend using `backdrop-filter: blur()` to create frosted glass effects, giving depth and visual hierarchy.

## Project Structure

```text
eureka/
├── public/                    # Client-side assets
│   ├── css/
│   │   ├── style.css         # Core VIVELE design system & game UI
│   │   ├── entry-transition.css  # Cinema-style entry animations
│   │   └── story-guide.css    # Narrative overlay styles
│   ├── js/
│   │   ├── MapFacade.js       # Facade pattern for Leaflet abstraction
│   │   ├── GameUI.js          # UI component management
│   │   ├── StoryManager.js    # Narrative flow controller
│   │   └── main.js            # Application entry point & orchestration
│   └── index.html             # Main HTML structure
├── src/                       # Server-side logic
│   ├── game/
│   │   ├── Game.js            # Core game state machine
│   │   ├── GameManager.js     # Game instance lifecycle management
│   │   └── Commands.js        # Command pattern implementations
│   ├── socket/
│   │   └── socketHandler.js   # Socket.IO event routing
│   └── utils/
│       └── Scoring.js         # Strategy pattern for scoring algorithms
├── server.js                  # Express server & Socket.IO setup
├── package.json               # Dependencies & scripts
└── README.md                  # This file
```

### Directory Descriptions

- **`public/css/`**: Modular stylesheets implementing the VIVELE design system. [style.css](./public/css/style.css) contains the core design tokens, component styles, and responsive breakpoints. [entry-transition.css](./public/css/entry-transition.css) handles the cinematic entry sequence with ripple effects. [story-guide.css](./public/css/story-guide.css) styles the narrative overlay system.

- **`public/js/`**: Client-side modules following separation of concerns. [MapFacade.js](./public/js/MapFacade.js) abstracts Leaflet operations. [GameUI.js](./public/js/GameUI.js) manages DOM updates and user feedback. [StoryManager.js](./public/js/StoryManager.js) controls the narrative progression. [main.js](./public/js/main.js) coordinates initialization and event wiring.

- **`src/game/`**: Server-side game orchestration. [Game.js](./src/game/Game.js) implements the state machine managing game phases and player interactions. [GameManager.js](./src/game/GameManager.js) handles game instance creation, lookup, and cleanup. [Commands.js](./src/game/Commands.js) encapsulates user actions as command objects.

- **`src/socket/`**: Real-time communication layer. [socketHandler.js](./src/socket/socketHandler.js) routes Socket.IO events to appropriate game instances and command handlers.

- **`src/utils/`**: Reusable utility modules. [Scoring.js](./src/utils/Scoring.js) provides pluggable scoring strategies using the Strategy pattern.

## Design Philosophy

The project follows a **modern/innovative** aesthetic direction, implementing **glassmorphism** design principles with:

- **Glass Cockpit UI**: Translucent panels with backdrop blur creating depth
- **3D Card Effects**: Layered shadows and transforms for spatial hierarchy  
- **Fluid Animations**: Physics-based easing for natural motion
- **Narrative Onboarding**: Story-driven entry experience engaging users emotionally
- **Progressive Enhancement**: Core functionality works without JavaScript enhancements

The VIVELE color system (pearl purple gradients) creates a premium, futuristic feel while maintaining excellent contrast for accessibility.
