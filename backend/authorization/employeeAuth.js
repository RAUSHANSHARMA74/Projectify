const { Employee } = require("../model/employeeModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

let employeeAuth = async (req, res, next) => {
  let token = req.headers.authorization;
  // console.log(token)
  if (!token) {
    res.send({ message: "Not Authorized" });
    return;
  } else {
    var decoded = jwt.verify(token, "ratham");
    if (!decoded) {
      res.send({ message: "Not Authorized" });
    } else {
      let deenData = await Employee.findOne({ email: decoded.employee });
      if (deenData != null) {
        next();
      } else {
        res.send({ message: "Not Authorized" });
      }
    }
  }
};

module.exports = { employeeAuth };
