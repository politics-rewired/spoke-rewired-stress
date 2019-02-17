require("dotenv").config();
const fs = require("fs");
const papaparse = require("papaparse");
const faker = require("faker");
const { createCookieString } = require("./generate-cookie");

const db = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10
  }
});

const createOrg = process.env.CREATE_ORG !== 'false'
  && process.env.CREATE_ORG !== false
  && !!process.env.CREATE_ORG;

const idxOffset = process.env.INDEX_OFFSET || 0;

const outputPath = "./cookies.csv";

main()
  .then(console.log)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

async function main() {
  return await createUsers(2500);
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
      await trx.insert(organization).into("public.organization");
    }
    await trx.insert(users).into("public.user");
    await trx.insert(userOrganizations).into("public.user_organization");
    return "Success";
  });

  const cookies = users.map(({ auth0_id }) => createCookieString(auth0_id));
  const output = papaparse.unparse(cookies);
  fs.writeFileSync(outputPath, output);
  return "Done";
}
