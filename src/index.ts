/**
 index.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import { faker } from "@faker-js/faker";
import { generateStudent, generateUser } from "./one-roster/generator/users/students/student";
import { generateFamily } from "./one-roster/generator/users/students/family";
import { generateSourceId } from "./one-roster/generator/common";

import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import { generateSchool, generateSchoolName } from "./one-roster/generator/org/schools";
import { array } from "zod";
import { generateDistrict } from "./one-roster/generator/org/district";
import { OROrg, OROrgCodec, OROrgsCsvRow, OROrgsCsvRowSchema } from "./one-roster/schemas/orgs";
import { encodeCsvRow } from "./one-roster/schemas/common";
import { ORUsers, ORUsersCsvRow } from "./one-roster/schemas/users";
import { generateOrg } from "./one-roster/generator/org/org";
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type GenerateSchoolUsersOptions = {
  orgSourcedIds: string[];
  minParents: number;
  maxParents: number;
};
const generateSchoolUsers = (opts: GenerateSchoolUsersOptions) => {
  const { parents, students } = generateFamily({
    orgSourcedIds: opts.orgSourcedIds,
    numberOfChildren: randomInt(1, 5),
    numberOfParents: randomInt(1, 3),
    pickFromGrades: ["09", "10", "11", "12"],
  });

  const merged = [...parents, ...students];

  return merged;
};

const district = generateOrg({ type: "district" });

const school = generateOrg({
  type: "school",
  "metadata.state": district["metadata.state"],
  schoolLevel: "high",
});

const schoolUsers = generateSchoolUsers({
  orgSourcedIds: [school.sourcedId],
  minParents: 1,
  maxParents: 4,
});

const schoolAdmins = generateUser({
  role: "principal",
  orgSourcedIds: [school.sourcedId],
});

console.log({ district, school, schoolUsers, schoolAdmins });

// CSV Writers
const OrgCsvWriter = OROrg([]).writer("./outputs/orgs.csv").writeRecords([district, school]);
const UsersCsvWriter = ORUsers([])
  .writer("./outputs/users.csv")
  .writeRecords([...schoolUsers, schoolAdmins]);

// console.log(district);
// csvWriter
//   .writeRecords([district])
//   .then(() => console.log("wrote to file"))
//   .catch((e) => console.log("Error", e));
