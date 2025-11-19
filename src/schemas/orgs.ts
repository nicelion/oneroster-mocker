/**
 orgs.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";
import { ORDateTimeSchema, ORStatusSchema } from "./common";

/**
 * OR org type enumeration (OneRoster 1.1):
 *   - district
 *   - school
 *   - department
 *   - local
 *   - state
 *   - national
 */
export const OROrgTypeSchema = z.enum([
  "district",
  "school",
  "department",
  "local",
  "state",
  "national",
]);

/**
 * Zod validator for a single orgs.csv row.
 *
 * Header:
 *   sourcedId,status,dateLastModified,name,type,identifier,
 *   parentSourcedId,
 *   metadata.address1,metadata.address2,metadata.city,
 *   metadata.postCode,metadata.state
 */
export const OROrgsCsvRowSchema = z.object({
  // required sourcedId
  sourcedId: z.string().min(1, "sourcedId is required"),

  // optional OR status
  status: ORStatusSchema.optional(),

  // optional dateLastModified
  dateLastModified: ORDateTimeSchema.optional(),

  // required name
  name: z.string().min(1, "name is required"),

  // required org type
  type: OROrgTypeSchema,

  // optional identifier (local ID)
  identifier: z.string().optional(),

  // optional reference to parent org
  parentSourcedId: z.string().optional(),

  // --- metadata.* columns ---

  "metadata.address1": z.string().optional(),
  "metadata.address2": z.string().optional(),
  "metadata.city": z.string().optional(),
  "metadata.postCode": z.string().optional(),
  "metadata.state": z.string().optional(),
});

export type OROrgsCsvRow = z.infer<typeof OROrgsCsvRowSchema>;
