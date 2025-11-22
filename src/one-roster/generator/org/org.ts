/**
 district.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 19th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import { faker } from "@faker-js/faker";
import { Override } from "../../../types";
import { OROrgsCsvRow, OROrgTypeSchema } from "../../schemas/orgs";
import {
  BaseSchoolSuffixes,
  DistrictSuffixes,
  ElementarySchoolSuffixes,
  HighSchoolSuffixes,
  MiddleSchoolSuffixes,
  SchoolLevel,
} from "./suffixes";
import z from "zod";
import { capitalize } from "../../../utils";
import { generateSourceId } from "../common";

type OrgGeneratorOptions = Partial<OROrgsCsvRow> & {
  schoolLevel?: (typeof SchoolLevel)[number];
  "metadata.state"?: string;
  "metadata.city"?: string;
  "metadata.county"?: string;
  "metadata.street"?: string;
  "metadata.zip"?: string;
};

export const generateOrg = (opts?: OrgGeneratorOptions): OROrgsCsvRow => {
  const city = opts?.["metadata.city"] ?? faker.location.city();
  const county = opts?.["metadata.county"] ?? faker.location.county();
  const state = opts?.["metadata.state"] ?? faker.location.state({ abbreviated: true });
  const street = opts?.["metadata.street"] ?? faker.location.streetAddress();
  const zip = opts?.["metadata.zip"] ?? faker.location.zipCode();

  const name =
    opts?.name ??
    generateOrgName({ type: opts?.type ?? "district", level: opts?.schoolLevel, city, county });

  return {
    sourceId: generateSourceId(),
    name: name,
    type: opts?.type ?? faker.helpers.arrayElement(OROrgTypeSchema.options),
    status: "active",
    "metadata.address1": street,
    "metadata.city": city,
    "metadata.state": state,
    "metadata.postCode": zip,
    sourcedId: faker.string.uuid(),
    identifier: opts?.identifier ?? undefined,
    parentSourcedId: opts?.parentSourcedId ?? undefined,
    dateLastModified: opts?.dateLastModified ?? undefined,
  } as OROrgsCsvRow;
};

const generateOrgName = (opts: {
  type: z.infer<typeof OROrgTypeSchema>;
  level?: (typeof SchoolLevel)[number];
  city: string;
  county: string;
}) => {
  if (opts.type == "district") {
    return `${faker.helpers.arrayElement([opts.city, opts.county])} ${faker.helpers.arrayElement(DistrictSuffixes)}`;
  }

  if (opts.type == "school") {
    const suffixes = [...BaseSchoolSuffixes];
    switch (opts.level) {
      case "elementary":
        suffixes.push(...ElementarySchoolSuffixes);
        break;
      case "high":
        suffixes.push(...HighSchoolSuffixes);
        break;
      case "middle":
        suffixes.push(...MiddleSchoolSuffixes);
        break;
      default:
        break;
    }
    const base = faker.helpers.arrayElement([
      faker.location.city(), // Greenville
      `${faker.person.firstName()} ${faker.person.lastName()}`, // Thompson
      // capitalize(faker.word.adjective()), // Evergreen
      capitalize(faker.word.noun()), // Oak
    ]);

    return `${base} ${faker.helpers.arrayElement(suffixes)}`;
  }

  return "Error Generating Name";
  //   `${faker.helpers.arrayElement([city, county])} ${faker.helpers.arrayElement(districtSuffixes)}`;
};
