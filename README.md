# Eureka

A real-time, two-player geography guessing game built with Node.js and Socket.IO. One player ("The Beacon") sets a secret location on the map, while the other ("The Seeker") attempts to find it using proximity hints. The interface features a custom "VIVELE" design system with glassmorphism effects and a narrative-driven onboarding experience.

## Techniques Uses

- **[CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)**: Used for the "VIVELE" design system, defining a five-tone color palette and semantic design tokens in [style.css](./public/css/style.css).
- **[CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)**: Utilized to scope component styles (e.g., `.story-content`) without a preprocessor.
- **[backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)**: Applies real-time blur and saturation effects to the glass panels and overlays.
- **[CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)**: Implements physics-based easing (`cubic-bezier`) for the ripple effects and 3D card entry sequences.
- **Facade Pattern**: The [MapFacade.js](./public/js/MapFacade.js) class abstracts the third-party Leaflet library, providing a simplified interface for the game logic.
- **State Machine**: [Game.js](./src/game/Game.js) manages the game sessions through explicit phases (`WAITING`, `SETTING`, `GUESSING`, `ROUND_END`).
- **Observer Pattern**: Uses Socket.IO to broadcast state changes (score updates, location reveals) to the connected clients.

## Technologies Used

- **[Express 5](https://expressjs.com/)**: Handling HTTP requests and static assets.
- **[Socket.IO 4](https://socket.io/)**: Enabling real-time, event-based communication between the server and clients.
- **[Leaflet](https://leafletjs.com/)**: Rendering the interactive maps and markers.
- **[haversine-distance](https://www.npmjs.com/package/haversine-distance)**: Calculating the geodesic distance between the target and the guess.
- **Fonts**: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (Titles) and [Quicksand](https://fonts.google.com/specimen/Quicksand) (Body) from Google Fonts.

## Project Structure

```text
eureka/
├── public/
│   ├── css/          # Modular styles (style.css, story-guide.css)
│   └── js/           # Client logic (GameUI.js, StoryManager.js)
├── src/
│   ├── game/         # Core game logic (Game.js, GameManager.js)
│   ├── socket/       # Socket.IO event handlers
│   └── utils/        # Helper modules (Scoring.js)
├── server.js         # Entry point and server configuration
└── package.json
```

- **public/css/**: Contains the modular stylesheets, including the core variable definitions, narrative guide styles, and entry transitions.
- **public/js/**: Client-side modules separating UI concerns (`GameUI.js`), narrative flow (`StoryManager.js`), and map interactions (`MapFacade.js`).
- **src/game/**: Server-side game orchestration, handling state transitions and player management.
