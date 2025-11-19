/**
 demographics.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import z from "zod";
import {
  ORBooleanFlagSchema,
  ORDateSchema,
  ORDateTimeSchema,
  ORGenderSchema,
  ORStatusSchema,
} from "./common";

/**
 * Zod validator for a single demographics.csv row.
 *
 * Header:
 *   sourcedId,status,dateLastModified,birthDate,sex,
 *   americanIndianOrAlaskaNative,asian,blackOrAfricanAmerican,
 *   nativeHawaiianOrOtherPacificIslander,white,
 *   demographicRaceTwoOrMoreRaces,hispanicOrLatinoEthnicity,
 *   countryOfBirthCode,stateOfBirthAbbreviation,cityOfBirth,
 *   publicSchoolResidenceStatus
 */
export const ORDemographicsCsvRowSchema = z.object({
  // sourcedId: required; GUID ref to student user. :contentReference[oaicite:8]{index=8}
  sourcedId: z.string().min(1, "sourcedId is required"),

  // status: optional OR status; ignored for bulk in some vendors. :contentReference[oaicite:9]{index=9}
  status: ORStatusSchema.optional(),

  // dateLastModified: DateTime, optional. :contentReference[oaicite:10]{index=10}
  dateLastModified: ORDateTimeSchema.optional(),

  // birthDate: Date (YYYY-MM-DD). :contentReference[oaicite:11]{index=11}
  birthDate: ORDateSchema.optional(), // demographics.csv treats it as optional overall

  // sex: gender enumeration (female | male in OR 1.1). :contentReference[oaicite:12]{index=12}
  sex: ORGenderSchema.optional(),

  // Race flags – Enumeration: true/yes/false/no. :contentReference[oaicite:13]{index=13}
  americanIndianOrAlaskaNative: ORBooleanFlagSchema.optional(),
  asian: ORBooleanFlagSchema.optional(),
  blackOrAfricanAmerican: ORBooleanFlagSchema.optional(),
  nativeHawaiianOrOtherPacificIslander: ORBooleanFlagSchema.optional(),
  white: ORBooleanFlagSchema.optional(),
  demographicRaceTwoOrMoreRaces: ORBooleanFlagSchema.optional(),

  // Ethnicity flag – same booleanish enumeration. :contentReference[oaicite:14]{index=14}
  hispanicOrLatinoEthnicity: ORBooleanFlagSchema.optional(),

  // Birth location + residence status – free-form strings constrained by CEDS vocab. :contentReference[oaicite:15]{index=15}
  countryOfBirthCode: z.string().optional(),
  stateOfBirthAbbreviation: z.string().optional(),
  cityOfBirth: z.string().optional(),

  publicSchoolResidenceStatus: z.string().optional(),
});

export type ORDemographicsCsvRow = z.infer<typeof ORDemographicsCsvRowSchema>;
