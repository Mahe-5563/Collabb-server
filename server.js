// imports
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const {
  processCreateAccount,
  checkUserDetailsValidity,
  getListOfAllUsersDetails,
} = require("./processes/create-account");
const UserDetailsModel = require("./models/users");
const {
  checkJobPostAmountCriteria,
  processCreateJobPost,
} = require("./processes/post-job");
const {
  getProfileDetails,
  getJobPosts,
  getTalentApplications,
} = require("./processes/talent_functions");
const JobPostModel = require("./models/clients/create-job-post");
const { getClientJobPosts, getTalentsList } = require("./processes/client_functions");
const TalentAccDetailsModel = require("./models/talents/talents");
const ClientAccDetailsModel = require("./models/clients/clients");
const { postNewMessage, appendMessage } = require("./processes/messaging");
const MessagesModel = require("./models/messages");

// app listener
const port_number = 3001;

const app = express();
const upload = multer();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to mongo db
const dbURI = `mongodb+srv://mahe:bQV11J0MxQW0W4Bx@cluster0.ndgc2tv.mongodb.net/db_collabb?retryWrites=true&w=majority`;
mongoose
  .connect(dbURI)
  .then((response) => {
    console.info("Connected to DB!");
    app.listen(port_number, () => {
      console.info(`Running on port number... ${port_number}`);
    });
  })
  .catch((fail) => console.error(fail));

// Requests...
app.get("/", (req, res) => {
  res.send({ status: "200", message: "Index page" });
});

// GET METHODS...
app.get("/get-user-by-email", (req, res) => {
  const userDetail = req.query;
  UserDetailsModel.findOne({
    email: userDetail.field_email,
  })
    .then((result) => {
      let respObj = {
        message: !result ? "User does not exists" : "User exist",
        bool: !result,
        statuscode: 200,
        res: result,
      };
      res.send(respObj);
    })
    .catch((fail) => {
      res.send({ res: fail, message: "Something has gone wrong!" });
    });
});

app.get("/get-user-by-id", (req, res) => {
  const userDetail = req.query;
  UserDetailsModel.findById(userDetail.id)
    .then((result) => {
      console.info("result: ", result);
      let respObj = {
        message: !result ? "User does not exists" : "User exist",
        bool: !result,
        statuscode: result ? 200 : 404,
        res: result,
      };
      res.send(respObj);
    })
    .catch((fail) => {
      res.send({ res: fail, message: "Something has gone wrong!" });
    });
});

app.get("/get-profile-details", (req, res) => {
  const profileDetails = req.query;
  getProfileDetails(profileDetails, res);
});

app.get("/get-job-posts", (req, res) => {
  const jobCategory = req.query;
  getJobPosts(jobCategory.category, res);
});

app.get("/get-talent-applications", (req, res) => {
  const userid = req.query.userid;
  getTalentApplications(userid, res);
});

app.get("/get-client-job-posts", (req, res) => {
  const userid = req.query.userid;
  getClientJobPosts(userid, res);
});

app.get("/get-talents", (req, res) => {
    const filters = req.query;
    getTalentsList(filters, res);
})

app.get("/get-users-messages", (req, res) => {
  const userid = req.query.userid;

  MessagesModel.find({
    $or: [
      { clientid: userid },
      { talentid: userid },
    ]
  }).then(resp => {
    res.send({
      res: resp,
      message: "Fetched user messages."
    })
    // console.info("resp: ", resp);
  }).catch(fail => {
    res.send({
      res: fail,
      message: "Failed to fetch user messages."
    })
    // console.info("fail: ", fail);
  })
})

// POST METHODS...
app.post("/create-account", async (req, res) => {
  const userDetail = req.body;
  // console.info("userDetail: ", userDetail);
  if (checkUserDetailsValidity(userDetail)) {
    processCreateAccount(userDetail, res);
  } else {
    res.send({ message: "Invalid user." });
  }
});

app.post("/create-job-post", (req, res) => {
  const jobDetails = req.body;

  if (checkJobPostAmountCriteria(jobDetails)) {
    processCreateJobPost(jobDetails, res);
  } else {
    res.send({ message: "Invalid amount configured." });
  }
});

app.post("/get-all-users", async (req, res) => {
  const users = req.body.applicants;
  if (users.length > 0) {
    await getListOfAllUsersDetails(users, res);
  } else {
    res.send({
      message: "Users array is empty",
      status: 404,
    });
  }
});

app.post("/create-new-message", async(req, res) => {
  const messageThread = req.body;
  const { clientid, talentid } = messageThread;
  const isThreadExists = MessagesModel.find({ clientid, talentid });
  if((await isThreadExists).length > 0) {
    appendMessage(messageThread, res);
  } else {
    postNewMessage(messageThread, res);
  }
})

// PATCH METHODS...
app.patch("/update-job-post", async (req, res) => {
  const jobPostUpdateDetails = req.body;
  const jobPostId = req.query.id;

  if (jobPostId && jobPostUpdateDetails.key && jobPostUpdateDetails.value) {
    JobPostModel.findById(jobPostId)
      .then((resp) => {
        // console.info(resp)
        if (!resp.applicants.includes(jobPostUpdateDetails.value)) {
          JobPostModel.updateOne(
            { _id: jobPostId },
            {
              $push: { [jobPostUpdateDetails.key]: jobPostUpdateDetails.value },
            }
          )
            .then((respo) => {
              res.statusCode = 200;
              res.send({
                res: respo,
                message: `${jobPostUpdateDetails.key} updated successfully!`,
              });
            })
            .catch((fail) => {
              res.statusCode = 404;
              res.send({
                res: fail,
                message: `${jobPostUpdateDetails.key} failed to update!`,
              });
            });
        } else {
          res.statusCode = 400;
          res.send({ message: "User has already applied to this job" });
        }
      })
      .catch((resp) => {
        res.statusCode = 400;
        res.send({ message: "Cannot find the job post" });
      });
  }
});

