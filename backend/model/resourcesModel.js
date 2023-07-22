const mongoose = require("mongoose");

const resourceSchema = mongoose.Schema({
  resourceName: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  availability: Boolean,
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Tasks" },
});

const Resources = mongoose.model("Resources", resourceSchema);

module.exports = { Resources };
