import { z } from 'zod';

interface ZodTypeInfo {
  type: string;
  nullable: boolean;
  isObject: boolean;
  isArray: boolean;
  innerSchema?: z.ZodObject<any>;
}

/**
 * Gets the Zod type name from a field, supporting both Zod v3 and v4 structures.
 * - Zod v3: uses _def.typeName (e.g., 'ZodString', 'ZodNullable')
 * - Zod v4: uses _def.type (e.g., 'string', 'nullable')
 */
function getZodTypeName(field: any): string {
  // Try Zod v3 style first
  if (field?._def?.typeName) {
    return field._def.typeName;
  }
  // Try Zod v4 style (lowercase type names)
  if (field?._def?.type) {
    // Normalize to Zod v3 style for consistency
    const type = field._def.type;
    if (typeof type === 'string') {
      return 'Zod' + type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  // Try constructor name as fallback
  if (field?.constructor?.name?.startsWith('Zod')) {
    return field.constructor.name;
  }
  return '';
}

/**
 * Unwraps a Zod field to get its core type, tracking nullability along the way.
 * Handles: ZodDefault -> ZodNullable -> ZodOptional -> CoreType
 */
function unwrapZodType(field: any): { coreField: any; isNullable: boolean } {
  let current = field;
  let isNullable = false;

  // Keep unwrapping until we reach a core type
  while (current?._def) {
    const typeName = getZodTypeName(current);

    if (typeName === 'ZodDefault') {
      current = current._def.innerType;
      continue;
    }

    if (typeName === 'ZodNullable') {
      isNullable = true;
      current = current._def.innerType;
      continue;
    }

    if (typeName === 'ZodOptional') {
      isNullable = true;
      current = current._def.innerType;
      continue;
    }

    // Not a wrapper type, we've reached the core
    break;
  }

  return { coreField: current, isNullable };
}

/**
 * Extracts type information from a Zod field for prompt generation.
 */
export function getZodTypeInfo(field: any): ZodTypeInfo {
  const { coreField, isNullable } = unwrapZodType(field);
  const typeName = getZodTypeName(coreField);

  // Handle ZodObject
  if (typeName === 'ZodObject' || coreField?.shape) {
    return {
      type: 'object',
      nullable: isNullable,
      isObject: true,
      isArray: false,
      innerSchema: coreField,
    };
  }

  // Handle ZodArray
  if (typeName === 'ZodArray') {
    const elementType = coreField._def?.type;
    const elementTypeName = getZodTypeName(elementType);
    if (elementType?.shape || elementTypeName === 'ZodObject') {
      return { type: 'array of objects', nullable: isNullable, isObject: false, isArray: true };
    }
    return { type: 'array of strings', nullable: isNullable, isObject: false, isArray: true };
  }

  // Handle ZodBoolean - MUST check before falling through to string
  if (typeName === 'ZodBoolean') {
    return { type: 'boolean (true/false)', nullable: isNullable, isObject: false, isArray: false };
  }

  // Handle ZodNumber
  if (typeName === 'ZodNumber') {
    return { type: 'number', nullable: isNullable, isObject: false, isArray: false };
  }

  // Handle ZodEnum
  if (typeName === 'ZodEnum') {
    const values = coreField._def?.values;
    if (Array.isArray(values)) {
      return {
        type: `enum: [${values.map((v: string) => `"${v}"`).join(', ')}]`,
        nullable: isNullable,
        isObject: false,
        isArray: false,
      };
    }
  }

  // Handle ZodString
  if (typeName === 'ZodString') {
    return { type: 'string', nullable: isNullable, isObject: false, isArray: false };
  }

  // Fallback to string (no warning in production)
  return { type: 'string', nullable: isNullable, isObject: false, isArray: false };
}

/**
 * Converts a Zod schema to a human-readable string format for inclusion in LLM prompts.
 * Uses JSON-like structure with comments describing each field.
 */
export function zodSchemaToPromptString(schema: z.ZodObject<any>, indent = 0): string {
  const shape = schema.shape;
  const lines: string[] = [];
  const indentStr = '  '.repeat(indent);

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const field = fieldSchema as any;
    const description = field.description || '';
    const typeInfo = getZodTypeInfo(field);

    if (typeInfo.isObject && typeInfo.innerSchema) {
      lines.push(
        `${indentStr}"${key}": { // ${typeInfo.nullable ? '(nullable) ' : ''}${description}`
      );
      lines.push(zodSchemaToPromptString(typeInfo.innerSchema, indent + 1));
      lines.push(`${indentStr}}`);
    } else if (typeInfo.isArray) {
      lines.push(`${indentStr}"${key}": ${typeInfo.type}, // ${description}`);
    } else {
      lines.push(
        `${indentStr}"${key}": ${typeInfo.type}, // ${typeInfo.nullable ? '(nullable) ' : ''}${description}`
      );
    }
  }

  return lines.join('\n');
}
