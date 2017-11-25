const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

let userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
})

userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = (password, user) => {
  return bcrypt.compareSync(password, user.local.password)
}

module.exports = mongoose.model('User', userSchema)
