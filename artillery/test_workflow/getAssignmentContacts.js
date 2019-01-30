var request = require("request");

module.exports = ({ assignmentId, contactIds, cookie }) =>
  new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: "https://spoke-fly.edgeapp.net/graphql",
      headers: {
        cookie,
        "x-twilio-signature": "Mx6BEwDjYFmqaerF80I0Sfcl2oY=",
        "content-type": "application/json"
      },
      body: {
        query:
          "mutation getAssignmentContacts($assignmentId: String!, $contactIds: [String]!, $findNew: Boolean) {\n  getAssignmentContacts(assignmentId: $assignmentId, contactIds: $contactIds, findNew: $findNew) {\n    id\n    assignmentId\n    firstName\n    lastName\n    cell\n    zip\n    customFields\n    optOut {\n      id\n    }\n    questionResponseValues {\n      interactionStepId\n      value\n    }\n    location {\n      city\n      state\n      timezone {\n        offset\n        hasDST\n      }\n    }\n    messageStatus\n    messages {\n      id\n      createdAt\n      text\n      isFromContact\n    }\n  }\n}\n",
        variables: { assignmentId, contactIds, findNew: true },
        operationName: "getAssignmentContacts"
      },
      json: true
    };

    request(options, function(error, response, body) {
      if (error) return reject(error);
      return resolve(body);
    });
  });
