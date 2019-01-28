var request = require("request");

module.exports = ({ campaignId, cookie }) =>
  new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: "https://spoke-fly.edgeapp.net/graphql",
      headers: {
        cookie,
        "content-type": "application/json"
      },
      body: {
        query:
          "query getContacts($assignmentId: String!, $contactsFilter: ContactsFilter!) {\n  assignment(id: $assignmentId) {\n    id\n    userCannedResponses {\n      id\n      title\n      text\n      isUserCreated\n    }\n    campaignCannedResponses {\n      id\n      title\n      text\n      isUserCreated\n    }\n    texter {\n      id\n      firstName\n      lastName\n      assignedCell\n    }\n    campaign {\n      id\n      isArchived\n      useDynamicAssignment\n      organization {\n        id\n        textingHoursEnforced\n        textingHoursStart\n        textingHoursEnd\n        threeClickEnabled\n        optOutMessage\n      }\n      customFields\n      interactionSteps {\n        id\n        script\n        question {\n          text\n          answerOptions {\n            value\n            nextInteractionStep {\n              id\n              script\n            }\n          }\n        }\n      }\n    }\n    contacts(contactsFilter: $contactsFilter) {\n      id\n    }\n    allContactsCount: contactsCount\n  }\n}\n",
        variables: {
          contactsFilter: {
            messageStatus: "needsMessage",
            isOptedOut: false,
            validTimezone: true
          },
          assignmentId: campaignId
        },
        operationName: "getContacts"
      },
      json: true
    };

    request(options, function(error, response, body) {
      if (error) return reject(error);
      return resolve(body);
    });
  });
