/**
 enrollments.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";
import { ORDateSchema, ORStatusSchema } from "./common";

/**
 * OR role for enrollments.csv
 * Spec / vendor instructions:
 *   'student' | 'teacher' | 'parent' | 'guardian' |
 *   'relative' | 'aide' | 'administrator'
 */
export const OREnrollmentRoleSchema = z.enum([
  "student",
  "teacher",
  "parent",
  "guardian",
  "relative",
  "aide",
  "administrator",
]);

/**
 * OR primary flag for enrollments:
 * permitted values: "true" | "false".
 * Applicable only to teachers.
 */
export const OREnrollmentPrimarySchema = z.enum(["true", "false"]);

/**
 * Zod validator for a single enrollments.csv row.
 *
 * Header:
 *   sourcedId,status,dateLastModified,classSourcedId,
 *   schoolSourcedId,userSourcedId,role,primary,beginDate,endDate
 */
export const OREnrollmentsCsvRowSchema = z.object({
  // required: unique per enrollment
  sourcedId: z.string().min(1, "sourcedId is required"),

  // optional OR status (typically "active" | "tobedeleted")
  status: ORStatusSchema.optional(),

  // optional: last-modified date (YYYY-MM-DD)
  dateLastModified: ORDateSchema.optional(),

  // required: references classes.sourcedId
  classSourcedId: z.string().min(1, "classSourcedId is required"),

  // required: references orgs.sourcedId (school)
  schoolSourcedId: z.string().min(1, "schoolSourcedId is required"),

  // required: references users.sourcedId
  userSourcedId: z.string().min(1, "userSourcedId is required"),

  // required role enumeration
  role: OREnrollmentRoleSchema,

  // optional: "true" if primary teacher in this class
  primary: OREnrollmentPrimarySchema.optional(),

  // optional: enrollment start date (inclusive, YYYY-MM-DD)
  beginDate: ORDateSchema.optional(),

  // optional: enrollment end date (exclusive, YYYY-MM-DD)
  endDate: ORDateSchema.optional(),
});

// Inferred TS type for convenience
export type OREnrollmentsCsvRow = z.infer<typeof OREnrollmentsCsvRowSchema>;
