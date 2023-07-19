
const express = require("express")
const employeeRouter = express.Router()
const {Employee} = require("../model/employeeModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require("dotenv").config()


employeeRouter.get("/", async (req, res)=>{
    try {
        let allEmployee = await Employee.find()
        res.send({message : "Hello, Employee", allEmployee})        
    } catch (error) {
        console.log("something went wrong in employee router in /")
    }
})



employeeRouter.post("/register", async (req, res)=>{
    try {
        let {name, email, password} = req.body;
        let dataAvailable = await Employee.findOne({email})
        if(dataAvailable != null){
            res.send({message : "You are already user, need to login"})
            return
        }
        bcrypt.hash(password, Number(process.env.saltRounds) ,async (err, hash) =>{
            if(err){
                res.send({message : "something went wrong in hash password"})
            }else{
                let registerEmployee = new Employee({name, email, password: hash})
                await registerEmployee.save()
                res.send({message : `successfully Register ${name}`})
            }
            // Store hash in your password DB.
        });
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})



employeeRouter.post("/login", async (req, res)=>{
    try {
        let {email, password} = req.body;
        let dataAvailable = await Employee.findOne({email})
        if(dataAvailable == null){
            res.send({message : "You are not user plz Register"})
            return
        }
        bcrypt.compare(password, dataAvailable.password, function(err, result) {
            // result == true
            if(result){
                var token = jwt.sign({employeeId : email}, process.env.secret, {expiresIn : "1h"});
                res.send({message : "Login Successfull", name : dataAvailable.name, token})
            }
        });
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})




module.exports = {employeeRouter}