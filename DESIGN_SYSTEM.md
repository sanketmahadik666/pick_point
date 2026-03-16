# Eureka Design System Specification

## Color System

### VIVELE Palette (Primary)
- `--vivele-deep`: #B869B5
- `--vivele-mid`: #CC72C4
- `--vivele-bright`: #E182E4
- `--vivele-light`: #F191FF
- `--vivele-pale`: #F1A7FF

### Legacy Rose Gold (Accent)
- `--rose-gold`: #b76e79
- `--rose-gold-light`: #c98b94
- `--rose-gold-dark`: #a15864

### Semantic Colors
- **success**: #98d8c8
- **warning**: #ffc371 (from error gradient, used in quiz wrong state)
- **error**: #ff5f6d (primary), #ff6b6b (variant), #d63031 (dark variant)
- **info**: rgba(255, 182, 193, 0.12) / rgba(221, 160, 221, 0.12) (gradient background)

### Special Effects

#### Gradients
- **gradient-primary**: `linear-gradient(135deg, var(--vivele-deep), var(--vivele-bright), var(--vivele-pale))`
- **gradient-secondary**: `linear-gradient(135deg, var(--vivele-mid), var(--vivele-light))`
- **gradient-elegant**: `linear-gradient(135deg, var(--vivele-deep) 0%, var(--vivele-bright) 50%, var(--vivele-pale) 100%)`
- **gradient-background**: `radial-gradient(circle at 30% 20%, rgba(241, 145, 255, 0.15) 0%, rgba(204, 114, 196, 0.1) 50%, rgba(255, 250, 255, 0.9) 100%)`
- **gradient-success**: `linear-gradient(135deg, #00b09b, #96c93d)` (quiz correct state)
- **gradient-error**: `linear-gradient(135deg, #ff5f6d, #ffc371)` (quiz wrong state)

#### Shadows
- **shadow-sm**: `0 4px 16px rgba(184, 105, 181, 0.1)`
- **shadow-md**: `0 8px 32px rgba(184, 105, 181, 0.15), 0 2px 8px rgba(184, 105, 181, 0.1)`
- **shadow-lg**: `0 12px 40px rgba(184, 105, 181, 0.25), 0 4px 12px rgba(184, 105, 181, 0.15)`
- **shadow-3d-card**: `0 10px 30px rgba(184, 105, 181, 0.15), 0 0 0 1px rgba(184, 105, 181, 0.1)`
- **shadow-map-container**: `0 25px 60px rgba(0,0,0,0.25), 0 0 0 10px rgba(184, 105, 181, 0.2)`
- **glow-text**: `0 2px 8px rgba(184, 105, 181, 0.3)`
- **glow-soft**: `0 0 20px rgba(225, 130, 228, 0.4)`
- **inset-depth**: `inset 0 0 20px rgba(184, 105, 181, 0.2)`

#### Blur Effects (Glassmorphism)
- **blur-effect-sm**: `backdrop-filter: blur(5px)`
- **blur-effect-md**: `backdrop-filter: blur(10px)`
- **blur-effect-lg**: `backdrop-filter: blur(12px)`
- **blur-effect-xl**: `backdrop-filter: blur(20px) saturate(160%)`
- **blur-effect-ultra**: `backdrop-filter: blur(35px) saturate(180%)` (entry transition)

#### Special Effects
- **glass-base**: `background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(20px) saturate(160%); border: 1px solid rgba(255, 255, 255, 0.6)`
- **3d-border**: `border: 8px solid #ffffff; outline: 2px solid var(--vivele-mid)`
- **map-tint**: `filter: sepia(0.2) hue-rotate(320deg) contrast(0.95)`

## Typography System

### Font Stack
```css
/* Headings */
font-family: 'Playfair Display', 'Cormorant Garamond', serif;

/* Body & UI */
font-family: 'Quicksand', 'Lato', Arial, sans-serif;
```

