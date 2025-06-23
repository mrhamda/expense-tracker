const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema({
    secretToken: String,
    email: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('passwordResetSchema', passwordResetSchema)