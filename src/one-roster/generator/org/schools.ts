/**
 schools.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import { faker } from "@faker-js/faker";
import { capitalize } from "../../../utils";
import z from "zod";
import { OROrgsCsvRowSchema } from "../../schemas/orgs";
import { generateSourceId } from "../common";

const SchoolLevel = ["elementary", "middle", "high"] as const;

const BaseSuffixes = [
  "Preparatory School",
  "Academy of Arts",
  "Academy of Arts and Sciences",
  "Charter School",
];

const ElementarySchoolSuffixes = [
  "Elementary School",
  "Primary School",
  "Intermediate School",
  "Community School",
];

const MiddleSchoolSuffixes = [
  "Intermediate School",
  "Middle School",
  "Middle Academy",
  "Junior High School",
];

const HighSchoolSuffixes = ["High School", "Charter High School"];

type SchoolNameOptions = {
  state?: string;
  city?: string;
  level: (typeof SchoolLevel)[number];
};
export const generateSchoolName = (options: SchoolNameOptions) => {
  const suffixes = [...BaseSuffixes];
  switch (options.level) {
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
};

type GenerateSchoolOptions = {
  level: (typeof SchoolLevel)[number];
  state?: string;
  city?: string;
  parentSourcedId: string;
};
export const generateSchool = (opts: GenerateSchoolOptions): z.infer<typeof OROrgsCsvRowSchema> => {
  return OROrgsCsvRowSchema.parse({
    name: generateSchoolName({ state: opts.state, city: opts.city, level: opts.level }),
    "metadata.city": opts.city ?? faker.location.city(),
    "metadata.state": opts.state ?? faker.location.state(),
    "metadata.address1": faker.location.streetAddress(),
    "metadata.zip": faker.location.zipCode(),
    type: "school",
    sourcedId: generateSourceId(),
    parentSourcedId: opts.parentSourcedId,
  });
};
