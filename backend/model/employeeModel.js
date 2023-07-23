const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }]
});

const Employees = mongoose.model("Employees", employeeSchema);

module.exports = { Employees };
