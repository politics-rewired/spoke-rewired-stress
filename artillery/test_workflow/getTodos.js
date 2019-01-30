var request = require("request");

module.exports = ({ organizationId, cookie }) =>
  new Promise((resolve, reject) => {
    var request = require("request");

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
          "query getTodos($organizationId: String!, $needsMessageFilter: ContactsFilter, $needsResponseFilter: ContactsFilter, $badTimezoneFilter: ContactsFilter, $completedConvosFilter: ContactsFilter, $pastMessagesFilter: ContactsFilter, $skippedMessagesFilter: ContactsFilter) {\n  currentUser {\n    id\n    terms\n    todos(organizationId: $organizationId) {\n      id\n      campaign {\n        id\n        title\n        description\n        useDynamicAssignment\n        hasUnassignedContacts\n        introHtml\n        primaryColor\n        logoImageUrl\n      }\n      maxContacts\n      unmessagedCount: contactsCount(contactsFilter: $needsMessageFilter)\n      unrepliedCount: contactsCount(contactsFilter: $needsResponseFilter)\n      badTimezoneCount: contactsCount(contactsFilter: $badTimezoneFilter)\n      totalMessagedCount: contactsCount(contactsFilter: $completedConvosFilter)\n      pastMessagesCount: contactsCount(contactsFilter: $pastMessagesFilter)\n      skippedMessagesCount: contactsCount(contactsFilter: $skippedMessagesFilter)\n    }\n  }\n}\n",
        variables: {
          organizationId,
          needsMessageFilter: {
            messageStatus: "needsMessage",
            isOptedOut: false,
            validTimezone: true
          },
          needsResponseFilter: {
            messageStatus: "needsResponse",
            isOptedOut: false,
            validTimezone: true
          },
          badTimezoneFilter: { isOptedOut: false, validTimezone: false },
          completedConvosFilter: {
            isOptedOut: false,
            validTimezone: true,
            messageStatus: "messaged"
          },
          pastMessagesFilter: {
            messageStatus: "convo",
            isOptedOut: false,
            validTimezone: true
          },
          skippedMessagesFilter: {
            messageStatus: "closed",
            isOptedOut: false,
            validTimezone: true
          }
        },
        operationName: "getTodos"
      },
      json: true
    };
    request(options, function(error, response, body) {
      if (error) return reject(error);
      return resolve(body);
    });
  });
