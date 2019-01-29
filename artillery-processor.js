const _ = require("lodash");

module.exports = {
  captureContactIds,
  captureAssignmentContacts,
  captureTextSuccessStatus
};

// For signature reference
function setJSONBody(requestParams, context, ee, next) {
  return next(); // MUST be called for the scenario to continue
}

function captureContactIds(requestParams, response, context, ee, next) {
  const contacts = response.body.data.assignment.contacts;
  const contactIds = contacts.map(contact => contact.id);

  const contactIdBatches = _.chunk(contactIds, 10);

  context.vars.contactIdBatches = contactIdBatches;
  context.vars.contactIdBatchCount = contactIdBatches.length;
  return next();
}

function captureAssignmentContacts(requestParams, response, context, ee, next) {
  const assignmentContacts = response.body.data.getAssignmentContacts;
  context.vars.assignmentContacts = assignmentContacts;
  return next();
}

function captureTextSuccessStatus(requestParams, response, context, ee, next) {
  const successful = !!response.data.sendMessage;
  context.vars.successful = successful;
  return next();
}
