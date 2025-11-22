/**
 student.ts
 oneroster-mocker
 
 Created by Ian Thompson on November 18th 2025
 ianthompson@nicelion.com
 https://www.nicelion.com
 
 MIT License
 
 Copyright (c) 2025 Ian Thompson
 
*/

import { faker } from "@faker-js/faker";
import { generateSourceId } from "../../common";
import { ORGradeLevelSchema } from "../../../schemas/common";
import { ORUserRoleSchema, ORUsersCsvRow } from "../../../schemas/users";
import { Override } from "../../../../types";
import z from "zod";

export const generateStudent = (orgSourcedId: string) => {
  const sourcedId = generateSourceId();
  const givenName = faker.person.firstName();
  const familyName = faker.person.lastName();

  return {
    sourcedId, // required

    enabledUser: "true", // required
    orgSourcedIds: orgSourcedId, // required
    role: ORUserRoleSchema.enum.parent, // required
    username: faker.internet.username({ firstName: givenName, lastName: familyName }),
    userIds: faker.string.numeric(8), // optional SIS ID
    givenName,
    familyName,
    middleName: faker.person.middleName(), // optional
    identifier: faker.internet.email({
      // optional AD/UPN-like ID
      firstName: givenName,
      lastName: familyName,
      provider: "nicelion.com",
    }),
    email: faker.internet.email({
      firstName: givenName,
      lastName: familyName,
      provider: "nicelion.com",
    }), // optional for students
    sms: "",
    phone: "",
    grades: faker.helpers.arrayElement([...ORGradeLevelSchema.options]),
    password: "", // ignored because OneRoster uses SSO
  };
};

export const generateUser = (
  options: Override<
    Partial<ORUsersCsvRow>,
    {
      grades?: z.infer<typeof ORGradeLevelSchema>[] | "skip";
      pickFromGrades?: z.infer<typeof ORGradeLevelSchema>[];
      orgSourcedIds: string[];
      agentSourcedIds?: string[];
    }
  >,
) => {
  const sourcedId = generateSourceId();
  const givenName = options.givenName ?? faker.person.firstName();
  const familyName = options.familyName ?? faker.person.lastName();

  const grades =
    options.grades == "skip"
      ? ""
      : (options.grades?.join(",") ??
        faker.helpers.arrayElement([
          ...(options.pickFromGrades ? options.pickFromGrades : ORGradeLevelSchema.options),
        ]));

  return {
    sourcedId, // required
    status: options.status ?? "active", // optional
    dateLastModified: options.dateLastModified ?? undefined, // optional
    enabledUser: options.enabledUser ?? "true", // required
    orgSourcedIds: options.orgSourcedIds?.join(","), // required
    role: options.role ?? faker.helpers.arrayElement([...ORUserRoleSchema.options]), // required
    username:
      options.username ?? faker.internet.username({ firstName: givenName, lastName: familyName }),
    userIds: options.userIds ?? faker.string.numeric(8), // optional SIS ID
    givenName,
    familyName,
    middleName: options.middleName ?? faker.person.middleName(), // optional
    identifier:
      options.identifier ?? `${givenName.toLowerCase()}${familyName.toLowerCase()}@nicelion.com`,

    email: options.email ?? `${givenName.toLowerCase()}${familyName.toLowerCase()}@nicelion.com`, // optional for students
    sms: options.sms ?? "",
    phone: options.phone ?? "",
    agentSourcedIds: options.agentSourcedIds?.join(",") ?? undefined,
    grades,
    password: options.password ?? "", // ignored because OneRoster uses SSO
  };
};

export const ORUsersCsvHeaderConfig = [
  { id: "sourcedId", title: "sourcedId" },
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
