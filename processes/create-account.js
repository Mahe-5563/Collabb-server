const UserDetailsModel = require("../models/users");
const TalentAccDetailsModel = require("../models/talents");
const ClientAccDetailsModel = require("../models/clients");

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
  // console.info("Step One success");

  UserDetailsModel.find({ email })
    .then((result) => {
      // console.info("result: ", result);
      if (result.length == 0) {
        // console.info("Step Two success");
        const userDetails = new UserDetailsModel({
          firstName: userDetail.field_first_name,
          lastName: userDetail.field_last_name,
          email: userDetail.field_email,
          password: userDetail.field_pwd,
          profileUri: userDetail.profile_photo.uri,
        });
        userDetails
          .save()
          .then((result) => {
            const userId = result.id;
            const accountType = userDetail.type;
            // console.info("User Details: ", result);

            switch (accountType) {
              case "talent":
                const talentDetails = new TalentAccDetailsModel({
                  talentid: userId,
                  // category: userDetail
                });
                break;
              case "client":
                new ClientAccDetailsModel({
                  clientid: userId,
                  accounttype: userDetail.account_type,
                  organisationname: userDetail.organisation_name,
                  website: userDetail.website,
                  description: userDetail.description,
                  location: userDetail.location.name,
                  locationcode: userDetail.location.code,
                })
                  .save()
                  .then((res) => {
                    // console.info("Client Details: ", res);
                    resp.send({ res, message: "Account created successfully!", statuscode: 200 });
                    // res = resp;
                  })
                  .catch((fail) => resp.send({ res: fail, message: "There's been a problem with creating the account" }));
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
