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
        opened: false,
        lastupdated: +new Date(),
      })
        .save()
        .then((resSave) => {
          // console.info("Response: ", resSave);
          res.send({
            res: resSave,
            message: "Message sent successfully!"
          });
        })
        .catch((failSave) => {
          res.statuscode = 400;
          res.send({
            res: failSave,
            message: "Message send failed!"
          });
        });
    } else {
      res.send({
        res: "Message thread already exists between the users.",
      });
    }
  });
};


exports.appendMessage = (messageThread, res) => {
    const {
        clientid,
        talentid,
        messageid,
        messagecontent,
        attachments,
        fromreci,
        toreci,
        // threadtitle,
    } = messageThread;

    MessagingModel.updateOne(
        { clientid, talentid },
        { 
            $push: { 
                messages: {
                    messageid,
                    messagecontent,
                    attachments,
                    fromreci,
                    toreci,
                },
            },
            $set: {
                lastupdated: +new Date(),
                opened: false,
            }
        }
    ).then(resp => {
        res.send({
            res: resp,
            message: "Message appended successfully!"
        })
    }).catch(fail => {
        res.send({
            res: fail,
            message: "Message append failed!"
        });
    })
}