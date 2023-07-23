const express = require("express");
const adminRouter = express.Router();
const { Admin } = require("../model/adminModel");
const { Employees } = require("../model/employeeModel");
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

// adminRouter.use(adminAuth)

adminRouter.get("/projects", async (req, res) => {
  try {
    const projectsData = await Projects.find()
      .populate('manager', 'name') // Use 'manager' instead of 'managers'
      .populate('employees', 'name') // Use 'employees' instead of 'employees'
      .select('projectName description status startDate endDate manager employees');

    const processedProjectsData = projectsData.map((project) => {
      const managerName = project.manager ? project.manager.name : 'N/A'; // If manager is not present, set 'N/A'

      // Prepare the array of employees with employeeId and employeeName
      const employees = project.employees.map((employee) => ({
        employeeId: employee._id,
        employeeName: employee.name,
      }));

      return {
        projectId: project._id,
        projectName: project.projectName,
        managerId: project.manager ? project.manager._id : null, // If manager is not present, set null
        managerName,
        employees,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
      };
    });

    res.send({message : "All Projects", projectsData : processedProjectsData});
  } catch (error) {
    console.log("something went wrong in /projects");
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});



adminRouter.post("/projects", async (req, res)=>{
  try {
    let projectData = new Projects(req.body)
    await projectData.save()
    res.send({message : "Project Added"})
  } catch (error) {
    console.log("something went wrong in /project")
    console.log(error)
  }
})

adminRouter.patch("/projects/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const managerId = req.body.manager; 
    await Projects.findByIdAndUpdate({_id:id}, req.body);
    await Managers.findByIdAndUpdate(managerId, { $addToSet: { projects: id } });

    res.send({ message: "Project Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
adminRouter.delete("/deleteProjects/:id", async (req, res)=>{
  try {
    let id = req.params.id
    let deleteProjects = await Projects.findByIdAndDelete({_id:id})
    res.send({message : `${deleteProjects.projectName} Deleted`})
  } catch (error) {
    console.log("something went wrong in delete project")
  }
})

//Manager Data
adminRouter.get("/managers", async (req, res) => {
  try {
    const allManagersData = await Managers.find();
    if (!allManagersData || allManagersData.length === 0) {
      console.log("No managers found.");
      return;
    }
    let allData = [];
    for (const managerData of allManagersData) {
      const populatedManager = await managerData.populate("projects")
      allData.push(populatedManager);
    }
    // console.log("data:", allData);
    res.json({message : "all Manager Data" , managerData : allData});
  } catch (error) {
    console.log("something went wrong in /managers");
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


adminRouter.patch("/managers/:id", async (req, res)=>{
  try {
    let managerId = req.params.id;
    let updateManagerData = await Managers.findByIdAndUpdate({_id:managerId}, req.body)
    res.send({message : "Manager Data Updated"})
  } catch (error) {
    console.log("something wrong in manager patch")
  }
})


adminRouter.delete("/deleteManagers/:id", async (req, res)=>{
  try {
    let id = req.params.id
    let deleteManagers = await Managers.findByIdAndDelete({_id:id})
    res.send({message : `${deleteManagers.name} Deleted`})
  } catch (error) {
    console.log("something went wrong in delete project")
  }
})

//Employee Data
adminRouter.get("/employees", async (req, res) => {
  try {
    let employeeData = await Employees.find();
    res.send({ message: "Employee Data", employeeData });
  } catch (error) {
    console.log("something went wrong in /employee");
  }
});


// adminRouter.get("/tasks", async (req, res) => {
//   try {
//     let project_id = req.query.project_id;
//     let employee_id = req.query.employee_id;
//     let task_id = req.query.task_id;
//     if (project_id && employee_id) {
//       let taskData = await Tasks.find({project_id, employee_id});
//       res.send({ message: "Task Data", taskData });
//     } else if (project_id) {
//       let taskData = await Tasks.find({project_id});
//       res.send({ message: "Task Data", taskData });
//     } else if (employee_id) {
//       let taskData = await Tasks.find({employee_id});
//       res.send({ message: "Task Data", taskData });

//     } else if(task_id){
//         let taskData = await Tasks.find({_id : task_id});
//         res.send({ message: "Task Data", taskData });
//     } else {
//       let taskData = await Tasks.find();
//       res.send({ message: "Task Data", taskData });
//     }
//   } catch (error) {
//     console.log("something went wrong in /taks");
//   }
// });


module.exports = { adminRouter };
