
const mongoose = require("mongoose")

const projectSchema = mongoose.Schema({
   projectName: { type: String, required: true },
   description: String,
   status: String,
   startDate: { type: Date, required: true },
   endDate: { type: Date, required: true },
   manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Managers' },
   employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employees" }],
   tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }],
 });

const Projects = mongoose.model('Projects', projectSchema)

module.exports = {Projects}