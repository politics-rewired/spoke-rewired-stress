const getTodos = require("./getTodos");
const getContacts = require("./getContacts");
const getAssignmentContacts = require("./getAssignmentContacts");
const sendMessage = require("./sendMessage");
const fs = require("fs");

const MAX_TEXTS = 2000;
const CHUNK_SIZE = 10;

async function main(acc, cookie) {
  let response;
  response = await getTodos({ organizationId: 1, cookie });
  const campaignId = response.data.currentUser.todos[0].campaign.id;
  const assignmentId = campaignId;
  const userId = response.data.currentUser.id;
  response = await getContacts({ campaignId, cookie });
  console.log(cookie);
  console.log(response);
  const contactIds = response.data.assignment.contacts.map(c => c.id);
  const chunks = _.chunk(contactIds.slice(0, MAX_TEXTS), CHUNKS_ZIE);

  for (let chunk of chunks) {
    response = await getAssignmentContacts({
      contactIds: chunk,
      userId,
      assignmentId,
      cookie
    });

    const contacts = response.data.getAssignmentContacts;

    for (let contact of contacts) {
      const start = new Date();
      response = await sendMessage({
        contactNumber: contact.cell,
        userId,
        text: "Text message!",
        assignmentId,
        campaignContactId: contact.id,
        cookie
      });
      const stop = new Date();
      acc.push(stop - start);
    }
  }
}

const cookies = [
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZTQ1OTQ1MDA0NDE3Y2Y5YzE3ZGNhIn19; session.sig=VHzrNXDgRncLzicpnMqyuy16gXw",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZTg5NzBkZWQzYjcwM2Y3ZTY3YmQ2In19; session.sig=nqDGLdumCZU4pD0uftL1um4t44o",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZTg5YTRhOWJjYmY3NTliNGIwNDMzIn19; session.sig=Jk-biB6gOA7Rh_Z3chyY8Kw3xdM",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThhMGUyYmU5OWM2ZDcxMGJiODM2In19; session.sig=1Qgow5vEEJDp5luwH-jgVLy4L9c",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiNmU2MDEzMWI1MTg5ZmQwMGVlIn19; session.sig=4J-EGP1grcrKvxLxHBDbTGubDXA",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiOGVhOWJjYmY3NTliNGIwNDQyIn19; session.sig=vkyS5WayGZyyjGjKE7mdNJMS7r0",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiYTlkZWQzYjcwM2Y3ZTY3YmU5In19; session.sig=a5eh-emmUfzIC5vrNLOsGE7ZoZg",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiYzNhOWJjYmY3NTliNGIwNDQ2In19; session.sig=1Fe2n9dVBg-jGQI2MDTQWbbzQVs",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThhNTc1NzllY2E0OGM4OTNhZWZlIn19; session.sig=Mm3pivxUzy3JoHtfZULpswZpRGY",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThhNzA1ZDM3M2QwODg3MGIzYjZjIn19; session.sig=mQ7MoCTVp7wSYArtFySVuIluiVY",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThhZTcyYmU5OWM2ZDcxMGJiODQwIn19; session.sig=Ou6F3sLpP9Za3Js8vBOFkdzXaGo",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiMDBjYzI4ZjA3MmI1MTNkNWU2In19; session.sig=vnEYS8pKdn_E1GNYjq8mosgKrkI",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiMWFhOWJjYmY3NTliNGIwNDQwIn19; session.sig=UbiIBTQXl9WZ46zB_5mdJjwZhdw",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiMzU1MDA0NDE3Y2Y5YzE3ZmRmIn19; session.sig=qABNKge5B-CweD2ZT12gT9aV2qA",
  "session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiYXV0aDB8NWM0ZThiNGM2ZTQzYjYzZmJmNTE1ZDVmIn19; session.sig=77Mr1EznpaUg2i43gu-cWyFdiuQ"
];

const accumulator = [];
const start = new Date();

Promise.all(cookies.map(cookie => main(accumulator, cookie)))
  .then(() => {
    const end = new Date();
    console.log(accumulator);
    console.log(`Test took ${end - start}`);
    fs.writeFileSync("./accumulator.json", JSON.stringify(accumulator));
  })
  .catch(console.error);
