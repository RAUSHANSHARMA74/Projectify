
const mongoose = require("mongoose")

const managerSchema = mongoose.Schema({
    name : {type : String, required: true},
    email : {type : String, required: true},
    password : {type : String, required: true},
    role : {type : String},
    project_id : Array
});

const Managers = mongoose.model('Managers', managerSchema)
module.exports = {Managers}