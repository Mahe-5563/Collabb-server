const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;


const JobPostSchema = new Schema({
    userid: { type: String, required: true },
    budget_amount: { type: String },
    budget_maxamt: { type: String },
    budget_minamt: { type: String },
    budget_paytype: { type: String, required: true },
    budget_restraints: { type: String },
    jd_description: { type: String, required: true },
    jd_enddate: { type: String, required: true },
    jd_experience: { type: String, required: true },
    jd_jobtitle: { type: String, required: true },
    jd_skills: { type: Array, required: true },
    jd_startdate: { type: String, required: true },
}, { timestamps: true });

const JobPostModel = Mongoose.model("JobPostSchema", JobPostSchema);
module.exports = JobPostModel;