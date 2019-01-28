const fs = require("fs");
const faker = require("faker");
const DEFAULT_FILE_SIZE = 100;

const produceFakeList = (path, count) => {
  const header = [["external_id", "firstName", "lastName", "phone"]];
  const people = new Array(count)
    .fill(null)
    .map(_ => [
      faker.random.alphaNumeric(),
      faker.name.firstName(),
      faker.name.lastName(),
      faker.phone.phoneNumber()
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
