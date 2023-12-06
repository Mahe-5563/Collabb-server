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
    let skipCount;

    if(pageno < 1) {
        skipCount = pageSize;
    } else {
        skipCount = (pageno - 1) * pageSize;
    }
    
    TalentAccDetailsModel
    .find({
        ...categoryid && {categoryid}
    })
    .limit(pageSize)
    .skip(skipCount)
    .then(async res => {
        let usersArr = [];

        for(const user of res) {
            const tal = await 
                UserDetailsModel.findOne({ 
                    _id: user.userid, 
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
            if(tal){
                usersArr.push({ profileDetail: user, userDetail: tal });
            }
        }
        if(usersArr.length > 0) {
            resp.statusCode = 200;
            resp.send({
                res: usersArr,
                message: "Fetched details!",
                size: usersArr.length,
                total_records: (await TalentAccDetailsModel.find({...categoryid && {categoryid}})).length
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
}