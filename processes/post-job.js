const UserDetailsModel = require("../models/users");
const JobPostModel = require("../models/clients/create-job-post");

exports.checkJobPostAmountCriteria = function (jobpostObj) {
  let flag = false;
  if(
    (jobpostObj.budget.budget_paytype.toLowerCase() == "per hour" && jobpostObj.budget.budget_minamt && jobpostObj.budget.budget_maxamt) ||
    (jobpostObj.budget.budget_paytype.toLowerCase() == "project" && jobpostObj.budget.budget_amount)
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
        budget_paytype: budget.budget_paytype,
        budget_amount: 
          budget.budget_paytype.toLowerCase() == "project" 
            ? budget.budget_amount 
            : undefined,
        budget_maxamt: 
          budget.budget_paytype.toLowerCase() == "per hour" 
            ? budget.budget_maxamt 
            : undefined,
        budget_minamt:
          budget.budget_paytype.toLowerCase() == "per hour"
            ? budget.budget_minamt
            : undefined,
        budget_restraints: budget.budget_restraints,
        jd_jobtitle: jobDescription.jd_jobtitle,
        jd_duration: jobDescription.jd_duration,
        // jd_startdate: jobDescription.jd_startdate,
        // jd_enddate: jobDescription.jd_enddate,
        jd_skills: jobDescription.jd_skills,
        jd_experience: jobDescription.jd_experience,
        jd_description: jobDescription.jd_description,
        job_category: category,
        job_subcategory: subcategory,
        applicants: [],
        job_status: "justnow", // working // completed
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
