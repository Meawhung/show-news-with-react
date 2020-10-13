const mongoose = require('mongoose')
const Schema = mongoose.Schema

const characterSchema = new Schema({
  id: { type: String, 
    required: true,
    unique: true 
  },
  name: String,
  completed: {
    type: Boolean,
    default: false
  }
})


module.exports = mongoose.model('name-collection', characterSchema)