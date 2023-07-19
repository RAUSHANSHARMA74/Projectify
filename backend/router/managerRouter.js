
const express = require("express")
const managerRouter = express.Router()
const {Managers} = require("../model/managerModel")
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
        let {name, email, password} = req.body;
        let dataAvailable = await Managers.findOne({email})
        if(dataAvailable != null){
            res.send({message : "You are already user, to login"})
            return
        }
        bcrypt.hash(password, Number(process.env.saltRounds) ,async (err, hash) =>{
            if(err){
                res.send({message : "something went wrong in hash password"})
            }else{
                let registerManager = new Managers({name, email, password: hash})
                await registerManager.save()
                res.send({message : `successfully Register ${name}`})
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
            res.send({message : "You are not user plz Register"})
            return
        }
        bcrypt.compare(password, dataAvailable.password, function(err, result) {
            // result == true
            if(result){
                var token = jwt.sign({managerId : email}, process.env.secret, {expiresIn : "1h"});
                res.send({message : "Login Successfull", name : dataAvailable.name, token})
            }
        });
    } catch (error) {
        console.log("something went wrong in manager router in /")
    }
})



// managerRouter.get("/projects", async (req, res)=>{
//     try {
         
//     } catch (error) {
//         console.log("something went wrong in manager router in /")
//     }
// })


// managerRouter.get("/project/employee", async (req, res)=>{
//     try {
         
//     } catch (error) {
//         console.log("something went wrong in manager router in /")
//     }
// })



module.exports = {managerRouter}