# Centralized Styling System

This directory contains the centralized styling utilities for the Recoup Chat application. The system follows a layered approach to maintain consistency while allowing flexibility.

## 📁 File Structure

```
lib/styles/
├── patterns.ts        # Reusable UI pattern combinations
├── darkModeUtils.ts   # Dark mode utility functions
└── README.md          # This file
```

## 🎯 Purpose

The refactored styling system addresses several key issues:
- **DRY Compliance**: Eliminates duplication of dark mode styling across 70+ components
- **Maintainability**: Changes can be made in one place and propagate throughout the app
- **Consistency**: Ensures uniform UI patterns across all components
- **Type Safety**: TypeScript-based patterns with IntelliSense support
- **Performance**: Reduces bundle size by reusing class combinations

## 📚 Usage

### patterns.ts

Contains reusable pattern combinations for common UI elements:

```typescript
import { buttonPatterns, textPatterns, containerPatterns } from '@/lib/styles/patterns';
import { cn } from '@/lib/utils';

// Button patterns
<button className={buttonPatterns.primary}>Save</button>
<button className={buttonPatterns.danger}>Delete</button>
<button className={buttonPatterns.ghost}>Cancel</button>

// Text patterns
<h2 className={textPatterns.heading}>Title</h2>
<p className={textPatterns.secondary}>Description</p>
<span className={textPatterns.muted}>Hint</span>

// Container patterns
<div className={containerPatterns.card}>Card content</div>
<div className={containerPatterns.modal}>Modal content</div>
<div className={containerPatterns.dropdown}>Menu items</div>

// Combining patterns with custom classes
<button className={cn(buttonPatterns.primary, "w-full")}>
  Full Width Button
</button>
```

### darkModeUtils.ts

Contains utility functions for common dark mode patterns:

```typescript
import { getButtonClasses, getInputClasses, getCardClasses } from '@/lib/styles/darkModeUtils';

// Utility functions with dynamic parameters
<button className={getButtonClasses('primary')}>Save</button>
<button className={getButtonClasses('danger')}>Delete</button>

<input className={getInputClasses(hasError)} />

<div className={getCardClasses(true)}>Interactive card</div>
```

## 🎨 Available Patterns

### Button Patterns
- `primary` - Default button style
- `danger` - Destructive actions
- `ghost` - Subtle, transparent buttons
- `icon` - Icon-only buttons

### Form Patterns
- `input` - Text inputs
- `label` - Form labels
- `error` - Error messages
- `textarea` - Multi-line text inputs

### Container Patterns
- `card` - Content cards
- `cardHover` - Interactive cards
- `modal` - Modal dialogs
- `modalOverlay` - Modal backdrops
- `sidebar` - Sidebar containers
- `dropdown` - Dropdown menus

### Text Patterns
- `primary` - Primary text color
- `secondary` - Secondary text color
- `muted` - Muted/subtle text
- `placeholder` - Placeholder text
- `heading` - Heading text
- `error` - Error text
- `success` - Success text

### Icon Patterns
- `primary` - Primary icon color
- `secondary` - Secondary icon color
- `muted` - Muted icon color
- `error` - Error icon color
- `success` - Success icon color

### Border Patterns
- `default` - Default borders
- `light` - Light borders
- `focus` - Focus state borders
- `divider` - Divider lines

### State Patterns
- `hover` - Hover states
- `active` - Active states
- `selected` - Selected states
- `disabled` - Disabled states
- `focus` - Focus states

### Loading Patterns
- `skeleton` - Skeleton loaders
- `shimmer` - Shimmer effects
- `spinner` - Loading spinners

## 🔧 Utility Functions

### combinePatterns()

Combines multiple pattern strings with custom classes:

```typescript
import { combinePatterns, buttonPatterns, borderPatterns } from '@/lib/styles/patterns';

const classes = combinePatterns(
  buttonPatterns.primary,
  borderPatterns.default,
  "w-full py-2"
);
```

### Dark Mode Utilities

```typescript
// Input with error state
<input className={getInputClasses(true)} />  // Shows error styling

// Interactive card
<div className={getCardClasses(true)}>      // Adds hover effects
  Card content
</div>

// Button variants
<button className={getButtonClasses('danger')}>Delete</button>
```

