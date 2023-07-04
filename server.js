// imports
const express = require('express');
const mongoose = require('mongoose');
// const createAccount = require('./processes/create-account');
const { processCreateAccount, checkUserDetailsValidity } = require('./processes/create-account');

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

app.post("/create-account", async (req, res) => {
    const userDetail = req.body;
    // console.info("userDetail: ", userDetail);
    if(checkUserDetailsValidity(userDetail)) {
        processCreateAccount(userDetail, res);
    } else {
        res.send({ message: "User exists!" });
    }
});

app.post("/create-new-user", (req, res) => {
    // console.info()
})

app.use((req, res) => {
    console.info("Got hit here!!");
    res.send({ status: "404", message: "Not Found" });
})
