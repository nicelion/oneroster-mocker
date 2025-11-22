/**
 courses.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";
import { ORDateTimeSchema, ORGradesFieldSchema, ORStatusSchema } from "./common";

/**
 * Zod validator for a single courses.csv row.
 *
 * Header:
 *   sourcedId,status,dateLastModified,schoolYearSourcedId,
 *   title,courseCode,grades,orgSourcedId,subjects,subjectCodes
 */
export const ORCoursesCsvRowSchema = z.object({
  // sourcedId: GUID, required
  sourcedId: z.string().min(1, "sourcedId is required"),

  // status: Yes for Delta, Enumeration
  // In Bulk files this field should be blank; we model it as optional.
  status: ORStatusSchema.optional(),

  // dateLastModified: Yes for Delta, DateTime
  dateLastModified: ORDateTimeSchema.optional(),

  // schoolYearSourcedId: GUID Reference to academicSessions (type=schoolYear)
  schoolYearSourcedId: z.string().min(1).optional(),

  // title: required String
  title: z.string().min(1, "title is required"),

  // courseCode: optional String
  courseCode: z.string().min(1).optional(),

  // grades: optional "List of Strings" encoded in one CSV cell
  grades: ORGradesFieldSchema.optional(),

  // orgSourcedId: GUID Reference, required
  orgSourcedId: z.string().min(1, "orgSourcedId is required"),

  // subjects: optional List of Strings (CSV "1,2,3" style in one cell)
  subjects: z.string().optional(),

  // subjectCodes: optional String / list-like string
  subjectCodes: z.string().optional(),
});

export type ORCoursesCsvRow = z.infer<typeof ORCoursesCsvRowSchema>;