### Type Scale
- **text-xs**: 0.75rem / 1rem (12px / 16px)
- **text-sm**: 0.875rem / 1.25rem (14px / 20px)
- **text-base**: 1rem / 1.5rem (16px / 24px)
- **text-lg**: 1.125rem / 1.75rem (18px / 28px)
- **text-xl**: 1.25rem / 1.75rem (20px / 28px)
- **text-2xl**: 1.5rem / 2rem (24px / 32px)
- **text-3xl**: 1.875rem / 2.25rem (30px / 36px)
- **text-4xl**: 2.25rem / 2.5rem (36px / 40px)
- **text-5xl**: 3rem / 1.2 (48px / 57.6px)

### Font Weights
- **Headings (h1)**: 700 (bold)
- **Headings (h2, h3)**: 600 (semi-bold)
- **Body**: 400 (regular)
- **UI elements**: 500 (medium)
- **Emphasis**: 600 (semi-bold)
- **Strong emphasis**: 800 (extra-bold)

### Letter Spacing
- **Headings**: 1.5px (0.09375rem)
- **UI labels**: 1px (0.0625rem)
- **Uppercase text**: 1px (0.0625rem)
- **Title (h1 in game-controls)**: -0.02em

## Spacing System

**Base unit**: 4px (0.25rem)

### Scale
- **space-0**: 0
- **space-1**: 0.25rem (4px)
- **space-2**: 0.5rem (8px)
- **space-3**: 0.75rem (12px)
- **space-4**: 1rem (16px)
- **space-5**: 1.25rem (20px)
- **space-6**: 1.5rem (24px)
- **space-8**: 2rem (32px)
- **space-10**: 2.5rem (40px)
- **space-12**: 3rem (48px)
- **space-16**: 4rem (64px)

### Border Radius
- **radius-sm**: 15px
- **radius-md**: 20px
- **radius-lg**: 25px
- **radius-xl**: 30px (map container)
- **radius-round**: 50% (circular elements)

## Component Specification

### Buttons

#### Primary Button (Standard)
```css
padding: 0.875em 2em;
min-height: 44px;
min-width: 120px;
border-radius: 15px;
font-weight: 500;
text-transform: none;
transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
box-shadow: 0 4px 16px rgba(184, 105, 181, 0.1);
background: linear-gradient(135deg, rgba(227, 230, 243, 0.9), rgba(248, 225, 244, 0.9));
color: var(--rose-gold);
border: 1.5px solid var(--rose-gold);
font-size: 1.1em;
font-family: "Quicksand", sans-serif;
```

**Hover state:**
```css
background: var(--rose-gold);
color: #fff;
box-shadow: 0 12px 40px rgba(184, 105, 181, 0.25), 0 4px 12px rgba(184, 105, 181, 0.15);
transform: translateY(-2px) scale(1.02);
outline: 3px solid rgba(183, 110, 121, 0.4);
outline-offset: 2px;
```

**Active state:**
```css
transform: translateY(0) scale(0.98);
```

#### Control Group Button (Gradient)
```css
padding: 1rem 2rem;
min-height: 48px;
border-radius: 15px;
font-weight: 600;
text-transform: uppercase;
transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
box-shadow: 0 4px 16px rgba(184, 105, 181, 0.1);
background: linear-gradient(135deg, var(--vivele-deep) 0%, var(--vivele-bright) 50%, var(--vivele-pale) 100%);
color: white;
border: none;
font-size: 1.1rem;
letter-spacing: 1px;
width: 100%;
```

**Hover state:**
```css
transform: translateY(-2px) scale(1.01);
box-shadow: 0 12px 40px rgba(184, 105, 181, 0.25), 0 4px 12px rgba(184, 105, 181, 0.15);
outline: 3px solid rgba(255, 255, 255, 0.5);
outline-offset: 2px;
```

#### Quiz Button
```css
display: block;
width: 100%;
padding: 1rem 1.5rem;
margin: 0.8rem 0;
border-radius: 12px;
border: 1px solid var(--vivele-mid);
background: white;
color: #1a0520;
font-size: 1.1rem;
font-weight: 600;
transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
text-align: left;
```

**Hover state:**
```css
background: var(--vivele-light);
transform: translateX(5px);
border-color: var(--vivele-bright);
box-shadow: 0 4px 12px rgba(184, 105, 181, 0.2);
```

