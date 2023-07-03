// imports
const express = require('express');
const mongoose = require('mongoose');
const UserDetailsModel = require('./models/users');

// app listener
const port_number = 7777;
const host = "127.0.0.1";

const app = express();
app.use(express.urlencoded({extended: true}));

// Connect to mongo db
const dbURI = `mongodb+srv://mahe:dbMahe7@cluster0.ndgc2tv.mongodb.net/db_collabb?retryWrites=true&w=majority`;
mongoose
    .connect(dbURI)
    .then(response => {
        console.info("Connected to DB!");
        app.listen(port_number, host, () => {
            console.info(`Running on... http://${host}:${port_number}/`);
        });
    })
    .catch(fail => console.error(fail));


// Requests...
app.get("/", (req, res) => {
    // console.info("request: ", req.query);
    // UserDetailsModel.find({ email: "tarun@gmail.com" }).then(result => res.send(result)).catch(fail => res.send(fail));
    res.send({ key: "value" });
});

app.post("/post", (req, res) => {
    console.info("body: ", req);
    // console.info("params: ", req.params);
    // console.info("query: ", req.query);
    /* const userDetails = new UserDetailsModel({
        firstName: "Maheshwar", 
        lastName: "Arulraj",
        email: "maheshwar12345@gmail.com",
        password: "test123",
    }); */

    /* userDetails
        .save()
        .then(result => {
            console.info(`id: ${result.id}`);
            res.send(result);
        })
        .catch(fail => {
            res.send(fail);
        }); */
});

app.post("/create-new-user", (req, res) => {
    // console.info()
})

app.use((req, res) => {
    console.info("Got hit here!!");
})
