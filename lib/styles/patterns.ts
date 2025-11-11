/**
 * Centralized UI patterns for consistent styling across the application.
 * These patterns combine Tailwind classes for common component styles.
 * 
 * Usage:
 * import { buttonPatterns, cardPatterns } from '@/lib/styles/patterns';
 * <button className={buttonPatterns.primary}>Save</button>
 */

// ============================================================================
// Button Patterns
// ============================================================================

export const buttonPatterns = {
  primary: "bg-gray-50 dark:bg-dark-bg-hover hover:bg-gray-100 dark:hover:bg-dark-bg-active text-gray-900 dark:text-dark-text-primary transition-colors",
  
  danger: "text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
  
  ghost: "hover:bg-gray-100 dark:hover:bg-dark-bg-hover transition-colors",
  
  icon: "p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-bg-hover rounded-full transition-colors",
} as const;

// ============================================================================
// Form Patterns
// ============================================================================

export const formPatterns = {
  input: "w-full !outline-none border border-grey dark:border-dark-border bg-white dark:bg-dark-bg-input text-gray-900 dark:text-dark-text-primary placeholder:text-gray-500 dark:placeholder:text-dark-text-placeholder rounded-md focus:ring-1 focus:ring-gray-400 dark:focus:ring-dark-border-focus",
  
  label: "text-sm text-gray-700 dark:text-dark-text-secondary",
  
  error: "!text-red-700 dark:!text-red-400 text-sm",
  
  textarea: "flex min-h-[60px] w-full rounded-md border border-input dark:border-dark-border bg-transparent dark:bg-dark-bg-input text-gray-900 dark:text-dark-text-primary placeholder:text-muted-foreground dark:placeholder:text-dark-text-placeholder focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:focus-visible:ring-dark-border-focus",
} as const;

// ============================================================================
// Card/Container Patterns
// ============================================================================

export const containerPatterns = {
  card: "bg-white dark:bg-dark-bg-tertiary border border-grey dark:border-dark-border rounded-md",
  
  cardHover: "bg-white dark:bg-dark-bg-tertiary border border-grey dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-dark-bg-hover transition-colors",
  
  modal: "bg-white dark:bg-dark-bg-tertiary border border-grey dark:border-dark-border rounded-2xl md:rounded-md",
  
  modalOverlay: "fixed left-0 top-0 w-screen h-screen z-[1000] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm",
  
  sidebar: "bg-white dark:bg-dark-bg-secondary border-r border-grey dark:border-dark-border",
  
  dropdown: "border dark:border-dark-border bg-white dark:bg-dark-bg-tertiary rounded-md shadow-lg dark:shadow-lg",
} as const;

// ============================================================================
// Text Patterns
// ============================================================================

export const textPatterns = {
  primary: "text-gray-900 dark:text-dark-text-primary",
  
  secondary: "text-gray-700 dark:text-dark-text-secondary",
  
  muted: "text-gray-600 dark:text-dark-text-muted",
  
  placeholder: "text-gray-500 dark:text-dark-text-placeholder",
  
  heading: "text-gray-900 dark:text-dark-text-primary font-medium",
  
  error: "text-red-700 dark:text-red-400",
  
  success: "text-green-600 dark:text-green-400",
} as const;

// ============================================================================
// Icon Patterns
// ============================================================================

export const iconPatterns = {
  primary: "text-gray-700 dark:text-dark-text-primary",
  
  secondary: "text-gray-600 dark:text-dark-text-secondary",
  
  muted: "text-grey-dark dark:text-dark-text-muted",
  
  error: "text-red-700 dark:text-red-400",
  
  success: "text-green-600 dark:text-green-400",
} as const;

// ============================================================================
// Border Patterns
// ============================================================================

export const borderPatterns = {
  default: "border border-grey dark:border-dark-border",
  
  light: "border border-grey dark:border-dark-border-light",
  
  focus: "border border-grey dark:border-dark-border focus:border-gray-400 dark:focus:border-dark-border-focus",
  
  divider: "border-b border-grey dark:border-dark-border",
} as const;

// ============================================================================
// Interactive State Patterns
// ============================================================================

export const statePatterns = {
  hover: "hover:bg-grey-light-1 dark:hover:bg-dark-bg-hover",
  
  active: "bg-grey-light-1 dark:bg-dark-bg-active",
  
  selected: "bg-primary/10 dark:bg-dark-bg-hover",
  
  disabled: "opacity-50 cursor-not-allowed",
  
  focus: "focus:ring-1 focus:ring-gray-400 dark:focus:ring-dark-border-focus focus:outline-none",
} as const;

// ============================================================================
// Skeleton/Loading Patterns
// ============================================================================

export const loadingPatterns = {
  skeleton: "animate-pulse bg-gray-200 dark:bg-dark-bg-tertiary rounded-md",
  
  shimmer: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-dark-bg-tertiary dark:via-dark-bg-hover dark:to-dark-bg-tertiary",
  
  spinner: "animate-spin text-gray-600 dark:text-dark-text-muted",
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Combine multiple pattern classes with custom classes
 * @param patterns - Array of pattern strings
 * @param customClasses - Additional custom classes
 */
export const combinePatterns = (...patterns: string[]): string => {
  return patterns.filter(Boolean).join(" ");
};

