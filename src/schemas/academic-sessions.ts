/**
 academic-sessions.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";
import { ORDateSchema, ORStatusSchema, ORYearSchema } from "./common";

export const ORAcademicSessionTypeSchema = z.enum([
  "term",
  "gradingPeriod",
  "schoolYear",
  "semester",
]);

export const ORAcademicSessionCsvRowSchema = z.object({
  // CSV header: sourcedId
  sourcedId: z.string().min(1, "sourcedId is required"),

  // CSV header: status (optional column, optional value)
  status: ORStatusSchema.optional(),

  // CSV header: dateLastModified (optional)
  // Instructions treat this as a date (YYYY-MM-DD) in the CSV context.
  dateLastModified: ORDateSchema.optional(),

  // CSV header: title
  title: z.string().min(1, "title is required"),

  // CSV header: type
  type: ORAcademicSessionTypeSchema,

  // CSV header: startDate
  startDate: ORDateSchema,

  // CSV header: endDate
  endDate: ORDateSchema,

  // CSV header: parentSourcedId (optional)
  parentSourcedId: z.string().min(1).optional(),

  // CSV header: schoolYear (spec calls this schoolYear/schoolyear, year of end of session)
  schoolYear: ORYearSchema,
});

// Handy inferred TypeScript type for a row
export type ORAcademicSessionCsvRow = z.infer<typeof ORAcademicSessionCsvRowSchema>;
