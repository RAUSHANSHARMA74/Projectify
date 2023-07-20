const {Managers} = require("../model/managerModel")
require("dotenv").config()
const jwt = require("jsonwebtoken")


let managerAuth = async  (req, res, next) =>{
    let  [bearer, token] = req.headers.authorization.split(" ")
    // console.log(token)
    if(!token){
        res.send({"message" : "Not Authorized"})
        return
    }else{
        var decoded = jwt.verify(token, "ratham");
        if(!decoded){
            res.send({"message" : "Not Authorized"})
        }else{
            let deenData = await Managers.findOne({email : decoded.manager })
            if(deenData!=null){
                next()
            }else{
                res.send({"message" : "Not Authorized"})
            }
        }
    }
}


module.exports = {managerAuth}