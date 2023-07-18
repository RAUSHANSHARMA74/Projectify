
const express = require("express")
const studentRouter = express.Router()




studentRouter.get("/", async (req, res)=>{
    try {
        res.send("hello student")        
    } catch (error) {
        console.log("something went wrong in student router in /")
    }
})


module.exports = {studentRouter}