import { z } from 'zod';

/**
 * Recursively strips keys from an object that are not defined in the Zod schema.
 * This ensures we never return properties that weren't requested.
 */
export function stripToSchema<T extends z.ZodObject<any>>(
  data: unknown,
  schema: T
): z.infer<T> {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data as z.infer<T>;
  }

  const schemaShape = schema.shape;
  const schemaKeys = Object.keys(schemaShape);
  const result: Record<string, unknown> = {};

  for (const key of schemaKeys) {
    if (key in (data as Record<string, unknown>)) {
      const value = (data as Record<string, unknown>)[key];
      const fieldSchema = schemaShape[key];

      // Handle nested objects: if the field schema is a ZodObject, recurse
      if (fieldSchema instanceof z.ZodObject) {
        result[key] = value !== null ? stripToSchema(value, fieldSchema) : null;
      } else if (fieldSchema instanceof z.ZodNullable) {
        // Check if the inner type is an object
        const innerType = fieldSchema._def.innerType;
        if (innerType instanceof z.ZodObject) {
          result[key] = value !== null ? stripToSchema(value, innerType) : null;
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    } else {
      // Key not in data, set to null or use default
      result[key] = null;
    }
  }

  return result as z.infer<T>;
}
