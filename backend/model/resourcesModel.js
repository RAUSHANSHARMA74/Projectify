
const mongoose = require("mongoose")

const resourceSchema = mongoose.Schema({
    type : String,
    link : String,
    isLocked : String,
    password : String
});

const Resources = mongoose.model('Resources', resourceSchema)

module.exports = {Resources}