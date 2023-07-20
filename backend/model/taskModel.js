
const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    taskName : {type: String, require:true},
    description : String,
    status : String,
    startDate : {type: Date, required: true},
    endDate : {type: Date, required: true},
    project_id : String,
    employee_id : String,
    resource_id : Array
});

const Tasks = mongoose.model('Tasks', taskSchema)

module.exports = {Tasks}