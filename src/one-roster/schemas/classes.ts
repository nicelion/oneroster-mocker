/**
 classes.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";
import { ORDateSchema, ORGradeLevelSchema, ORGradesFieldSchema, ORStatusSchema } from "./common";

/**
 * OR classType: required, per spec: "scheduled" | "homeroom".
 */
export const ORClassTypeSchema = z.enum(["scheduled", "homeroom"]);

/**
 * Validator for a single classes.csv row.
 *
 * CSV headers:
 * sourcedId,status,dateLastModified,title,grades,courseSourcedId,
 * classCode,classType,location,schoolSourcedId,termSourcedIds,
 * subjects,subjectCodes,periods
 */
export const ORClassesCsvRowSchema = z.object({
  // required: YES
  sourcedId: z.string().min(1, "sourcedId is required"),

  // optional: active | inactive | tobedeleted
  status: ORStatusSchema.optional(),

  // optional date in YYYY-MM-DD
  dateLastModified: ORDateSchema.optional(),

  // required: class name/title
  title: z.string().min(1, "title is required"),

  // NO but recommended; accepts tokens/ranges as per spec
  grades: ORGradesFieldSchema.optional(),

  // NO but recommended; references courses.sourcedId
  courseSourcedId: z.string().min(1).optional(),

  // optional free-form class code
  classCode: z.string().min(1).optional(),

  // required; "scheduled" | "homeroom"
  classType: ORClassTypeSchema,

  // optional location descriptor (room, building, etc.)
  location: z.string().min(1).optional(),

  // required: references orgs.sourcedId for the school
  schoolSourcedId: z.string().min(1, "schoolSourcedId is required"),

  // required: references academicSessions.sourcedId; may represent multiple IDs
  // in the raw CSV via comma-separated values
  termSourcedIds: z.string().min(1, "termSourcedIds is required"),

  // optional; may be multi-valued in CSV
  subjects: z.string().optional(),

  // optional; may be multi-valued in CSV
  subjectCodes: z.string().optional(),

  // optional; may be multi-valued in CSV
  periods: z.string().optional(),
});

export type ORClassesCsvRow = z.infer<typeof ORClassesCsvRowSchema>;
