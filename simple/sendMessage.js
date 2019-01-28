var request = require("request");

module.exports = ({
  campaignContactId,
  contactNumber,
  userId,
  text,
  assignmentId,
  cookie
}) =>
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
          "mutation sendMessage($message: MessageInput!, $campaignContactId: String!) {\n  sendMessage(message: $message, campaignContactId: $campaignContactId) {\n    id\n    messageStatus\n    messages {\n      id\n      createdAt\n      text\n      isFromContact\n    }\n  }\n}\n",
        variables: {
          message: { contactNumber, userId, text, assignmentId },
          campaignContactId: campaignContactId
        },
        operationName: "sendMessage"
      },
      json: true
    };

    request(options, function(error, response, body) {
      if (error) return reject(error);
      return resolve(body);
    });
  });
