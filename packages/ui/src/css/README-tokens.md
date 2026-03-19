# RI Design Tokens

This directory contains the Réfugiés.info design tokens that replace SCSS variables and functions.

## Files

| File | Purpose |
|------|---------|
| `ri-tokens.css` | CSS custom properties for spacing, typography, breakpoints, colors |
| `dsfr-tokens.css` | DSFR (French government) design system tokens |
| `globals-ui.css` | Main entry point - imports all tokens |

## Usage

### In CSS

```css
/* Spacing - replaces u() function */
padding: var(--u-4);        /* was: u(4) → 16px */
margin: var(--u-6);         /* was: u(6) → 24px */

/* Typography - replaces dsfr-text() mixin */
font: var(--text-normal);   /* was: @include dsfr-text(normal) */
font: var(--text-h2);       /* was: @include dsfr-text(h2) */

/* Colors - replaces SCSS variables */
color: var(--color-blue);           /* was: $blue */
background: var(--color-gray-20);   /* was: $gray20 */

/* Breakpoints - use in media queries */
@media (min-width: 48em) { }  /* var(--breakpoint-tablet-up) */
```

### In TypeScript

```typescript
import { colors, spacing, typography, u, mediaMin } from "@refugies-info/ui/tokens";

// Colors
const primaryColor = colors.blue;        // "#0a54bf"
const errorColor = colors.error;        // "#f44336"

// Spacing helper (same as SCSS u() function)
const padding = u(4);  // 16

// Typography
const fontSize = typography.normal.fontSize;  // 16
const lineHeight = typography.normal.lineHeight;  // 24

// Media queries (for JS-in-CSS)
const tabletAndUp = mediaMin("tabletUp"); // => "@media (min-width: 48em)"
```

## Token Reference

### Spacing (`--u-*`)

Based on 4px base unit. Value = multiplier × 4px.

| Token | Value | Used for |
|-------|-------|----------|
| `--u-1` | 4px | Tight spacing |
| `--u-2` | 8px | Small gaps |
| `--u-3` | 12px | Medium spacing |
| `--u-4` | 16px | Standard padding |
| `--u-6` | 24px | Section spacing |
| `--u-8` | 32px | Large gaps |
| `--u-12` | 48px | Major sections |

### Typography (`--text-*`)

DSFR-compliant typography with pixel values.

| Token | Font size | Line height |
|-------|-----------|-------------|
| `--text-very-small` | 12px | 20px |
| `--text-small` | 14px | 24px |
| `--text-normal` | 16px | 24px |
| `--text-large` | 18px | 28px |
| `--text-h4` | 24px | 32px |
| `--text-h3` | 28px | 36px |
| `--text-h2` | 32px | 40px |
| `--text-h1` | 40px | 48px |

### Breakpoints (`--breakpoint-*`)

Em-based for accessibility (better with user font scaling).

| Token | Value | Pixels |
|-------|-------|--------|
| `--breakpoint-tablet-up` | 48em | 768px |
| `--breakpoint-desktop-up` | 64em | 1024px |
| `--breakpoint-xl-limit` | 75em | 1200px |

### Colors (`--color-*`)

RI brand colors. DSFR colors available in `dsfr-tokens.css`.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-blue` | #0a54bf | Primary brand |
| `--color-bleu-charte` | #0421b1 | Charter blue |
| `--color-green` | #137f3a | Success |
| `--color-orange` | #ff9800 | Warning |
| `--color-error` | #f44336 | Error state |

## Migration from SCSS

When migrating from SCSS to CSS:

1. **Replace `u()` function**:
   ```scss
   // Before (SCSS)
   padding: u(4);
   
   // After (CSS)
   padding: var(--u-4);
   ```

2. **Replace `dsfr-text()` mixin**:
   ```scss
   // Before (SCSS)
   @include dsfr-text(normal);
   
   // After (CSS)
   font: var(--text-normal);
   ```

3. **Replace color variables**:
   ```scss
   // Before (SCSS)
   color: $blue;
   
   // After (CSS)
   color: var(--color-blue);
   ```

4. **Replace `:export` pattern**:
   ```typescript
   // Before (via SCSS :export)
   import { colors } from "~/utils/colors";
   
   // After (via TypeScript)
   import { colors } from "@refugies-info/ui/tokens";
   ```
