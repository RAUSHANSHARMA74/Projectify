const express = require("express")
const app = express()


app.use(express.json())

const port = process.env.port || 1481
app.listen(port, async ()=>{
    try {
        
    } catch (error) {
        console.log("something went wrong in port")
    }
    console.log(`server is running on port ${port}`)
})