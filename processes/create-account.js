const UserDetailsModel = require("../models/users");
const TalentAccDetailsModel = require("../models/talents/talents");
const ClientAccDetailsModel = require("../models/clients/clients");

/**
 * Function to check the validity of the user detail object
 *
 * @param {Object} userDetail - User details object
 * @returns
 */
exports.checkUserDetailsValidity = function (userDetail) {
  let flag = false;
  if (
    userDetail?.field_email &&
    userDetail?.field_first_name &&
    userDetail?.field_last_name &&
    userDetail?.field_pwd &&
    userDetail?.location.name &&
    userDetail?.profile_photo &&
    userDetail?.type
  ) {
    flag = true;
  }

  return flag;
};

/**
 * Function to check if the user is existing.
 * If the user is new, create account.
 *
 * @param {Object} userDetail - user details
 * @returns
 */
exports.processCreateAccount = async function (userDetail, resp) {
  const email = userDetail.field_email;
  const usertype = userDetail.type;
  // console.info("Step One success");

  UserDetailsModel.find({ 
    email, 
    usertype, 
  })
    .then((result) => {
      // console.info("result: ", result);
      if (result.length == 0) {
        // console.info("Step Two success");
        const userDetails = new UserDetailsModel({
          firstName: userDetail.field_first_name,
          lastName: userDetail.field_last_name,
          email: userDetail.field_email.toLowerCase(),
          password: userDetail.field_pwd,
          profileUri: userDetail.profile_photo.uri,
          usertype,
        });
        userDetails
          .save()
          .then((result) => {
            const userId = result.id;
            // console.info("User Details: ", result);

            switch (usertype) {
              case "talent":
                new TalentAccDetailsModel({
                  userid: userId,
                  category: userDetail.category,
                  subcategory: userDetail.sub_category,
                  location: userDetail.location.name,
                  locationcode: userDetail.location.code,
                  description: userDetail.description,
                  skills: userDetail.skills,
                  rate: userDetail.rate,
                  paytype: userDetail.pay_type,
                  experience: userDetail.experience,
                  categoryid: userDetail.category_id,
                  subcategoryid: userDetail.sub_category_id,
                  workstatus: "available", // busy, vacay
                  myjobs: [],
                })
                  .save()
                  .then(res => {
                    resp.send({ 
                      res: {
                        userDetail: result,
                        accountDetail: res,
                      }, 
                      message: "Account created successfully!", 
                      statuscode: 200 
                    });
                  })
                  .catch((fail) => {
                    userDetails.deleteOne({ _id: userId });
                    resp.send({ res: fail, message: "There's been a problem with creating the account" })
                  });
                break;
              case "client":
                if((userDetail?.account_type?.toLowerCase() == "personal") || (userDetail?.account_type?.toLowerCase() == "organisation" && userDetail.organisation_name)) {
                  new ClientAccDetailsModel({
                    userid: userId,
                    accounttype: userDetail.account_type,
                    organisationname: userDetail.organisation_name,
                    website: userDetail.website,
                    description: userDetail.description,
                    location: userDetail.location.name,
                    locationcode: userDetail.location.code,
                    favourites: [],
                  })
                    .save()
                    .then((res) => {
                      resp.send({ 
                        res: {
                          userDetail: result,
                          accountDetail: res,
                        }, 
                        message: "Account created successfully!", 
                        statuscode: 200 
                      });
                    })
                    .catch((fail) => {
                      userDetails.deleteOne({ _id: userId })
                      resp.send({ res: fail, message: "There's been a problem with creating the account" })
                    });
                } else { 
                  userDetails.deleteOne({ _id: userId })
                  resp.send({ message: "Please check your account type and organisation name." })
                }
                break;
              default:
                break;
            }
          })
          .catch((fail) => {
            // console.info("Step Three fail");
            resp.send({ res: fail, message: "There's been a problem with creating the account" });
          });
      } else {
        resp.send({ message: "User email exists" });
      }
    })
    .catch((fail) => resp.send(fail));
};


/**
 * 
 * @param {Array} applicants - return the details of all the users requested.
 * @param {*} resp 
 */
exports.getListOfAllUsersDetails = async function (applicants, resp) {
  let userArr = [];
  for (const applicantid of applicants) {
    const userDetail = await UserDetailsModel.findById(applicantid);
    let profileDetail;
    if(userDetail.usertype == "talent")
      profileDetail= await TalentAccDetailsModel.findOne({ userid: applicantid });
    if(userDetail.usertype == "client")
      profileDetail= await ClientAccDetailsModel.findOne({ userid: applicantid });

    userArr.push({ [applicantid]: { userDetail, profileDetail } });
  }
  
  if(userArr.length > 0) {
    resp.send({
      message: "Details fetched successfully!",
      res: userArr,
      status: 200,
    });
  } else {
    resp.send({
      message: "Cannot fetch details",
      res: userArr,
      status: 400,
    });
  }
}