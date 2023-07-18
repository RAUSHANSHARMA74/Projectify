
const mongoose = require("mongoose")

const projectSchema = mongoose.Schema({
    projectName : String,
    status : String,
    startDate : Date,
    endDate : Date
});

const Projects = mongoose.model('Projects', projectSchema)

module.exports = {Projects}