/**
 * This CLI script generates a cookies.csv file of 30 credentials by inserting test users into the database and programatically
 *
 *     node get-cookies-via-db.js
 *
 * Environment variables:
 *   DB_HOST      - [required] Database host.
 *   DB_PORT      - [required] Database port.
 *   DB_NAME      - [required] Database name.
 *   DB_USER      - [required] Database username.
 *   DB_PASSWORD  - [required] Database user's password.
 *   CREATE_ORG   - [optional] Boolean indicating whether to create a text organization. Default = true.
 *   INDEX_OFFSET - [optional] Offset to add to primary index of users the script creates. Default = 0.
 */

require("dotenv").config();
const fs = require("fs");
const papaparse = require("papaparse");
const faker = require("faker");
const { createCookieString } = require("./lib/generate-cookie");

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  CREATE_ORG,
  INDEX_OFFSET
} = process.env;

const db = require("knex")({
  client: "mysql",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
  },
  pool: {
    min: 2,
    max: 10
  }
});

const createOrg =
  CREATE_ORG !== "false" && CREATE_ORG !== false && !!CREATE_ORG;

let idxOffset = INDEX_OFFSET || 0;
idxOffset = parseInt(idxOffset);

const outputPath = "./cookies.csv";

main()
  .then(console.log)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

async function main() {
  return await createUsers(30);
}

async function createUsers(numberOfUsers) {
  const organization = {
    id: 1,
    uuid: "stress-test-organization-uuid",
    name: "Stress Test Organization"
  };

  const users = new Array(numberOfUsers).fill(null).map((_, idx) => ({
    id: idx + idxOffset,
    auth0_id: `${idx}`,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    cell: faker.phone.phoneNumberFormat(),
    email: faker.internet.email(),
    is_superadmin: false,
    terms: true
  }));

  const userOrganizations = new Array(numberOfUsers)
    .fill(null)
    .map((_, idx) => ({
      user_id: idx + idxOffset,
      organization_id: 1,
      role: "TEXTER"
    }));

  const admin = {
    id: numberOfUsers,
    auth0_id: "UFX7LV4QN",
    first_name: "Ben",
    last_name: "Packer",
    email: "ben.paul.ryan.packer@gmail.com",
    cell: "2147010869"
  };

  const adminOrganization = {
    user_id: numberOfUsers,
    organization_id: 1,
    role: "ADMIN"
  };

  if (createOrg) {
    users.push(admin);
    userOrganizations.push(adminOrganization);
  }

  await db.transaction(async trx => {
    if (createOrg) {
      await trx.insert(organization).into("organization");
    }
    await trx.insert(users).into("user");
    await trx.insert(userOrganizations).into("user_organization");
    return "Success";
  });

  const cookies = users.map(({ auth0_id }) => createCookieString(auth0_id));
  const output = papaparse.unparse(cookies);
  fs.writeFileSync(outputPath, output);
  return "Done";
}
