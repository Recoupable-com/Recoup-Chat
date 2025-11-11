# Dark Mode Theming Guide

## Quick Theme Testing

You can now test different dark mode color schemes by editing just **ONE file**: `app/globals.css`

### Where to Change Colors

Look for this section in `app/globals.css`:

```css
/* Dark Mode Theme Colors - Change these to test different shades! */
--dark-bg-primary: #0a0a0a;     /* Main background */
--dark-bg-secondary: #1a1a1a;   /* Sidebar background */
--dark-bg-tertiary: #2a2a2a;    /* Component backgrounds */
--dark-bg-hover: #333;          /* Hover states */
--dark-border: #333;            /* Borders */
--dark-border-light: #444;      /* Light borders */
--dark-text-primary: #ffffff;   /* Primary text */
--dark-text-secondary: #e5e5e5; /* Secondary text */
--dark-text-muted: #a1a1a1;     /* Muted text */
```

### How to Use in Components

Instead of hardcoding colors like `dark:bg-[#0a0a0a]`, use the theme classes:

**OLD WAY** (hardcoded):
```tsx
<div className="bg-white dark:bg-[#0a0a0a]">
```

**NEW WAY** (using theme variables):
```tsx
<div className="bg-white dark:bg-dark-bg-primary">
```

### Available Theme Classes

**Backgrounds:**
- `dark:bg-dark-bg-primary` - Main background (#0a0a0a)
- `dark:bg-dark-bg-secondary` - Sidebar (#1a1a1a)
- `dark:bg-dark-bg-tertiary` - Components (#2a2a2a)
- `dark:bg-dark-bg-hover` - Hover states (#333)

**Borders:**
- `dark:border-dark-border` - Default borders (#333)
- `dark:border-dark-border-light` - Light borders (#444)

**Text:**
- `dark:text-dark-text-primary` - Primary text (#ffffff)
- `dark:text-dark-text-secondary` - Secondary text (#e5e5e5)
- `dark:text-dark-text-muted` - Muted text (#a1a1a1)

## Testing Different Themes

### Option 1: Try a Blue-tinted Dark Theme
```css
--dark-bg-primary: #0f1419;
--dark-bg-secondary: #1a1f2e;
--dark-bg-tertiary: #252d3d;
--dark-bg-hover: #2d3748;
--dark-border: #374151;
--dark-border-light: #4b5563;
```

### Option 2: Try a Warmer Dark Theme
```css
--dark-bg-primary: #1a1412;
--dark-bg-secondary: #2a211e;
--dark-bg-tertiary: #3a2e2a;
--dark-bg-hover: #4a3b36;
--dark-border: #3a2e2a;
--dark-border-light: #4a3b36;
```

### Option 3: Try Pure Blacks (Current)
```css
--dark-bg-primary: #0a0a0a;
--dark-bg-secondary: #1a1a1a;
--dark-bg-tertiary: #2a2a2a;
--dark-bg-hover: #333;
--dark-border: #333;
--dark-border-light: #444;
```

## Testing Workflow

1. Open `app/globals.css`
2. Find the "Dark Mode Theme Colors" section
3. Change the hex values to test different shades
4. Save the file
5. Your browser will hot-reload with the new colors instantly!

## Example: Testing a Different Theme

Let's say you want to try slightly lighter grays:

```css
/* In app/globals.css, change from: */
--dark-bg-primary: #0a0a0a;
--dark-bg-secondary: #1a1a1a;
--dark-bg-tertiary: #2a2a2a;

/* To: */
--dark-bg-primary: #1a1a1a;
--dark-bg-secondary: #2a2a2a;
--dark-bg-tertiary: #3a3a3a;
```

Save, and all components using `dark:bg-dark-bg-primary`, etc. will update automatically!

## Benefits

✅ Change entire theme by editing ONE file
✅ Test different color schemes instantly
✅ Consistent colors across all components
✅ Easy to maintain and update
✅ CSS variables cascade properly
✅ No need to update hundreds of files