**Correct state:**
```css
background: linear-gradient(135deg, #00b09b, #96c93d);
color: white;
border-color: transparent;
box-shadow: 0 0 15px rgba(0, 176, 155, 0.4);
```

**Wrong state:**
```css
background: linear-gradient(135deg, #ff5f6d, #ffc371);
color: white;
border-color: transparent;
opacity: 0.8;
```

### Input Fields

#### Standard Input
```css
height: auto;
min-height: 44px;
padding: 0.875em 1.25em;
border: 2px solid rgba(183, 110, 121, 0.4);
border-radius: 15px;
background: rgba(255, 255, 255, 0.95);
transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
backdrop-filter: blur(5px);
width: 100%;
font-size: 1em;
color: #3d2c4e;
```

**Focus state:**
```css
outline: 3px solid rgba(183, 110, 121, 0.3);
outline-offset: 2px;
border-color: var(--rose-gold);
box-shadow: 0 0 0 4px rgba(183, 110, 121, 0.15), 0 0 20px rgba(225, 130, 228, 0.4);
transform: translateY(-1px);
background: rgba(255, 255, 255, 1);
```

#### Control Group Input (Text)
```css
padding: 1rem 1.5rem;
min-height: 48px;
border: 2px solid rgba(255, 182, 193, 0.5);
border-radius: 15px;
font-size: 1.1rem;
transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
background: linear-gradient(135deg, #fff0f5, #ffeef8);
box-shadow: inset 0 2px 4px rgba(183, 110, 121, 0.05);
width: 100%;
```

**Focus state:**
```css
border-color: var(--rose-gold);
box-shadow: 0 0 0 4px rgba(183, 110, 121, 0.15), inset 0 2px 4px rgba(183, 110, 121, 0.05);
transform: translateY(-2px);
```

#### Range Slider
```css
width: 100%;
height: 8px;
border-radius: 10px;
background: linear-gradient(90deg, rgba(255, 182, 193, 0.3), rgba(183, 110, 121, 0.6));
outline: none;
margin: 1.5rem 0;
cursor: pointer;
touch-action: pan-x;
```

**Thumb:**
```css
width: 28px;
height: 28px;
min-width: 28px;
min-height: 28px;
border-radius: 50%;
background: linear-gradient(135deg, var(--vivele-deep) 0%, var(--vivele-bright) 50%, var(--vivele-pale) 100%);
box-shadow: 0 4px 12px rgba(183, 110, 121, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
border: 2px solid rgba(255, 255, 255, 0.8);
```

**Thumb hover/focus:**
```css
transform: scale(1.3);
box-shadow: 0 6px 20px rgba(183, 110, 121, 0.5);
outline: 3px solid rgba(183, 110, 121, 0.3);
outline-offset: 2px;
```

### Cards

#### Info Panel / Quiz / Fun Fact Card
```css
padding: 1.5rem 2rem;
border-radius: 18px;
background: #ffffff;
border: 4px solid #ffffff;
outline: 1px solid var(--vivele-mid);
box-shadow: 0 10px 30px rgba(184, 105, 181, 0.15), 0 0 0 1px rgba(184, 105, 181, 0.1);
```

**Mobile variant:**
```css
padding: 1.25rem 1.5rem;
max-width: 100%;
```

#### Player Card
```css
padding: 2.5rem;
border-radius: 20px;
background: rgba(255, 255, 255, 0.5);
border: 1px solid rgba(255, 255, 255, 0.4);
box-shadow: none; /* Uses backdrop-filter for depth */
```

**Hover state:**
```css
background: rgba(255, 255, 255, 0.7);
box-shadow: 0 10px 30px rgba(183, 110, 121, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.5);
border-color: rgba(255, 182, 193, 0.8);
```

**Active state:**
```css
background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,245,248,0.9));
border: 2px solid var(--rose-gold);
box-shadow: 0 0 25px rgba(183, 110, 121, 0.3);
```

**Mobile variant:**
```css
padding: 1.5rem; /* Mobile */
padding: 1.25rem; /* Small mobile */
```

#### Game Controls (Glass Cockpit)
```css
padding: 2.5rem 3rem;
border-radius: 25px;
background: rgba(255, 255, 255, 0.65);
border: 1px solid rgba(255, 255, 255, 0.6);
box-shadow: 0 8px 32px rgba(183, 110, 121, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
```

