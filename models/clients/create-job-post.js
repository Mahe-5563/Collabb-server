const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;


const JobPostSchema = new Schema({
    userid: { type: String, required: true },
    budget_amount: { type: Number },
    budget_maxamt: { type: Number },
    budget_minamt: { type: Number },
    budget_paytype: { type: String, required: true },
    budget_restraints: { type: String },
    jd_description: { type: String, required: true },
    // jd_enddate: { type: String, required: true },
    jd_duration: { type: String, required: true },
    jd_experience: { type: String, required: true },
    jd_jobtitle: { type: String, required: true },
    jd_skills: { type: Array, required: true },
    // jd_startdate: { type: String, required: true },
    job_category: { type: Object, required: true },
    job_subcategory: { type: Object, required: true },
    applicants: { type: Array, required: true },
    job_status: { type: String, required: true },
}, { timestamps: true });

const JobPostModel = Mongoose.model("JobPostModel", JobPostSchema);
module.exports = JobPostModel;