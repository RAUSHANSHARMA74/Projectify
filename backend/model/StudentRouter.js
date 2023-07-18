
const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    name : String,
    email : String,
    password :  String,
});

const Students = mongoose.model('Students', studentSchema)

module.exports = {Students}