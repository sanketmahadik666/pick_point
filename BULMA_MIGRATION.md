# Bulma CSS Framework Integration

## Overview

The Eureka project now includes **Bulma CSS Framework** (v0.9.4) via CDN for utility classes and responsive grid system, while maintaining the custom **VIVELE Design System** with glassmorphism effects.

## Integration Details

### CDN Link
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css" />
```

### Load Order
1. Google Fonts (Playfair Display, Quicksand)
2. **Bulma CSS Framework** (base utilities)
3. Custom VIVELE styles (`style.css`)
4. Entry transitions (`entry-transition.css`)
5. Story guide styles (`story-guide.css`)

## Usage Strategy

### What Bulma Provides
- Base typography normalization
- Responsive utility classes
- Flexbox/Grid utilities (optional)
- Form normalization
- Helper classes (`.is-hidden`, `.is-fullwidth`, etc.)

### What VIVELE Overrides
- **Buttons**: Custom glassmorphism buttons with VIVELE gradients
- **Inputs**: Custom glassmorphism inputs with backdrop-filter
- **Cards**: Custom VIVELE cards with 3D effects
- **Colors**: VIVELE purple palette overrides Bulma's default colors
- **Shadows**: Custom multi-layer shadow system
- **Borders**: Custom border + outline pattern

## Implementation Approach

### Hybrid Strategy
- Use Bulma for **utilities** and **base normalization**
- Use VIVELE for **all visual components** and **interactive elements**
- Maintain VIVELE design system as the primary visual language

### Example Usage

#### ✅ Good: Using Bulma utilities with VIVELE components
```html
<div class="columns is-mobile">
  <div class="column">
    <button class="vivele-button">Custom VIVELE Button</button>
  </div>
</div>
```

#### ❌ Avoid: Using Bulma components directly
```html
<!-- Don't use Bulma's default button -->
<button class="button is-primary">Bulma Button</button>

<!-- Use VIVELE button instead -->
<button class="vivele-button">VIVELE Button</button>
```

## Migration Checklist

- [x] Bulma CDN added to `index.html`
- [x] Load order verified (Bulma before custom styles)
- [x] VIVELE design system documented
- [x] Implementation rules defined
- [x] Interaction states documented
- [x] Bulma overrides CSS file created
- [x] HTML structure updated with Bulma classes
- [x] Player cards migrated to Bulma grid system
- [x] Form inputs use Bulma field/control structure
- [x] Buttons use Bulma button class with VIVELE overrides
- [x] Hidden class compatibility maintained
- [ ] Test Bulma utilities with VIVELE components
- [ ] Verify no visual conflicts
- [ ] Test responsive behavior
- [ ] Update JavaScript if needed for class changes

## Benefits

1. **Responsive Utilities**: Access to Bulma's responsive helper classes
2. **Base Normalization**: Consistent cross-browser base styles
3. **Grid System**: Optional use of Bulma's grid (or keep custom grid)
4. **Maintainability**: Well-documented framework for team reference
5. **Flexibility**: Can leverage Bulma utilities without losing VIVELE aesthetic

## Notes

- Bulma's default colors and components are intentionally overridden
- VIVELE design system takes visual precedence
- Bulma serves as a foundation, not the visual layer
- All interactive elements use VIVELE glassmorphism styling
