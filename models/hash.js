const mongoose = require('mongoose')

const hashSchema = new mongoose.Schema({
    hash: String,
    txLink: String,
    date: String
})

module.exports = mongoose.model('Hash', hashSchema)