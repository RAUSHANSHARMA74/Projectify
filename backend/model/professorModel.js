
const mongoose = require("mongoose")

const professorSchema = mongoose.Schema({
    name : String,
    email : String,
    role : String,
    isActive : Boolean,
    about : String,
    strarDate : Date
});

const Professors = mongoose.model('Professors', professorSchema)

module.exports = {Professors}