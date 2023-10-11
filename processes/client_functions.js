const ClientAccDetailsModel = require("../models/clients/clients");
const JobPostModel = require("../models/clients/create-job-post");
const TalentAccDetailsModel = require("../models/talents/talents");
const UserDetailsModel = require("../models/users");

exports.getClientJobPosts = function (userid, resp) {
    JobPostModel
    .find({ userid })
    .then(res => {
        resp.send({ 
            message:  "Fetched job details successfully",
            res,
            status: 200,
        });
    })
    .catch(res => 
        resp.send({ 
            message:  "Failed to fetch job details",
            res,
            status: 400,
        }))
}

exports.getTalentsList = async function (filters, resp) {
    const { pageno = 1, name, categoryid } = filters;
    const pageSize = 10;
    const skipCount = (pageno - 1) * pageSize;
    UserDetailsModel
    .find({ 
        usertype: "talent",
        ...name && {
            "$expr": {
                "$regexMatch": {
                    "input": { "$concat": ["$firstName", " ", "$lastName"] },
                    "regex": name,
                    "options": "i"
                }
            }
        }
    })
    .limit(pageSize)
    .skip(skipCount)
    .then(async res => {
        let usersArr = [];
        for (const talent of res) {
            const catTal = await TalentAccDetailsModel.findOne({ userid: talent._id, ...categoryid && {categoryid} })
            console.info(catTal);
            if(catTal)
                usersArr.push({ userDetail: talent, profileDetail: catTal });
        }

        if(usersArr.length > 0) {
            resp.statusCode = 200;
            resp.send({
                res: usersArr,
                message: "Fetched details!",
                size: usersArr.length,
                total_records: (await UserDetailsModel.find({ usertype: "talent" })).length
            });
        } else {
            resp.statusCode = 200;
            resp.send({
                res: usersArr,
                size: usersArr.length,
                message: "Cannot find users!",
            });
        }
    })
    // db.InspirationalWomen.find({first_name: { $regex: /Harriet/i} })
    /* TalentAccDetailsModel
    .find()
    .limit(10)
    .skip(skipCount)
    .then(res => {
        console.info(res);
        resp.send({
            res
        })
    }) */
}