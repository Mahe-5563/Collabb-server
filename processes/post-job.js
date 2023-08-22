const UserDetailsModel = require("../models/users");
const JobPostModel = require("../models/clients/create-job-post");

exports.checkJobPostAmountCriteria = function (jobpostObj) {
  let flag = false;
  if(
    (jobpostObj.budget.paymentType.toLowerCase() == "per hour" && jobpostObj.budget.minAmt && jobpostObj.budget.maxAmt) ||
    (jobpostObj.budget.paymentType.toLowerCase() == "project" && jobpostObj.budget.amount)
  ) {
    flag = true;
  }

  return flag;
};

exports.processCreateJobPost = function (jobDetails, resp) {
  const userId = jobDetails?.userId;
  const { budget, jobDescription, category, subcategory } = jobDetails;

  UserDetailsModel
    .findById(userId)
    .then(res => {
      console.info("res: ", res);
      new JobPostModel({
        userid: userId,
        budget_paytype: budget.paymentType,
        budget_amount: 
          budget.paymentType.toLowerCase() == "project" 
            ? budget.amount 
            : undefined,
        budget_maxamt: 
          budget.paymentType.toLowerCase() == "per hour" 
            ? budget.maxAmt 
            : undefined,
        budget_minamt:
          budget.paymentType.toLowerCase() == "per hour"
            ? budget.minAmt
            : undefined,
        budget_restraints: budget.restraints,
        jd_jobtitle: jobDescription.jobTitle,
        jd_startdate: jobDescription.startDate,
        jd_enddate: jobDescription.endDate,
        jd_skills: jobDescription.skills,
        jd_experience: jobDescription.experience,
        jd_description: jobDescription.description,
        job_category: category,
        job_subcategory: subcategory,
        applicants: [],
      })
        .save()
        .then(res => {
          console.info("res: ", res);
          resp.send({ message: "Post job created successfully!", status: 200, res });
        })
        .catch(fail => {
          console.info("fail: ", fail);
          resp.statusCode = 400;
          resp.statusMessage = "Error in creating job post";
          resp.send({ message: "Error in creating job post", status: 400, fail });
        })
    })
};
