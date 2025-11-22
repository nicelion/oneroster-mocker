/**
 helper.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 20th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z, { ZodAny } from "zod";
import { ZodSchema } from "zod/v3";

export const createCsvArrayCodec = <
  TSchema extends z.ZodTypeAny,
  Optional extends boolean | undefined = false,
>(
  itemSchema: TSchema,
  opts?: {
    optional?: Optional;
    delimiter?: string;
    quote?: boolean;
  },
) => {
  const optional = opts?.optional ?? false;
  const delimiter = opts?.delimiter ?? ",";
  const quote = opts?.quote ?? true;

  const inputSchema = z.union([z.string(), z.null(), z.undefined()]);
  const outputSchemaBase = z.array(itemSchema);

  const outputSchema = (
    optional ? outputSchemaBase.optional() : outputSchemaBase
  ) as Optional extends true ? z.ZodOptional<typeof outputSchemaBase> : typeof outputSchemaBase;

  return z.codec(inputSchema, outputSchema, {
    // CSV cell (string | null | undefined) → T[]
    decode: (input) => {
      if (input == null) {
        // required: [], optional: undefined
        return (optional ? undefined : []) as z.infer<typeof outputSchema>;
      }

      let value = input.trim();

      // Strip surrounding quotes: "A,B,C" -> A,B,C
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      if (value === "") {
        return (optional ? undefined : []) as z.infer<typeof outputSchema>;
      }

      const parts = value
        .split(delimiter)
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      // Let the inner schema validate/transform each item
      const decodedItems = parts.map((part) =>
        // NOTE: you could use z.decode(itemSchema, part) if you want strict typed input
        itemSchema.parse(part),
      );

      if (optional && decodedItems.length === 0) {
        return undefined as z.infer<typeof outputSchema>;
      }

      return decodedItems as z.infer<typeof outputSchema>;
    },

    // T[] → CSV cell string
    encode: (arr) => {
      // optional: undefined or [] → ""
      // required: [] → ""
      if (!arr || (Array.isArray(arr) && arr.length === 0)) {
        return "";
      }

      const items = Array.isArray(arr) ? arr : [];

      const encodedItems = items.map((item) => {
        // Respect inner codecs too (e.g. stringToNumber, enums, etc.)
        const encoded = z.encode(itemSchema, item as any);
        return String(encoded);
      });

      const joined = encodedItems.join(delimiter);
      return quote ? `"${joined}"` : joined;
    },
  });
};