**Hover state:**
```css
background: rgba(255, 255, 255, 0.75);
box-shadow: 0 12px 48px rgba(183, 110, 121, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
```

**Mobile variant:**
```css
padding: 1.5rem; /* Mobile */
padding: 1.25rem; /* Small mobile */
```

#### Map Container (3D Frame)
```css
padding: 1.5rem;
border-radius: 30px;
background: #ffffff;
border: 8px solid #ffffff;
outline: 2px solid var(--vivele-mid);
box-shadow: 0 25px 60px rgba(0,0,0,0.25), 0 0 0 10px rgba(184, 105, 181, 0.2);
```

**Hover state:**
```css
box-shadow: 0 30px 70px rgba(0,0,0,0.3), 0 0 0 12px rgba(184, 105, 181, 0.3);
```

**Mobile variant:**
```css
padding: 0.5rem; /* Mobile */
```

#### Fun Fact Card
```css
padding: 2rem 2.5rem;
border-radius: 15px;
background: linear-gradient(135deg, rgba(248, 249, 255, 0.95), rgba(255, 240, 248, 0.95));
border-left: 4px solid var(--secondary-color);
box-shadow: 0 4px 16px rgba(184, 105, 181, 0.1);
```

#### Quiz Card
```css
padding: 2rem 2.5rem;
border-radius: 15px;
background: linear-gradient(135deg, rgba(255, 247, 230, 0.95), rgba(255, 238, 248, 0.95));
border-left: 4px solid var(--accent-color);
box-shadow: 0 4px 16px rgba(184, 105, 181, 0.1);
```

### Prompt/Status Messages

#### Default Prompt
```css
text-align: center;
font-size: 1.15rem;
color: var(--secondary-color);
margin-top: 1.5rem;
font-weight: 500;
padding: 1.25rem 1.5rem;
background: linear-gradient(135deg, rgba(255, 182, 193, 0.12), rgba(221, 160, 221, 0.12));
border-radius: 15px;
border: 2px solid rgba(255, 182, 193, 0.3);
backdrop-filter: blur(5px);
line-height: 1.6;
min-height: 60px;
display: flex;
align-items: center;
justify-content: center;
```

#### Error State
```css
border-color: #ff6b6b;
background: rgba(255, 107, 107, 0.1);
color: #d63031;
```

#### Success State
```css
border-color: #55efc4;
background: rgba(85, 239, 196, 0.1);
color: #00b894;
```

#### Loading State
```css
/* Adds spinning indicator via ::after pseudo-element */
```

## Layout Principles

### Container Max-Width
- **Game Controls**: 1400px
- **Info Panels/Cards**: 600px
- **Map Container**: 100% (no max-width, uses padding)
- **Tablet**: 1000px (map max-width)

### Grid System
- **Grid columns**: `repeat(auto-fit, minmax(280px, 1fr))` (responsive)
- **Grid columns (mobile)**: `1fr` (single column)
- **Grid gap**: 2rem (desktop), 1.5rem (mobile)

### Section Padding
- **Top/Bottom**: 1rem - 2.5rem (varies by component)
- **Horizontal**: 1.5rem - 3rem (varies by component)
- **Mobile**: 0.5rem - 1.5rem (reduced)

### Breakpoints
- **Mobile**: 768px
- **Small Mobile**: 480px
- **Tablet**: 769px - 1024px
- **Desktop**: 1025px+

### Responsive Behavior
- **Mobile (< 768px)**: Single column layout, reduced padding, smaller fonts
- **Tablet (769px - 1024px)**: Adjusted container widths, medium padding
- **Desktop (> 1024px)**: Full layout with maximum spacing and sizing

## Transitions & Animations

### Timing Functions
- **ease-out**: `cubic-bezier(0.0, 0.0, 0.2, 1)`
- **ease-in-out**: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- **spring**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)`
- **standard**: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **bounce**: `cubic-bezier(0.22, 1, 0.36, 1)`
- **smooth**: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **elastic**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)`

