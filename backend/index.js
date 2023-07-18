const express = require("express")
const {connection} = require("./config/connection")
const {professorsRouter} = require("./router/professorRouter")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use("/professor", professorsRouter)



const port = process.env.port || 1481
app.listen(port, async ()=>{
    try {
        await connection
        console.log("connected to mongodb")
    } catch (error) {
        console.log("something went wrong in connected to database")
        console.log(error)
    }
    console.log(`server is running on port ${port}`)
})