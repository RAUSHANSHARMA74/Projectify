
const mongoose = require("mongoose");
const managerSchema = mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, required: true },
      isManager: { type: Boolean, default: false },
      projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }],
});
const Managers = mongoose.model("Managers", managerSchema);


module.exports = { Managers }