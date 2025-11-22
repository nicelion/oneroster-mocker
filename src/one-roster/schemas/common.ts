/**
 common.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import { z } from "zod";

export const csvStringArray = z.codec(
  // INPUT schema: how the value looks in the CSV row
  z.union([z.string(), z.null(), z.undefined()]),

  // OUTPUT schema: how you want to work with it in code
  z.array(z.string()),

  {
    // CSV → string[]
    decode: (input) => {
      if (input == null) return [];

      let value = input.trim();

      // Strip surrounding quotes: "A,B,C" -> A,B,C
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      if (value === "") return [];

      return value
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
    },

    // string[] → CSV cell string
    encode: (arr) => {
      if (!arr || arr.length === 0) return "";
      const joined = arr.join(",");
      // You can decide if you ALWAYS want quotes or only when needed.
      return `"${joined}"`;
    },
  },
);

export const csvStringArrayOptional = z.codec(
  z.union([z.string(), z.null(), z.undefined()]),
  z.array(z.string()).optional(),
  {
    decode: (input) => {
      if (input == null) return undefined;

      let value = input.trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (value === "") return undefined;

      const parts = value
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      return parts.length ? parts : undefined;
    },

    encode: (arr) => {
      if (!arr || arr.length === 0) return "";
      return `"${arr.join(",")}"`;
    },
  },
);

export const encodeCsvRow = <TInput, TOutput>(
  schema: z.ZodType<TOutput, any, TInput>,
  output: TOutput,
): Record<string, string> => {
  if (!schema.def.shape) throw new Error();

  const schemaKeys = Object.getOwnPropertyNames(schema.def.shape);

  const encoded = schema.encode(output);

  // 1) Base object with *all* schema keys set to ""
  const blankBase = Object.fromEntries(schemaKeys.map((key) => [key, ""] as const));

  return {
    ...blankBase,
    ...encoded,
  };
  // Convert all undefined → ""
  // return Object.fromEntries(
  //   Object.entries(encoded).map(([k, v]) => [k, v === undefined || v === null ? "" : String(v)]),
  // );
};

export const ORGradeLevelSchema = z.enum([
  "IT",
  "PR",
  "PK",
  "TK",
  "KG",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "PS",
  "UG",
  "Other",
]);

/**
 * OneRoster status for objects.
 *
 * NOTE: IMS 1EdTech v1.1 formally only allows "active" | "tobedeleted".
 * The McGraw Hill CSV instructions still mention "inactive" for compatibility.
 * If you want to be *strict* OneRoster 1.1, drop "inactive" from this enum.
 */
export const ORStatusSchema = z.enum(["active", "inactive", "tobedeleted"]);

// Common YYYY-MM-DD date format used in the CSV instructions.
export const ORDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Date must be in YYYY-MM-DD format",
});

// 4-digit year (school year ends in this year).
export const ORYearSchema = z.string().regex(/^\d{4}$/, {
  message: "Year must be a 4-digit year, e.g. 2025",
});

/**
 * OR DateTime for dateLastModified.
 *
 * Spec requires W3C/ISO 8601, UTC, millisecond resolution, e.g.
 * "2017-04-30T00:00:00.000Z".
 *
 * For some flexibility, this regex allows:
 * - "YYYY-MM-DD"
 * - "YYYY-MM-DDTHH:MM:SSZ"
 * - "YYYY-MM-DDTHH:MM:SS.sssZ"
 */
export const ORDateTimeSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/, {
    message: "dateTime must be ISO 8601, e.g. 2017-04-30T00:00:00.000Z",
  });

/**
 * OR "List of Strings" encoding for grades in a single CSV cell:
 * - Single token: "3"
 * - Range: "K-5" or "3-8"
 * - Comma-separated list: "3,4,5-6"
 *
 * Remember: in actual CSV it will be quoted when it contains commas.
 */
export const ORGradesFieldSchema = z.string().refine(
  (value) => {
    const parts = value.split(",");

    const allowed = new Set(ORGradeLevelSchema.options);

    const isValidToken = (token: string) => allowed.has(token);

    return parts.every((rawPart) => {
      const part = rawPart.trim();
      if (!part) return false;

      // Range like "K-5"
      if (part.includes("-")) {
        const [start, end] = part.split("-");
        if (!start || !end) return false;
        return isValidToken(start) && isValidToken(end);
      }

      // Single token
      return isValidToken(part);
    });
  },
  {
    message:
      "grades must be grade codes (PK,K,1-12,NA), optionally with ranges (e.g. K-5) and comma-separated",
  },
);

/**
 * OR Gender for demographics.sex in v1.1:
 *   - female
 *   - male
 * (1.2+ adds non-binary options; we stay 1.1 here.)
 */
export const ORGenderSchema = z.enum(["female", "male"]);

/**
 * Boolean-like flags used in demographics race/ethnicity fields.
 * Vendor docs allow "true, yes, false, no" (all lowercase). :contentReference[oaicite:7]{index=7}
 * Your generator can always emit "true"/"false" if you want to stay simple.
 */
export const ORBooleanFlagSchema = z.enum(["true", "false", "yes", "no"]);
