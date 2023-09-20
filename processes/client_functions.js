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