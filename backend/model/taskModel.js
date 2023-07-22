const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  taskName: { type: String, require: true },
  description: String,
  status: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Projects" },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employees" },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resources" }],
});

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = { Tasks };
