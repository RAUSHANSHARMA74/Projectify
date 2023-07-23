
const express = require("express")
const managerRouter = express.Router()
const {Managers} = require("../model/managerModel")
const {Projects} = require("../model/projectsModel")
const {Tasks} = require("../model/taskModel")
const {Resources} = require("../model/resourcesModel")
const {Employees} = require("../model/employeeModel")
const {managerAuth} = require("../authorization/managerAuth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require("dotenv").config()


 
managerRouter.get("/", async (req, res)=>{
    try {
        let allManager = await Managers.find()
        res.send({message : "Hello, Manager!", allManager})        
    } catch (error) {
        // console.log("something went wrong in manager router in /")
        console.log(error)
    }
})

managerRouter.post("/register", async (req, res)=>{
    try {
        let {name, email, password, role} = req.body;
        let dataAvailable = await Managers.findOne({email})
        if(dataAvailable != null){
            res.send({message : "You are already user, need to login"})
            return
        }
        bcrypt.hash(password, Number(process.env.saltRounds) ,async (err, hash) =>{
            if(err){
                res.send({message : "something went wrong in hash password"})
            }else{
                let registerManager = new Managers({name, email, password: hash, role})
                await registerManager.save()
                res.send({message : `Wait until the admin confirms.`, name})
            }
            // Store hash in your password DB.
        });
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})

managerRouter.post("/login", async (req, res)=>{
    try {
        let {email, password} = req.body;
        let dataAvailable = await Managers.findOne({email})
        if(dataAvailable == null){
            res.send({message : "You are not user plz Register", error : "wrong"})
            return
        }
        if(dataAvailable.isManager==false){
            res.send({message : "Wait for confirmation of admin"})
            return
        }
        bcrypt.compare(password, dataAvailable.password, function(err, result) {
            // result == true
            if(result){
                var token = jwt.sign({manager : dataAvailable.email}, process.env.secret, {expiresIn : "1h"});
                res.send({message : "Login Successfull", name : dataAvailable.name, token, manager : true})
            }
        });
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})


// managerRouter.use(managerAuth)
managerRouter.get("/employees", async (req, res)=>{
    try {
        let employeeData = await Employees.find({}, '-password').populate({
            path: 'tasks',
            populate: [
              {
                path: 'project',
                model: 'Projects',
              },
              {
                path: 'resources',
                model: 'Resources',
              }
            ]
          });
        
        res.send({message : "All Project", employeeData})
    } catch (error) {
        console.log("something went wrong in manager router in /")
        console.log(error)
    }
})



managerRouter.get("/projects", async (req, res)=>{
    try {
        let projectData = await Projects.find()
            .populate('manager')
            .populate('employees')
            .populate('tasks');

        res.send({message : "All Project", projectData})
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})

managerRouter.patch("/projects/:id", async (req, res)=>{
    try {
        let id = req.params.id
        let status = req.body.status
        let employeeData = await Projects.findByIdAndUpdate(id, {status})
        res.send({message : `${employeeData.projectName} Updated`})
    } catch (error) {
        console.log("something went wrong in manager router in /")
        console.log(error)
    }
})


//Add Task For Projects
managerRouter.post("/tasks", async (req, res)=>{
    try {
        let taskData = new Tasks(req.body)
        await taskData.save()
        res.send({message : "Add task"})
    } catch (error) {
        console.log("something went wrong in /task in manager")
        console.log(error)
    }
})

//GET TASK DATA 
managerRouter.get("/tasks", async (req, res)=>{
    try {
        const allTaskData = await Tasks.find()
        .populate('project', 'projectName description status startDate endDate')
        .populate('employee', 'name email role')
        .populate('resources', 'resourceName description type availability');
    
     res.send({message : "get all tasks data", allTaskData});
    } catch (error) {
        console.log("something went wrong in /employee")
    }
})

managerRouter.patch("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const projectId = req.body.project;
    const employeeId = req.body.employee;
    const taskData = await Tasks.findByIdAndUpdate(id, req.body, { new: true });
    if (!taskData) {
      console.log("Task not found.");
      res.status(404).send({ error: "Task not found" });
      return;
    }
    await Projects.findByIdAndUpdate(projectId, { $addToSet: { tasks: id } });
    await Employees.findByIdAndUpdate(employeeId, { $addToSet: { tasks: id } });

    res.send({ message: "Task updated", taskData });
  } catch (error) {
    console.log("Something went wrong in /tasks/:id");
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


managerRouter.delete("/tasks/:id", async (req, res)=>{
    try {
        let id = req.params.id
        let taskData = await Tasks.findByIdAndDelete({_id:id})
        res.send({message : `${taskData.taskName} deleted`})
    } catch (error) {
        console.log("something went wrong in /employee")
    }
})

//Add Resource For Projects
managerRouter.post("/resources", async (req, res)=>{
    try {
        let resourceData = new Resources(req.body)
        await resourceData.save()
        res.send({message : "Add resource"})
    } catch (error) {
        console.log("something went wrong in /task in manager")
    }
})

//GET ALL RESOURCE 
managerRouter.get("/resources", async (req, res)=>{
    try {
        let resourceData = await Resources.find().populate('task');
        res.send({message : "Get all resource Data", resourceData})
    } catch (error) {
        console.log("something went wrong in /employee")
    }
})


//GET ALL PROJECT 

managerRouter.patch("/resources/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const taskId = req.body.task;
    const resourceData = await Resources.findByIdAndUpdate(id, req.body);
    await Tasks.findByIdAndUpdate(taskId, { $addToSet: { resources: id } });
    res.send({ message: "Resource Update" });
  } catch (error) {
    console.log("Something went wrong in manager router in /resources/:id");
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


managerRouter.delete("/resources/:id", async (req, res)=>{
    try {
        let id = req.params.id
        let resourceData = await Resources.findByIdAndDelete({_id :  id})
        res.send({message : `${resourceData.resourceName} Deleted`})
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})


//GET ALL EMPLOYEE
managerRouter.get("/projects", async (req, res)=>{
    try {
        let projectData = await Projects.find()
            .populate('manager')
            .populate('employees')
            .populate('tasks');

        res.send({message : "All Project", projectData})
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})






module.exports = {managerRouter}