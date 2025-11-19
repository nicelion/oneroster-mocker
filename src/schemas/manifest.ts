/**
 manifest.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";

/**
 * Allowed values for file mode columns in manifest.csv
 * (e.g., users, orgs, courses, classes, enrollments, etc.)
 *
 * - "bulk"   → full replacement
 * - "delta"  → incremental changes (status used)
 * - "absent" → file not included
 */
export const ORManifestFileModeSchema = z.enum(["bulk", "delta", "absent"]);

/**
 * Known top-level manifest property names that are *not*
 * per-file modes. We keep them as a union so your generator
 * can be a bit smarter if it wants.
 *
 * In practice, manifest.csv will also have entries whose
 * propertyName is the file name (users, orgs, etc.).
 */
export const ORManifestCorePropertyNameSchema = z.enum([
  "fileFormat",
  "manifestVersion",
  "onerosterVersion",
  "sourceSystemName",
  "sourceSystemCode",
  // You can extend this as needed (e.g. "creationDateTime")
]);

/**
 * A single manifest.csv row.
 *
 * Headers:
 *   propertyName,value
 *
 * There are two main shapes:
 * 1. Core properties:
 *    - propertyName in ORManifestCorePropertyNameSchema
 *    - value is a free-form (but non-empty) string
 * 2. File mode properties:
 *    - propertyName is the base name of a CSV file ("users", "orgs", etc.)
 *    - value is one of "bulk" | "delta" | "absent"
 *
 * To keep things flexible, we allow any non-empty propertyName,
 * and then refine value for known file-type names if you want later.
 */
export const ORManifestCsvRowSchema = z.object({
  propertyName: z.string().min(1, "propertyName is required"),

  value: z.string().min(1, "value is required"),
});

export type ORManifestCsvRow = z.infer<typeof ORManifestCsvRowSchema>;
