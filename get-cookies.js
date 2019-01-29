const puppeteer = require("puppeteer");
const faker = require("faker");
const yaml = require("yaml");
const fs = require("fs");
const PASSWORD = "Password!";

async function main(n, outputPath) {
  const campaignJoinLink = process.argv[2];
  console.log(`Creating new users with campaign join link ${campaignJoinLink}`);
  const browser = await puppeteer.launch({ headless: false });

  const allCookies = [];

  let count = 0;
  while (count < n) {
    const cookies = await signUpUser(browser, campaignJoinLink);
    const toKeep = cookies
      .filter(cookie => cookie.name.includes("session"))
      .reduce((acc, kv) => Object.assign(acc, { [kv.name]: kv.value }), {});

    allCookies.push(toKeep);
    count++;
  }

  const output = yaml.stringify({ over: allCookies });
  fs.writeFileSync(outputPath, output);

  await browser.close();
  return "Done!";
}

const genUser = email => ({
  email: email,
  password: PASSWORD,
  given_name: faker.name.firstName(),
  family_name: faker.name.lastName(),
  cell: faker.phone.phoneNumberFormat()
});

async function signUpUser(browser, campaignJoinLink) {
  const email = `test.${faker.random.alphaNumeric(4)}@test.com`;
  const user = genUser(email);

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.goto(campaignJoinLink);

  await page.waitFor(".auth0-lock-tabs a:not(.auth0-lock-tabs-current)");
  await sleep(1000);
  await page.click(".auth0-lock-tabs a:not(.auth0-lock-tabs-current)");
  await sleep(1000);

  for (let input_name of Object.keys(user)) {
    const selector = `input[name="${input_name}"]`;
    await page.focus(selector);
    await page.keyboard.type(user[input_name]);
  }

  await page.click('input[type="checkbox"]');
  await sleep(1000);

  await page.click(".auth0-lock-submit");

  await page.waitFor("div#mount");
  const cookies = await page.cookies();
  await page.close();
  await context.close();

  return cookies;
}

const sleep = n =>
  new Promise((resolve, reject) => setTimeout(() => resolve(true), n));

main(process.argv[3] || 1, process.argv[4] || "./cookies.yml")
  .then(console.log)
  .catch(console.error);