## 🎯 Best Practices

### ✅ DO:

1. **Use patterns for common UI elements**:
   ```typescript
   <button className={buttonPatterns.primary}>Save</button>
   ```

2. **Combine patterns with custom classes using `cn()`**:
   ```typescript
   <button className={cn(buttonPatterns.primary, "w-full mt-4")}>
     Submit
   </button>
   ```

3. **Extract repetitive class combinations**:
   ```typescript
   // Bad: Repeated everywhere
   <div className="bg-white dark:bg-dark-bg-tertiary border border-grey dark:border-dark-border">

   // Good: Use pattern
   <div className={containerPatterns.card}>
   ```

### ❌ DON'T:

1. **Don't hardcode dark mode classes directly**:
   ```typescript
   // Bad
   <div className="text-gray-900 dark:text-dark-text-primary">
   
   // Good
   <div className={textPatterns.primary}>
   ```

2. **Don't create one-off patterns**:
   ```typescript
   // Bad: Too specific
   <div className={mySpecificComponentPatterns.uniqueStyle}>
   
   // Good: Use patterns + custom classes
   <div className={cn(containerPatterns.card, "max-w-md mx-auto")}>
   ```

3. **Don't skip `cn()` when combining classes**:
   ```typescript
   // Bad: String concatenation
   <div className={`${buttonPatterns.primary} w-full`}>
   
   // Good: Use cn() for proper merging
   <div className={cn(buttonPatterns.primary, "w-full")}>
   ```

## 🔄 Migration Guide

To migrate existing components to use the centralized system:

1. **Import patterns**:
   ```typescript
   import { buttonPatterns, textPatterns } from '@/lib/styles/patterns';
   import { cn } from '@/lib/utils';
   ```

2. **Replace hardcoded classes**:
   ```typescript
   // Before
   <button className="bg-gray-50 dark:bg-dark-bg-hover hover:bg-gray-100 dark:hover:bg-dark-bg-active text-gray-900 dark:text-dark-text-primary transition-colors">
   
   // After
   <button className={buttonPatterns.primary}>
   ```

3. **Combine with custom classes**:
   ```typescript
   // Before
   <button className="bg-gray-50 dark:bg-dark-bg-hover hover:bg-gray-100 dark:hover:bg-dark-bg-active text-gray-900 dark:text-dark-text-primary transition-colors w-full py-2">
   
   // After
   <button className={cn(buttonPatterns.primary, "w-full py-2")}>
   ```

## 📝 Adding New Patterns

When adding new patterns:

1. Check if existing patterns can be reused
2. Add to appropriate section in `patterns.ts`
3. Use descriptive names: `cardPatterns.interactive` not `cardPatterns.style1`
4. Include dark mode variants
5. Document usage in this README

Example:

```typescript
export const buttonPatterns = {
  // ... existing patterns
  
  // New pattern
  outline: "border-2 border-primary dark:border-dark-border hover:bg-primary/10 dark:hover:bg-dark-bg-hover text-primary dark:text-dark-text-primary transition-colors",
} as const;
```

## 🐛 Troubleshooting

### Pattern not applying correctly
- Ensure you're importing from the correct path
- Check if you're using `cn()` to merge classes
- Verify Tailwind is processing the pattern file

### Dark mode not working
- Confirm `next-themes` provider is set up
- Check that CSS variables are defined in `globals.css`
- Verify `dark:` variants are included in patterns

### Type errors
- Ensure patterns are typed with `as const`
- Check imports are correct
- Verify `cn()` is imported from `@/lib/utils`

## 📊 Impact

The centralized styling system:
- Reduced dark mode duplication from 70+ files to 2 files
- Improved consistency across the application
- Simplified future styling updates
- Reduced bundle size through class reuse
- Enhanced type safety with TypeScript

## 🔗 Related Files

- `app/globals.css` - CSS variables and @layer directives
- `tailwind.config.ts` - Tailwind theme configuration
- `lib/utils.ts` - `cn()` utility for class merging

