// import MessagingModel from "../models/messages";
const MessagingModel = require("../models/messages");

exports.postNewMessage = (messageThread, res) => {
  const {
    clientid,
    talentid,
    messageid,
    messagecontent,
    attachments,
    fromreci,
    toreci,
    threadtitle,
  } = messageThread;

  MessagingModel.find({
    threadtitle,
  }).then((resMM) => {
    if (resMM.length == 0) {
      new MessagingModel({
        clientid,
        talentid,
        threadtitle,
        messages: [
          {
            messageid,
            messagecontent,
            attachments,
            fromreci,
            toreci,
          },
        ],
      })
        .save()
        .then((resSave) => {
          // console.info("Response: ", resSave);
          res.send({
            res: resSave,
          });
        })
        .catch((failSave) => {
          res.statuscode = 400;
          res.send({
            res: failSave,
          });
        });
    } else {
      res.send({
        res: "Message thread already exists between the users.",
      });
    }
  });
};
