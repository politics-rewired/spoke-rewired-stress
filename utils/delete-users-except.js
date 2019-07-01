/**
 * This CLI script is used to clean up Auth0 users created for testing purposes.
 *
 * It takes a comma-separated list of users to keep, fetches all Auth0 users, and deletes every
 * user that is not in the exception list.
 *
 *     node delete-users-except.js user1@domain.com,user2@domain.com,user3@domain.com
 */

require("dotenv").config();
const request = require("superagent");

const { AUTH0_DOMAIN, AUTH0_API_MANAGEMENT_TOKEN } = process.env;

const url = path => `https://${AUTH0_DOMAIN}/api/v2${path}`;

const postprocess = chainable =>
  chainable.set("Authorization", `Bearer ${AUTH0_API_MANAGEMENT_TOKEN}`);

const listAllUsers = () => postprocess(request.get(url("/users")));
const deleteUser = id => postprocess(request.delete(url(`/user/${id}`)));

async function main(except) {
  const exceptions = except.split(",");

  const allUsers = await listAllUsers();
  const toDelete = allUsers.body
    .filter(user => !exceptions.includes(user.email))
    .map(user => user.user_id);

  for (let user of toDelete) {
    await deleteUser(user);
  }

  return `Deleted ${toDelete.length}`;
}

main(process.argv[2])
  .then(console.log)
  .catch(console.error);
