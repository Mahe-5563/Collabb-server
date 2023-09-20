// import ClientAccDetailsModel from "../models/clients/clients";
// import TalentAccDetailsModel from "../models/talents/talents";
const ClientAccDetailsModel = require("../models/clients/clients");
const JobPostModel = require("../models/clients/create-job-post");
const TalentAccDetailsModel = require("../models/talents/talents");
const UserDetailsModel = require("../models/users");


exports.getProfileDetails = function (profileDetails, resp) {
    const { userid, accounttype } = profileDetails;

    UserDetailsModel
        .findById(userid)
        .then(userDetailsRes => {
            if(userDetailsRes.id) {
                switch (accounttype) {
                    case "talent":
                        TalentAccDetailsModel
                            .findOne({ userid })
                            .then(res => resp.send({ 
                                res: { 
                                    talentDetails: res, 
                                    userDetailsRes,
                                }, 
                                statusCode: 200, 
                                message: "Talent Details fetched successfully" 
                            }))
                            .catch(res => resp.send({ res, statusCode: 400, message: "Failed to fetch talent details" }))
                        break;
                    case "client":
                        ClientAccDetailsModel
                            .findOne({ userid })
                            .then(res => resp.send({ 
                                res: { 
                                    clientDetails: res, 
                                    userDetailsRes,
                                }, 
                                statusCode: 200, 
                                message: "Client Details fetched successfully" 
                            }))
                            .catch(res => resp.send({ res, statusCode: 400, message: "Failed to fetch client details" }))
                        break;
                    default:
                        resp.send({ message: "Invalid account type" })
                        break;
                }
            }
        })
        .catch(res => {
            resp.statusCode = 400;
            resp.statusMessage = "Error in creating job post";
            resp.send({ res, message: "Error in creating job post" });
        })

}

exports.getJobPosts = function (job_category, resp) {
    let fullObj = [];
    JobPostModel
        .find({ 'job_category.label': job_category })
        .sort({ "createdAt": "ascending" })
        .then(res => {

            res.map(async (jobDetail) => {
                const userid = jobDetail.userid;
                UserDetailsModel
                    .findById(userid)
                    .then(userDetail => {
                        fullObj.push({
                            jobDetail,
                            userDetail
                        })
                    })
                    .catch(fail => {
                        resp.send({ 
                            message:  "Failed to fetch user details",
                            res: fail,
                            status: 400,
                        })            
                    });
            })

            setTimeout(() => {
                if(fullObj) {
                    resp.send({ 
                        message:  "Fetched job details successfully",
                        fullObj,
                        status: 200,
                    });
                }
            }, 200);
        })
        .catch(res => 
            resp.send({ 
                message:  "Failed to fetch job details",
                res,
                status: 400,
            }))
}

exports.getTalentApplications = function (userid, resp) {
    JobPostModel
    .find({ applicants: userid })
    .then(res => {
        resp.send({
            message:  "Fetched talent applications successfully",
            res,
            status: 200,
        })
    })
    .catch(res => {
        resp.send({
            message:  "Failed to fetch job details",
            res,
            status: 400,
        })
    })
}