/**
 * CLI script to generate file of fake Spoke contacts for upload and use in testing.
 */

const fs = require("fs");
const faker = require("faker");
const DEFAULT_FILE_SIZE = 100;

const produceFakeList = (path, count) => {
  const header = [["external_id", "firstName", "lastName", "cell", "zip"]];
  const people = new Array(count)
    .fill(null)
    .map(_ => [
      faker.random.alphaNumeric(10),
      faker.name.firstName(),
      faker.name.lastName(),
      "+1" + faker.phone.phoneNumberFormat().replace(/-/g, ""),
      faker.address.zipCode()
    ]);

  fs.writeFileSync(
    `./${path}`,
    header
      .concat(people)
      .map(line => line.join(","))
      .join("\n")
  );
};

const command = process.argv[2];
if (command) {
  if (command === "fake-file") {
    const count = process.argv[3]
      ? parseInt(process.argv[3])
      : DEFAULT_FILE_SIZE;
    const out = process.argv[4] || "fake-file.csv";
    produceFakeList(out, count);
  }
}
