/**
 users.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";
import {
  ORDateTimeSchema,
  ORGradeLevelSchema,
  ORGradesFieldSchema,
  ORStatusSchema,
} from "./common";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

/**
 * OneRoster role enumeration (1.1/1.2 data model)
 * See CSV + rostering model role enumeration.
 */
export const ORUserRoleSchema = z.enum([
  "aide",
  "counselor",
  "districtAdministrator",
  "guardian",
  "parent",
  "principal",
  "proctor",
  "relative",
  "siteAdministrator",
  "student",
  "systemAdministrator",
  "teacher",
]);

/**
 * enabledUser: required; "true" or "false"
 * 'false' = user record exists but access is curtailed.
 */
export const OREnabledUserSchema = z.enum(["true", "false"]);

/**
 * Simple helper for list-of-GUID fields stored in a single CSV cell.
 * OneRoster represents these as comma-separated values per RFC 4180.
 * We keep the *runtime* value as a string for now so it matches the raw CSV.
 */
export const ORGuidListCellSchema = z
  .string()
  .min(1, "At least one GUID is required")
  .refine(
    (val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .every((token) => token.length > 0),
    "List must be a comma-separated set of non-empty GUID references",
  );

/**
 * users.csv row schema, in exact header order:
 *
 * sourcedId,status,dateLastModified,enabledUser,orgSourcedIds,role,username,
 * userIds,givenName,familyName,middleName,identifier,email,sms,phone,
 * agentSourcedIds,grades,password
 */
export const ORUsersCsvRowSchema = z.object({
  // GUID – unique per user; used as foreign key in other CSVs
  sourcedId: z.string().min(1, "sourcedId is required"),

  // Yes for Delta; must be blank for Bulk
  status: ORStatusSchema.optional(),

  // Yes for Delta; must be blank for Bulk
  dateLastModified: ORDateTimeSchema.optional(),

  // Required: "true" | "false"
  enabledUser: OREnabledUserSchema,

  // Required: List of GUID References (comma-separated sourcedIds of orgs)
  orgSourcedIds: z.string(),

  // Required: OneRoster role enumeration
  role: ORUserRoleSchema,

  // Required username (often email, but spec just says string)
  username: z.string().min(1, "username is required"),

  // Optional: List of Strings {Type:Id} comma-separated, e.g. "{LDAP:Id},{LTI:Id}"
  userIds: z.string().optional(),

  // Required givenName
  givenName: z.string().min(1, "givenName is required"),

  // Required familyName
  familyName: z.string().min(1, "familyName is required"),

  // Optional middleName(s)
  middleName: z.string().optional(),

  // Optional human-meaningful identifier (often SIS ID, local ID, etc.)
  identifier: z.string().optional(),

  // Optional in spec, but many vendors require it; we’ll validate as proper email if present
  email: z.string().optional(),

  // Optional SMS address (string; often phone or SMS gateway address)
  sms: z.string().optional(),

  // Optional phone number (string; OneRoster doesn’t prescribe a format)
  phone: z.string().optional(),

  // Optional: List of GUID References for “agents” (usually parents/guardians)
  agentSourcedIds: z.string().optional(),

  // Grade(s) associated with the user (student), now intended as a *list of strings*.
  // We keep it as a single cell string (often comma-separated) but reuse ORGradesFieldSchema.
  grades: z.string().optional(),

  // Optional password (often omitted when using SSO)
  password: z.string().optional(),
});

export type ORUsersCsvRow = z.infer<typeof ORUsersCsvRowSchema>;

const ORUserObject = z.object({
  ...ORUsersCsvRowSchema.shape,
  orgSourcedIds: z
    .string()
    .transform((value) => value.split(",").map(String))
    .pipe(z.string().array()),
  userIds: z
    .string()
    .transform((value) => value.split(",").map(String))
    .pipe(z.string().array()),
  agentSourcedIds: z
    .string()
    .transform((value) => value.split(",").map(String))
    .pipe(z.string().array())
    .optional(),
  grades: z
    .string()
    .transform((value) => value.split(",").map(String))
    .pipe(ORGradeLevelSchema.array())
    .optional(),
});

export const ORUsers = (data: unknown | unknown[]) => {
  return {
    encode: () => {
      if (Array.isArray(data)) return z.array(ORUsersCsvRowSchema).parse(data);

      return ORUsersCsvRowSchema.parse(data);
    },
    decode: () => {
      if (Array.isArray(data)) return z.array(ORUserObject).parse(data);

      return ORUserObject.parse(data);
    },

    writer: (path: string) => {
      return createCsvWriter({
        path,
        header: [
          { id: "sourcedId", title: "sourcedId" },
          { id: "status", title: "status" },
          { id: "dateLastModified", title: "dateLastModified" },
          { id: "enabledUser", title: "enabledUser" },
          { id: "orgSourcedIds", title: "orgSourcedIds" },
          { id: "role", title: "role" },
          { id: "username", title: "username" },
          { id: "userIds", title: "userIds" },
          { id: "givenName", title: "givenName" },
          { id: "familyName", title: "familyName" },
          { id: "middleName", title: "middleName" },
          { id: "identifier", title: "identifier" },
          { id: "email", title: "email" },
          { id: "sms", title: "sms" },
          { id: "phone", title: "phone" },
          { id: "agentSourcedIds", title: "agentSourcedIds" },
          { id: "grades", title: "grades" },
          { id: "password", title: "password" },
        ],
      });
    },
  };
};

export const OROrgCsvHeaderConfig = [
  { id: "sourcedId", title: "sourcedId" },
  { id: "status", title: "status" },
  { id: "dateLastModified", title: "dateLastModified" },
  { id: "enabledUser", title: "enabledUser" },
  { id: "orgSourcedIds", title: "orgSourcedIds" },
  { id: "role", title: "role" },
  { id: "username", title: "username" },
  { id: "userIds", title: "userIds" },
  { id: "givenName", title: "givenName" },
  { id: "familyName", title: "familyName" },
  { id: "middleName", title: "middleName" },
  { id: "identifier", title: "identifier" },
  { id: "email", title: "email" },
  { id: "sms", title: "sms" },
  { id: "phone", title: "phone" },
  { id: "agentSourcedIds", title: "agentSourcedIds" },
  { id: "grades", title: "grades" },
  { id: "password", title: "password" },
];
