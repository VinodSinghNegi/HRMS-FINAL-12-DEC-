const User = require("../user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const changePass = async (req, res, next) => {
  try {
    const email = req.body.credential.email;
    const oldpassword = req.body.credential.oldpassword;
    const newpassword = req.body.credential.newpassword;

    User.findOne({ email }).then(async user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
      // Check password
      bcrypt
        .compare(oldpassword, user.password)
        .then(async isMatch => {
          if (isMatch) {
            const newpass = await bcrypt.hash(newpassword, 8);
            user.password = newpass;
            user.save();
          }
        })
        .catch(res.send("error in changing password"));
    });
  } catch (e) {
    console.log("err", e);
    res.send("wrong token catch");
  }
};

module.exports = { changePass };
