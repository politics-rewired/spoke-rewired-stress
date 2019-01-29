module.exports = {
  captureContactIds: captureContactIds
}

// For signature reference
function setJSONBody(requestParams, context, ee, next) {
  return next(); // MUST be called for the scenario to continue
}

function captureContactIds(requestParams, response, context, ee, next) {
  var contacts = response.body.data.assignment.contacts;
  var contactIds = contacts.map(contact => contact.id);
  context.vars.contactIds = contactIds;
  return next();
}
