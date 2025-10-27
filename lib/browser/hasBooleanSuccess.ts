/**
 * Type guard: Check if a value has a boolean success property
 * Used to properly type-check browser operation results
 */
export function hasBooleanSuccess(x: unknown): x is { success: boolean } {
  return (
    typeof x === "object" && 
    x !== null && 
    "success" in x && 
    typeof (x as { success: unknown }).success === "boolean"
  );
}

