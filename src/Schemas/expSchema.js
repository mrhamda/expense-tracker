const mongoose = require('mongoose')

const expSchema = new mongoose.Schema({
    desc: String,
    cost: Number,
    password: String
})

module.exports = mongoose.model('expSchema', expSchema)