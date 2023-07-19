
const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
  name : {type : String, required : true},
  email : {type : String, required : true},
  password : {type : String, required : true},
  project_id : String,
  manager_id : String,
  task_id : Array,
});

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = {Employee}