### Durations
- **instant**: 0ms
- **fast**: 150ms
- **normal**: 300ms
- **standard**: 400ms
- **slow**: 500ms
- **very-slow**: 800ms
- **ultra-slow**: 1500ms

### Standard Transitions

#### Hover
- **Property**: `all`
- **Duration**: `400ms` (0.4s)
- **Easing**: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **Example**: `transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);`

#### Focus
- **Property**: `all`
- **Duration**: `400ms` (0.4s)
- **Easing**: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **Example**: `transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);`

#### Active
- **Property**: `transform`
- **Duration**: `instant` (0ms) or `100ms`
- **Easing**: `ease` or `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **Example**: `transform: translateY(0) scale(0.98);`

#### Special Transitions
- **Button shine effect**: `left 0.8s ease`
- **Card entry**: `all 0.4s ease-out`
- **Map container hover**: `transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)`
- **Game controls hover**: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1)`
- **Quiz button**: `all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)`
- **Link underline**: `width 0.3s ease`
- **Prompt state change**: `all 0.3s ease`

### Keyframe Animations
- **elegantSparkle**: `3s ease-in-out infinite` (sparkle effect)
- **slideUpFade**: `opacity + translateY` animation (card entry)
- **spin**: `1s linear infinite` (loading spinner)
- **rippleBlast**: `2.5s cubic-bezier(0.25, 1, 0.5, 1) infinite` (entry transition)
- **elegantFadeIn**: `1s cubic-bezier(0.22, 1, 0.36, 1) forwards` (player card entry)

## Implementation Rules

### DO (Glassmorphism/VIVELE Design Principles)

1. **Always use frosted glass overlays**: Apply `backdrop-filter: blur()` with semi-transparent backgrounds (`rgba(255, 255, 255, 0.65)`) to create depth and visual hierarchy. Never use fully opaque backgrounds for interactive elements.

2. **Maintain VIVELE color palette consistency**: Use the five-tone purple gradient system (`--vivele-deep` through `--vivele-pale`) for primary elements. Rose gold (`--rose-gold`) should only be used for accents and warm highlights.

3. **Apply layered shadows for depth**: Use multiple shadow layers (e.g., `0 8px 32px rgba(...), 0 2px 8px rgba(...)`) to create 3D elevation effects. Combine with inset shadows for inner depth.

4. **Use physics-based easing**: Always use `cubic-bezier()` functions for natural motion. Prefer `cubic-bezier(0.25, 0.8, 0.25, 1)` for standard transitions and `cubic-bezier(0.22, 1, 0.36, 1)` for bouncy effects.

5. **Implement border + outline pattern**: Use `border` for structure and `outline` for VIVELE accent color (`var(--vivele-mid)`). This creates the signature 3D frame effect.

6. **Maintain minimum 44px touch targets**: All interactive elements must meet WCAG AA standards. Use `min-height: 44px` and `min-width: 44px` for buttons and inputs.

7. **Apply backdrop-filter saturation**: Enhance glassmorphism with `saturate(160%)` or higher for richer color depth in glass panels.

8. **Use gradient backgrounds for cards**: Apply subtle gradients (`linear-gradient(135deg, rgba(...), rgba(...))`) to create visual interest without overwhelming content.

### DON'T (Anti-patterns)

1. **Never use flat colors without transparency**: Avoid solid `#ffffff` or `#000000` backgrounds. Always use `rgba()` with opacity for glassmorphism effects.

2. **Don't mix design systems**: Don't combine VIVELE purple palette with unrelated color schemes. Maintain design consistency across all components.

3. **Avoid hard shadows**: Never use single-layer, high-opacity shadows. Always layer multiple shadows with varying opacities for depth.

4. **Don't use linear transitions**: Avoid `linear` or `ease` timing functions. Always use `cubic-bezier()` for natural, physics-based motion.

5. **Never skip focus states**: All interactive elements must have visible focus indicators with `outline: 3px solid` and `outline-offset: 2px`.

6. **Don't use border-radius inconsistently**: Maintain the radius scale (15px, 20px, 25px, 30px). Don't mix arbitrary values like `8px` or `12px` unless specified.

7. **Avoid backdrop-filter without background**: Never apply `backdrop-filter: blur()` without a semi-transparent background. The blur needs content behind it to be visible.

