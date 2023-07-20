const express = require("express");
const adminRouter = express.Router();
const { Admin } = require("../model/adminModel");
const { Employee } = require("../model/employeeModel");
const { Managers } = require("../model/managerModel");
const { Projects } = require("../model/projectsModel");
const { Tasks } = require("../model/taskModel");
const { adminAuth } = require("../authorization/adminAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

adminRouter.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let dataAvailable = await Admin.findOne({ email });
    if (dataAvailable != null) {
      res.send({ message: "You are already admin, need to login" });
      return;
    }
    bcrypt.hash(password, Number(process.env.saltRounds), async (err, hash) => {
      if (err) {
        res.send({ message: "something went wrong in hash password" });
      } else {
        let admin = new Admin({ name, email, password: hash });
        await admin.save();
        res.send({ message: `successfully Register ${name}` });
      }
      // Store hash in your password DB.
    });
  } catch (error) {
    console.log("something went wrong in manager router in /");
  }
});

adminRouter.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let dataAvailable = await Admin.findOne({ email });
    if (dataAvailable == null) {
      res.send({ message: "You are not user plz Register" });
      return;
    }
    bcrypt.compare(password, dataAvailable.password, function (err, result) {
      // result == true
      if (result) {
        var token = jwt.sign(
          { admin: dataAvailable.email },
          process.env.secret
        );
        res.send({
          message: "Login Successfull",
          name: dataAvailable.name,
          token,
        });
      }
    });
  } catch (error) {
    console.log("something went wrong in manager router in /");
  }
});

adminRouter.use(adminAuth);

//Manager Data
adminRouter.get("/managers", async (req, res) => {
  try {
    let manager_id = req.query.manager_id;
    if (manager_id) {
      let managerData = await Managers.find({ _id: manager_id });
      res.send({ message: "Manager Data", managerData });
    } else {
      let managerData = await Managers.find();
      res.send({ message: "Manager Data", managerData });
    }
  } catch (error) {
    console.log("something went wrong in /manager");
  }
});

//Employee Data
adminRouter.get("/employees", async (req, res) => {
  try {
    let employee_id = req.query.employee_id;
    if (employee_id) {
      let employeeData = await Employee.find({ _id: employee_id });
      res.send({ message: "Employee Data", employeeData });
    } else {
      let employeeData = await Employee.find();
      res.send({ message: "Employee Data", employeeData });
    }
  } catch (error) {
    console.log("something went wrong in /employee");
  }
});

adminRouter.get("/projects", async (req, res) => {
  try {
    let project_id = req.query.project_id;
    let manager_id = req.query.manager_id;
    if (project_id && manager_id) {
      let projectData = await Projects.findOne({ _id: project_id, manager_id });
      res.send({ message: "Project Data", projectData });
    } else if (project_id) {
      let projectData = await Projects.find({ _id: project_id });
      res.send({ message: "Project Data", projectData });
    } else if (manager_id) {
      let projectData = await Projects.find({ manager_id });
      res.send({ message: "Project Data", projectData });
    } else {
      let projectData = await Projects.find();
      res.send({ message: "Project Data", projectData });
    }
  } catch (error) {
    console.log("something went wrong in /project");
  }
});

adminRouter.get("/tasks", async (req, res) => {
  try {
    let project_id = req.query.project_id;
    let employee_id = req.query.employee_id;
    let task_id = req.query.task_id;
    if (project_id && employee_id) {
      let taskData = await Tasks.find({project_id, employee_id});
      res.send({ message: "Task Data", taskData });
    } else if (project_id) {
      let taskData = await Tasks.find({project_id});
      res.send({ message: "Task Data", taskData });
    } else if (employee_id) {
      let taskData = await Tasks.find({employee_id});
      res.send({ message: "Task Data", taskData });

    } else if(task_id){
        let taskData = await Tasks.find({_id : task_id});
        res.send({ message: "Task Data", taskData });
    } else {
      let taskData = await Tasks.find();
      res.send({ message: "Task Data", taskData });
    }
  } catch (error) {
    console.log("something went wrong in /taks");
  }
});


module.exports = { adminRouter };
