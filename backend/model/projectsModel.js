
const mongoose = require("mongoose")

const projectSchema = mongoose.Schema({
   projectName : {type : String, required : true},
   Description : String,
   status : String,
   startDate : {type : Date, required : true},
   endDate : {type : Date, required : true},
   manager_id : String,
   task_id : Array
});

const Projects = mongoose.model('Projects', projectSchema)

module.exports = {Projects}