// imports
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const { processCreateAccount, checkUserDetailsValidity } = require('./processes/create-account');
const UserDetailsModel = require("./models/users");
const { checkJobPostAmountCriteria, processCreateJobPost } = require('./processes/post-job');
const { getProfileDetails, getJobPosts, getTalentApplications } = require('./processes/talent_functions');
const JobPostModel = require('./models/clients/create-job-post');
const { getClientJobPosts } = require('./processes/client_functions');

// app listener
const port_number = 3001;

const app = express();
const upload = multer();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Connect to mongo db
const dbURI = `mongodb+srv://mahe:dbMahe7@cluster0.ndgc2tv.mongodb.net/db_collabb?retryWrites=true&w=majority`;
mongoose
    .connect(dbURI)
    .then(response => {
        console.info("Connected to DB!");
        app.listen(port_number, () => {
            console.info(`Running on port number... ${port_number}`);
        });
    })
    .catch(fail => console.error(fail));


// Requests...
app.get("/", (req, res) => {
    res.send({ status: "200", message: "Index page" });
});


// GET METHODS...
app.get("/get-user-by-email", (req, res) => {
    const userDetail = req.query;
    UserDetailsModel.findOne({ 
        email: userDetail.field_email,
    }).then(result => {
        let respObj = {
            message: !result ? "User does not exists" : "User exist",
            bool: !result,
            statuscode: 200,
            res: result,
        };
        res.send(respObj);
    }).catch(fail => {
        res.send({ res: fail, message: "Something has gone wrong!" });
    });
});

app.get("/get-user-by-id", (req, res) => {
    const userDetail = req.query;
    UserDetailsModel.findById(userDetail.id).then(result => {
        console.info("result: ", result);
        let respObj = {
            message: !result ? "User does not exists" : "User exist",
            bool: !result,
            statuscode: result ? 200 : 404,
            res: result,
        };
        res.send(respObj);
    }).catch(fail => {
        res.send({ res: fail, message: "Something has gone wrong!" });
    });
});

app.get("/get-profile-details", (req, res) => {
    const profileDetails = req.query;
    getProfileDetails(profileDetails, res);
})

app.get("/get-job-posts", (req, res) => {
    const jobCategory = req.query;
    getJobPosts(jobCategory.category, res);
})

app.get("/get-talent-applications", (req, res) => {
    const userid = req.query.userid;
    getTalentApplications(userid, res);
})

app.get("/get-client-job-posts", (req, res) => {
    const userid = req.query.userid;
    getClientJobPosts(userid, res);
})


// POST METHODS...
app.post("/create-account", async (req, res) => {
    const userDetail = req.body;
    // console.info("userDetail: ", userDetail);
    if(checkUserDetailsValidity(userDetail)) {
        processCreateAccount(userDetail, res);
    } else {
        res.send({ message: "Invalid user." });
    }
});

app.post("/create-job-post", (req, res) => {
    const jobDetails = req.body;

    if(checkJobPostAmountCriteria(jobDetails)){
        processCreateJobPost(jobDetails, res);
    } else {
        res.send({ message: "Invalid amount configured." });
    }
})

// PATCH METHODS...
app.patch("/update-job-post", async (req, res) => {
    const jobPostUpdateDetails = req.body;
    const jobPostId = req.query.id;

    if(jobPostId && jobPostUpdateDetails.key && jobPostUpdateDetails.value) {
        JobPostModel
            .findById(jobPostId)
            .then(resp => {
                // console.info(resp)
                if(!resp.applicants.includes(jobPostUpdateDetails.value)) {
                    JobPostModel
                        .updateOne(
                            { _id: jobPostId }, 
                            { $push: { [jobPostUpdateDetails.key]: jobPostUpdateDetails.value } }
                        )
                        .then(respo => {
                            res.statusCode = 200;
                            res.send({ res: respo, message: `${jobPostUpdateDetails.key} updated successfully!` });
                        })
                        .catch(fail => {
                            res.statusCode = 404;
                            res.send({ res: fail, message: `${jobPostUpdateDetails.key} failed to update!` });
                        }) 
                } else {
                    res.statusCode = 400;
                    res.send({ message: "User has already applied to this job" });
                }
            })
            .catch(resp => {
                res.statusCode = 400;
                res.send({ message: "Cannot find the job post" });
            })
    }
})

app.use((req, res) => {
    console.info("Got hit here!!");
    res.send({ status: "404", message: "Not Found" });
})
