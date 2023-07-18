
const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    studentName : String,
    studentId : String,
    projectName : String,
    status : Boolean
});

const Tasks = mongoose.model('Tasks', taskSchema)

module.exports = {Tasks}