8. **Don't ignore reduced motion preferences**: Always respect `@media (prefers-reduced-motion: reduce)` by setting animation durations to `0.01ms`.

## Interaction States

### State Definitions

#### Default State
```css
/* Base styling defined in component specifications above */
opacity: 1;
transform: none;
transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
```

#### Hover State
```css
opacity: 1; /* Maintain full opacity */
transform: translateY(-2px) scale(1.02); /* Subtle lift and scale */
transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
box-shadow: 0 12px 40px rgba(184, 105, 181, 0.25), 0 4px 12px rgba(184, 105, 181, 0.15);
background: rgba(255, 255, 255, 0.75); /* Slightly more opaque for glass effect */
```

**Button hover:**
```css
background: var(--rose-gold);
color: #fff;
transform: translateY(-2px) scale(1.02);
box-shadow: 0 12px 40px rgba(184, 105, 181, 0.25), 0 4px 12px rgba(184, 105, 181, 0.15);
outline: 3px solid rgba(183, 110, 121, 0.4);
outline-offset: 2px;
```

**Card hover:**
```css
background: rgba(255, 255, 255, 0.7);
transform: translateY(-4px) scale(1.02);
box-shadow: 0 10px 30px rgba(183, 110, 121, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.5);
border-color: rgba(255, 182, 193, 0.8);
```

#### Active/Pressed State
```css
transform: translateY(0) scale(0.98); /* Pressed down effect */
box-shadow: 0 4px 16px rgba(184, 105, 181, 0.1); /* Reduced shadow */
transition: transform 0.1s cubic-bezier(0.25, 0.8, 0.25, 1);
```

**Button active:**
```css
transform: translateY(0) scale(0.98);
background: var(--rose-gold-dark); /* Darker shade */
```

#### Focus State
```css
outline: 3px solid rgba(183, 110, 121, 0.5);
outline-offset: 2px;
border-radius: 2px;
border-color: var(--rose-gold);
box-shadow: 0 0 0 4px rgba(183, 110, 121, 0.15), 0 0 20px rgba(225, 130, 228, 0.4);
transform: translateY(-1px);
background: rgba(255, 255, 255, 1); /* Full opacity on focus */
```

**Input focus:**
```css
outline: 3px solid rgba(183, 110, 121, 0.3);
outline-offset: 2px;
border-color: var(--rose-gold);
box-shadow: 0 0 0 4px rgba(183, 110, 121, 0.15), 0 0 20px rgba(225, 130, 228, 0.4);
transform: translateY(-1px);
background: rgba(255, 255, 255, 1);
```

**Range slider thumb focus:**
```css
transform: scale(1.3);
box-shadow: 0 6px 20px rgba(183, 110, 121, 0.5);
outline: 3px solid rgba(183, 110, 121, 0.3);
outline-offset: 2px;
```

#### Disabled State
```css
opacity: 0.6;
cursor: not-allowed;
filter: grayscale(0.3); /* Subtle desaturation */
pointer-events: none;
background: rgba(255, 255, 255, 0.4); /* More transparent */
border-color: rgba(183, 110, 121, 0.2);
```

**Button disabled:**
```css
opacity: 0.6;
cursor: not-allowed;
background: rgba(227, 230, 243, 0.5);
border-color: rgba(183, 110, 121, 0.3);
color: rgba(183, 110, 121, 0.5);
transform: none;
box-shadow: none;
```

**Quiz button disabled:**
```css
opacity: 0.7;
cursor: default;
background: white;
border-color: rgba(204, 114, 196, 0.3);
```

#### Loading State
```css
opacity: 0.6;
pointer-events: none;
position: relative;
```

**Loading spinner:**
```css
/* Via ::after pseudo-element */
content: '';
position: absolute;
top: 50%;
left: 50%;
width: 20px;
height: 20px;
margin: -10px 0 0 -10px;
border: 3px solid var(--rose-gold);
border-top-color: transparent;
border-radius: 50%;
animation: spin 0.8s linear infinite;
```

