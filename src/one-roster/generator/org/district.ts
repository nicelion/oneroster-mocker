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
import { OROrgsCsvRow, OROrgsCsvRowSchema } from "../../schemas/orgs";
import z from "zod";

const districtSuffixes = [
  "School District",
  "Public Schools",
  "County Schools",
  "County School District",
  "Unified School District",
  "Independent School District",
  "Community School District",
  "Community Unit School District",
  "Consolidated School District",
  "Consolidated Independent School District",
  "Union School District",
  "Joint School District",
  "Joint Unified School District",
  "Central School District",
  "City School District",
  "Metropolitan School District",
  "Public School System",
  "Metropolitan Public Schools",
  "Charter Schools",
  "Education Network",
  "Learning Community",
];

type DistrictOptions = Override<Partial<OROrgsCsvRow>, {}>;

export const generateDistrict = (opts?: DistrictOptions) => {
  const city = opts?.["metadata.city"] ?? faker.location.city();
  const county = opts?.["metadata.county"] ?? faker.location.county();
  const state = opts?.["metadata.state"] ?? faker.location.state({ abbreviated: true });
  const street = opts?.["metadata.street"] ?? faker.location.streetAddress();
  const zip = opts?.["metadata.zip"] ?? faker.location.zipCode();

  const name = `${faker.helpers.arrayElement([city, county])} ${faker.helpers.arrayElement(districtSuffixes)}`;
  return {
    name: name,
    type: "district",
    status: "active",
    "metadata.address1": street,
    "metadata.city": city,
    "metadata.state": state,
    "metadata.postCode": zip,
    sourcedId: faker.string.uuid(),
  };
};
