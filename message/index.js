const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { Validator, ValidationError } = require("express-json-validator-middleware");
const { queueCreditCheck }  = require("./controllers/queueCredit");
const getMessages = require("./controllers/getMessages");
const getMessageStatus = require("./controllers/getMessageStatus");

require("./controllers/queueTx");

const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

app.post(
  "/messages",
  bodyParser.json(),
  validate({ body: messageSchema }),
  queueCreditCheck
);

app.get("/messages", getMessages);

app.get("/messages/:messageId/status", getMessageStatus);

app.use(function(err, req, res, next) {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});


app.listen(9007, function() {
  console.log("App started on PORT 9007");
});