**Prompt loading:**
```css
/* Via ::after pseudo-element */
content: '';
display: inline-block;
width: 12px;
height: 12px;
margin-left: 10px;
border: 2px solid var(--rose-gold);
border-radius: 50%;
border-top-color: transparent;
animation: spin 1s linear infinite;
```

**Skeleton screen (for cards):**
```css
background: linear-gradient(90deg, 
  rgba(255, 255, 255, 0.1) 0%, 
  rgba(255, 255, 255, 0.3) 50%, 
  rgba(255, 255, 255, 0.1) 100%);
background-size: 200% 100%;
animation: skeleton-loading 1.5s ease-in-out infinite;
```

#### Error State
```css
border-color: #ff6b6b;
background-color: rgba(255, 107, 107, 0.1);
color: #d63031;
```

**Prompt error:**
```css
border-color: #ff6b6b;
background: rgba(255, 107, 107, 0.1);
color: #d63031;
box-shadow: 0 4px 16px rgba(255, 107, 107, 0.2);
```

**Input error:**
```css
border-color: #ff6b6b;
background: rgba(255, 107, 107, 0.05);
box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.15);
```

**Quiz button wrong:**
```css
background: linear-gradient(135deg, #ff5f6d, #ffc371);
color: white;
border-color: transparent;
opacity: 0.8;
box-shadow: 0 0 15px rgba(255, 95, 109, 0.4);
```

**Error message text:**
```css
color: #ff5f6d;
font-weight: 800;
display: block;
margin-top: 1rem;
font-size: 1.2rem;
```

#### Success State
```css
border-color: #55efc4;
background-color: rgba(85, 239, 196, 0.1);
color: #00b894;
```

**Prompt success:**
```css
border-color: #55efc4;
background: rgba(85, 239, 196, 0.1);
color: #00b894;
box-shadow: 0 4px 16px rgba(85, 239, 196, 0.2);
```

**Quiz button correct:**
```css
background: linear-gradient(135deg, #00b09b, #96c93d);
color: white;
border-color: transparent;
box-shadow: 0 0 15px rgba(0, 176, 155, 0.4);
```

**Success message text:**
```css
color: #00b09b;
font-weight: 800;
display: block;
margin-top: 1rem;
font-size: 1.2rem;
```

**Round dot completed:**
```css
background: var(--success-color); /* #98d8c8 */
transform: scale(1.2);
```

#### Selected/Active Card State
```css
background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,245,248,0.9));
border: 2px solid var(--rose-gold);
box-shadow: 0 0 25px rgba(183, 110, 121, 0.3);
```

**Player card active:**
```css
border: 3px solid var(--rose-gold);
box-shadow: 0 12px 40px rgba(184, 105, 181, 0.25), 0 4px 12px rgba(184, 105, 181, 0.15);
transform: translateY(-2px) scale(1.02);
```

**Round dot active:**
```css
background: var(--rose-gold);
transform: scale(1.2);
```

## Accessibility

### Touch Targets
- **Minimum size**: 44px × 44px (WCAG AA compliant)
- **Recommended**: 48px × 48px for primary actions

### Focus States
```css
outline: 3px solid rgba(183, 110, 121, 0.5);
outline-offset: 2px;
border-radius: 2px;
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  /* Increased border widths and stronger colors */
  border-width: 4px;
  border-color: #000;
}
```

## Bulma Integration

### Framework Setup
Bulma CSS framework is included via CDN for utility classes and responsive grid system. Custom VIVELE design system styles take precedence over Bulma defaults.

### Bulma Classes Used
- Grid system: `.columns`, `.column` (optional, can use custom grid)
- Utilities: `.is-hidden`, `.is-fullwidth` (if needed)
- Responsive helpers: `.is-mobile`, `.is-tablet`, `.is-desktop` (optional)

### Custom Overrides
All VIVELE design system components override Bulma defaults to maintain glassmorphism aesthetic. Bulma is primarily used for:
- Base typography normalization
- Responsive utilities
- Flexbox/Grid utilities (if needed)

### Migration Notes
- Bulma buttons are overridden with custom VIVELE button styles
- Bulma form inputs are overridden with glassmorphism input styles
- Bulma cards are replaced with custom VIVELE card components
- Maintain VIVELE color palette and effects over Bulma defaults
