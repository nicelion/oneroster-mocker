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
import { csvStringArrayOptional, ORDateTimeSchema, ORStatusSchema } from "./common";
import { createCsvArrayCodec } from "./helper";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

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

export const toUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" || v == null ? undefined : v), schema.optional());

/**
 * Zod validator for a single orgs.csv row.
 *
 * Header:
 *   sourcedId,status,dateLastModified,name,type,identifier,
 *   parentSourcedId,
 *   metadata.address1,metadata.address2,metadata.city,
 *   metadata.postCode,metadata.state
 */
export const OROrgsCsvRowSchema = z
  .object({
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
  })
  .catchall(z.coerce.string());

export type OROrgsCsvRow = z.infer<typeof OROrgsCsvRowSchema>;

export const OROrg = (data: unknown | unknown[]) => {
  return {
    encode: () => {
      if (Array.isArray(data)) return z.array(OROrgsCsvRowSchema).parse(data);
      return OROrgsCsvRowSchema.parse(data);
    },
    decode: () => {
      if (Array.isArray(data)) return z.array(OROrgsCsvRowSchema).parse(data);
      return OROrgsCsvRowSchema.parse(data);
    },
    writer: (path: string) => {
      return createCsvWriter({
        path,
        header: [
          { id: "sourcedId", title: "sourcedId" },
          { id: "status", title: "status" },
          { id: "dateLastModified", title: "dateLastModified" },
          { id: "name", title: "name" },
          { id: "type", title: "type" },
          { id: "identifier", title: "identifier" },
          { id: "parentSourcedId", title: "parentSourcedId" },
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
