require("dotenv").config();
const request = require("superagent");

const url = path => `https://politicsrewired.auth0.com/api/v2${path}`;

const postprocess = chainable =>
  chainable.set(
    "Authorization",
    `Bearer ${process.env.AUTH0_API_MANAGEMENT_TOKEN}`
  );

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
