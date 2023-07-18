
const express = require("express")
const professorsRouter = express.Router()




professorsRouter.get("/", async (req, res)=>{
    try {
        res.send("hello Professors")        
    } catch (error) {
        console.log("something went wrong in professors router in /")
    }
})


module.exports = {professorsRouter}