app.patch("/apply-for-job", async (req, res) => {
  const jobPostUpdateDetails = req.body;
  const jobPostId = req.query.id;

  if (jobPostId && jobPostUpdateDetails.applicant) {
    JobPostModel.findById(jobPostId)
      .then((resp) => {
        // !resp.applicants.includes(jobPostUpdateDetails.applicant)
        if (
          resp.applicants?.filter(
            (applicant) => applicant?.userid == jobPostUpdateDetails?.applicant
          ).length == 0
        ) {
          JobPostModel.updateOne(
            { _id: jobPostId },
            {
              $push: {
                applicants: {
                  userid: jobPostUpdateDetails.applicant,
                  status: "Pending",
                  dateOfAppl: +new Date(),
                  lastUpdated: +new Date(),
                },
              },
            }
          )
            .then((respo) => {

                TalentAccDetailsModel.updateOne(
                    { userid: jobPostUpdateDetails.applicant },
                    {
                        $push: {
                            myjobs: {
                                jobid: jobPostId,
                                status: "Pending",
                                dateOfAppl: +new Date(),
                                lastUpdated: +new Date(),
                            }
                        }
                    }
                ).then(() => {
                    res.statusCode = 200;
                    res.send({
                        res: respo,
                        message: `${jobPostUpdateDetails.applicant} updated successfully!`,
                    });
                }).catch(err => {
                    res.statusCode = 404;
                    res.send({
                        res: fail,
                        message: `Failed to update talent model!`,
                    });
                })
            })
            .catch((fail) => {
              res.statusCode = 404;
              res.send({
                res: fail,
                message: `${jobPostUpdateDetails.applicant} failed to update!`,
              });
            });
        } else {
          res.statusCode = 400;
          res.send({ message: "User has already applied to this job" });
        }
      })
      .catch((resp) => {
        res.statusCode = 400;
        res.send({ message: "Cannot find the job post" });
      });
  }
});

app.patch("/update-applicant-status", async (req, res) => {
  const jobStatus = req.body.status;
  const jobApplicantId = req.body.applicant;
  const jobPostId = req.query.id;

  if (jobPostId && jobStatus) {
    JobPostModel.findById(jobPostId)
      .then((resp) => {
        JobPostModel.updateOne(
          { _id: jobPostId, "applicants.userid": jobApplicantId },
          {
            $set: {
              "applicants.$.status": jobStatus,
              "applicants.$.lastUpdated": +new Date(),
              job_status: jobStatus == "Accept" ? "working" : resp.job_status
            },
          }
        )
          .then((respo) => {
            TalentAccDetailsModel.updateOne(
                { userid: jobApplicantId, "myjobs.jobid": jobPostId },
                {
                    $set: {
                        "myjobs.$.status": jobStatus,
                        "myjobs.$.lastUpdated": +new Date(),
                    }
                }
            )
            res.statusCode = 200;
            res.send({
              res: respo,
              message: `Status updated successfully!`,
            });
          })
          .catch((fail) => {
            res.statusCode = 400;
            res.send({
              res: fail,
              message: `Failed to update!`,
            });
          });
      })
      .catch((resp) => {
        res.statusCode = 400;
        res.send({ message: "Cannot find the job post" });
      });
  }
});

app.patch("/update-current-status", async (req, res) => {
  const currentStatus = req.body.status;
  const currentUser = req.query.id; // talent id

  TalentAccDetailsModel.updateOne(
    { userid: currentUser },
    { $set: { workstatus: currentStatus } }
  )
    .then((resp) => {
      res.statusCode = 200;
      res.send({
        resp,
      });
    })
    .catch((fail) => {
      res.statusCode = 400;
      res.send({
        resp: fail,
      });
    });
});

app.patch("/update-followers", async (req, res) => {
  const followerId = req.body.followerid; // client id
  const currentUser = req.query.id; // talent id

  TalentAccDetailsModel.findOneAndUpdate(
    { userid: currentUser },
    { $addToSet: { followers: followerId } }
  )
    .then((resp) => {
      res.statusCode = 200;
      res.send({
        resp,
      });
    })
    .catch((fail) => {
      res.statusCode = 400;
      res.send({
        resp: fail,
      });
    });
});

app.patch("/update-favourites", async (req, res) => {
  const favouriteId = req.body.favouriteid; // talent id
  const currentUser = req.query.id; // client id

  ClientAccDetailsModel.findOneAndUpdate(
    { userid: currentUser },
    { $addToSet: { favourites: favouriteId } }
  )
    .then((resp) => {
      res.statusCode = 200;
      res.send({
        resp,
      });
    })
    .catch((fail) => {
      res.statusCode = 400;
      res.send({
        resp: fail,
      });
    });
});

app.patch("/update-job-status", async(req, res) => {
    const jobStatus = req.body.job_status; // job status
    const jobPostId = req.query.id; // job post id

    JobPostModel.updateOne(
        { _id: jobPostId },
        { $set: { job_status: jobStatus } }
    ).then(resp => {
        res.statusCode = 200;
        res.send({
            res: resp,
            message: `Status updated successfully!`,
        });
    }).catch(fail => {
        res.statusCode = 400;
        res.send({
            res: fail,
            message: `Error in updating job status!`,
        });
    })
})

app.use((req, res) => {
  console.info("Got hit here!!");
  res.send({ status: "404", message: "Not Found" });
});
