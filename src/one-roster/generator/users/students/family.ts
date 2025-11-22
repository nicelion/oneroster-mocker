/**
 family.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import { faker } from "@faker-js/faker";
import { generateUser } from "./student";
import { ORGradeLevelSchema } from "../../../schemas/common";
import z from "zod";

type GenerateFamilyOptions = {
  numberOfChildren: number;
  numberOfParents: number;
  orgSourcedIds: string[];
  pickFromGrades: z.infer<typeof ORGradeLevelSchema>[];
};

export const generateFamily = (options: GenerateFamilyOptions) => {
  const familyName = faker.person.lastName();

  const parents = [];
  const students = [];

  for (let p = 0; p < options.numberOfParents; p++) {
    parents.push(
      generateUser({
        orgSourcedIds: options.orgSourcedIds,
        familyName,
        grades: "skip",
        role: "parent",
      }),
    );
  }

  const parentAgentIds = parents.map((p) => p.sourcedId);

  for (let s = 0; s < options.numberOfChildren; s++) {
    students.push(
      generateUser({
        orgSourcedIds: options.orgSourcedIds,
        familyName,
        agentSourcedIds: parentAgentIds,
        pickFromGrades: options.pickFromGrades,
        role: "student",
      }),
    );
  }

  return { parents, students };
};
