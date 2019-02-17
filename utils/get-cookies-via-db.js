require("dotenv").config();
const fs = require("fs");
const papaparse = require("papaparse");
const faker = require("faker");
const { createCookieString } = require("./generate-cookie");

const db = require("knex")({
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_USE_SSL
  },
  pool: {
    min: 2,
    max: 10
  }
});

const outputPath = "./cookies.csv";

main()
  .then(console.log)
  .catch(console.error);

async function main() {
  return await createUsers(20);
}

async function createUsers(numberOfUsers) {
  const organization = {
    id: 1,
    uuid: "stress-test-organization-uuid",
    name: "Stress Test Organization"
  };

  const users = new Array(numberOfUsers).fill(null).map((_, idx) => ({
    id: idx,
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
      user_id: idx,
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

  users.push(admin);
  userOrganizations.push(adminOrganization);

  await db.transaction(async trx => {
    await trx.insert(organization).into("public.organization");
    await trx.insert(users).into("public.user");
    await trx.insert(userOrganizations).into("public.user_organization");
    return "Success";
  });

  const cookies = users.map(({ auth0_id }) => createCookieString(auth0_id));
  const output = papaparse.unparse(cookies);
  fs.writeFileSync(outputPath, output);
  return "Done";
}
