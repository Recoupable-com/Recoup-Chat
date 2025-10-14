import { z } from "zod";

/**
 * Converts a plain object schema to a Zod schema
 * Allows passing schema definitions from tool calls as simple objects
 */
export function schemaToZod(schema: Record<string, string>): z.ZodObject<z.ZodRawShape> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, type] of Object.entries(schema)) {
    if (typeof type === "string") {
      switch (type.toLowerCase()) {
        case "string":
          shape[key] = z.string();
          break;
        case "number":
          shape[key] = z.number();
          break;
        case "boolean":
          shape[key] = z.boolean();
          break;
        case "array":
          shape[key] = z.array(z.unknown());
          break;
        default:
          shape[key] = z.unknown();
      }
    } else {
      shape[key] = z.unknown();
    }
  }

  return z.object(shape);
}

