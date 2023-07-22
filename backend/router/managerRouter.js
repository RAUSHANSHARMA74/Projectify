
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
        console.log("something went wrong in manager router in /")
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


managerRouter.use(managerAuth)


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
        let taskData = await Tasks.find()
        res.send({message : "Get all task Data", taskData})
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
        let resourceData = await Resources.find()
        res.send({message : "Get all resource Data", resourceData})
    } catch (error) {
        console.log("something went wrong in /employee")
    }
})


//GET ALL PROJECT 
managerRouter.get("/projects", async (req, res)=>{
    try {
        let id = req.body._id
        let projectData = await Projects.find({_id :  id})
        res.send({message : "All Project", projectData})
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})

//GET ALL EMPLOYEE
managerRouter.get("/employees", async (req, res)=>{
    try {
        let employeeData = await Employees.find()
        res.send({message : "All Project", employeeData})
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})



module.exports = {managerRouter}