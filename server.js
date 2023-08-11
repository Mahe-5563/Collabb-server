// imports
const express = require('express');
const mongoose = require('mongoose');
// const createAccount = require('./processes/create-account');
const { processCreateAccount, checkUserDetailsValidity } = require('./processes/create-account');
const UserDetailsModel = require("./models/users");
const { checkJobPostAmountCriteria, processCreateJobPost } = require('./processes/post-job');

// app listener
const port_number = 3001;

const app = express();
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
        processCreateJobPost(jobDetails);
    } else {
        res.send({ message: "Invalid amount configured." });
    }
})

app.use((req, res) => {
    console.info("Got hit here!!");
    res.send({ status: "404", message: "Not Found" });
})
