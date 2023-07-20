const {Admin} = require("../model/adminModel")
require("dotenv").config()
const jwt = require("jsonwebtoken")


let adminAuth = async  (req, res, next) =>{
    let  token = req.headers.authorization
    // console.log(token)
    if(!token){
        res.send({"message" : "Not Authorized"})
        return
    }else{
        var decoded = jwt.verify(token, process.env.secret);
        if(!decoded){
            res.send({"message" : "Not Authorized"})
        }else{
            let adminData = await Admin.findOne({email: decoded.admin })
            if(deenData!=null){
                next()
            }else{
                res.send({"message" : "Not Authorized"})
            }
        }
    }
}


module.exports = {adminAuth}