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
  if (response.body.data) {
	  const assignment = response.body.data.assignment || {};
    const contacts = response.body.data.assignment.contacts || [];
    const contactIds = contacts.map(contact => contact.id);

    const contactIdBatches = _.chunk(contactIds, 10);

    context.vars.contactIdBatches = contactIdBatches;
    context.vars.contactIdBatchCount = contactIdBatches.length;
  } else {
    context.vars.contactIdBatches = [];
    context.vars.contactIdBatchCount = 0;
  }
  return next();
}

function captureAssignmentContacts(requestParams, response, context, ee, next) {
  let assignmentContacts = [];
  if (response.body.data) {
	  assignmentContacts = response.body.data.getAssignmentContacts;
  }
  context.vars.assignmentContacts = assignmentContacts;
  return next();
}

function captureTextSuccessStatus(requestParams, response, context, ee, next) {
  let successful = false;
  if (response.body.data) {
	  successful = !!response.body.data.sendMessage;
  } else {
	  console.log(JSON.stringify(response.body));
  }
  context.vars.successful = successful;
  return next();
}
