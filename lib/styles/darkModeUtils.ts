/**
 * Dark mode utility functions and common class combinations.
 * These utilities help reduce duplication of dark mode styling patterns.
 */

// ============================================================================
// Background Utilities
// ============================================================================

export const bgUtils = {
  primary: "bg-white dark:bg-dark-bg-primary",
  secondary: "bg-grey-secondary dark:bg-dark-bg-secondary",
  tertiary: "bg-white dark:bg-dark-bg-tertiary",
  input: "bg-white dark:bg-dark-bg-input",
  hover: "hover:bg-gray-100 dark:hover:bg-dark-bg-hover",
  active: "bg-gray-100 dark:bg-dark-bg-active",
} as const;

// ============================================================================
// Text Color Utilities
// ============================================================================

export const textUtils = {
  primary: "text-gray-900 dark:text-dark-text-primary",
  secondary: "text-gray-700 dark:text-dark-text-secondary",
  muted: "text-gray-600 dark:text-dark-text-muted",
  placeholder: "text-gray-500 dark:text-dark-text-placeholder",
} as const;

// ============================================================================
// Border Utilities
// ============================================================================

export const borderUtils = {
  default: "border-grey dark:border-dark-border",
  light: "border-grey dark:border-dark-border-light",
  focus: "focus:border-gray-400 dark:focus:border-dark-border-focus",
} as const;

// ============================================================================
// Shadow Utilities
// ============================================================================

export const shadowUtils = {
  sm: "shadow-sm dark:shadow-sm",
  md: "shadow-md dark:shadow-lg",
  lg: "shadow-lg dark:shadow-xl",
} as const;

// ============================================================================
// Component-Specific Utilities
// ============================================================================

/**
 * Common input field styling with dark mode support
 */
export const getInputClasses = (hasError = false): string => {
  const base = "w-full border rounded-md px-3 py-2 bg-white dark:bg-dark-bg-input text-gray-900 dark:text-dark-text-primary placeholder:text-gray-500 dark:placeholder:text-dark-text-placeholder focus:outline-none focus:ring-1";
  
  if (hasError) {
    return `${base} border-red-700 dark:border-red-400 focus:ring-red-700 dark:focus:ring-red-400`;
  }
  
  return `${base} border-grey dark:border-dark-border focus:ring-gray-400 dark:focus:ring-dark-border-focus`;
};

/**
 * Common button styling with dark mode support
 */
export const getButtonClasses = (variant: 'primary' | 'danger' | 'ghost' = 'primary'): string => {
  const base = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gray-50 dark:bg-dark-bg-hover hover:bg-gray-100 dark:hover:bg-dark-bg-active text-gray-900 dark:text-dark-text-primary border border-grey dark:border-dark-border focus:ring-gray-400 dark:focus:ring-dark-border-focus",
    danger: "text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-grey dark:border-dark-border focus:ring-red-700 dark:focus:ring-red-400",
    ghost: "hover:bg-gray-100 dark:hover:bg-dark-bg-hover text-gray-900 dark:text-dark-text-primary focus:ring-gray-400 dark:focus:ring-dark-border-focus",
  };
  
  return `${base} ${variants[variant]}`;
};

/**
 * Common card/container styling with dark mode support
 */
export const getCardClasses = (interactive = false): string => {
  const base = "bg-white dark:bg-dark-bg-tertiary border border-grey dark:border-dark-border rounded-md";
  
  if (interactive) {
    return `${base} hover:bg-gray-50 dark:hover:bg-dark-bg-hover transition-colors cursor-pointer`;
  }
  
  return base;
};

/**
 * Common dropdown/menu styling with dark mode support
 */
export const getDropdownClasses = (): string => {
  return "bg-white dark:bg-dark-bg-tertiary border border-grey dark:border-dark-border rounded-md shadow-lg dark:shadow-lg";
};

/**
 * Common modal overlay styling with dark mode support
 */
export const getModalOverlayClasses = (): string => {
  return "fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm";
};

/**
 * Common skeleton loader styling with dark mode support
 */
export const getSkeletonClasses = (): string => {
  return "animate-pulse bg-gray-200 dark:bg-dark-bg-tertiary rounded-md";
};

/**
 * Icon wrapper with dark mode support
 */
export const getIconClasses = (variant: 'primary' | 'secondary' | 'muted' = 'primary'): string => {
  const variants = {
    primary: "text-gray-700 dark:text-dark-text-primary",
    secondary: "text-gray-600 dark:text-dark-text-secondary",
    muted: "text-grey-dark dark:text-dark-text-muted",
  };
  
  return variants[variant];
};

