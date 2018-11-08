const Message = require("../models/message");
const saveMessageTransaction = require("../transactions/saveMessage");
// const updateCreditTransaction = require("../transactions/updateCredit");

module.exports = function(messageParams, cb) {
  const MessageModel = Message();
  let message = new MessageModel(messageParams);

  if (message.status == "OK") {

    //post to edit transaction

    updateCreditTransaction(
      {
        amount: { $gte: 1 },
        location: message.location.name
      },
      {
        $inc: { amount: -message.location.cost }
      },
      function(doc, error) {
        if (error) {
          return cb(undefined, error);
        } else if (doc == undefined) {
          let error = "Not enough credit";
          console.log(error);
          cb(undefined, error);
        } else {
          saveMessageTransaction(messageParams, cb);
        }
      }
    );
  } else {
    saveMessageTransaction(messageParams, cb);
  }
};
