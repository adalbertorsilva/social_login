const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

const configDB = require('./config/database.js')
mongoose.connect(configDB.url)

require('./config/passport')(passport)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

app.set('view enigine', 'ejs')

app.use(session({secret: 'tarantino'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

require('./app/routes.js')(app, passport)

module.exports = app