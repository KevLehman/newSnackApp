require('dotenv').config()

const { port, secret } = process.env
const {router} = require('./api')
const session = require('express-session')
const passport = require('passport')
const express = require('express')
const app = express()
require('./api/config/passport')(passport);

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(passport.initialize())
app.use(passport.session())

app.listen(port, router(app, passport), () => {
    console.clear()
    console.log(`listening on ${port}`)
})