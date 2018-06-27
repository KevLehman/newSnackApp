require('dotenv').config()

const { port } = process.env
const { router } = require('./api')
const passport = require('passport')
const express = require('express')
const app = express()

require('./api/config/passport')(passport);

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(passport.initialize())

app.listen(port, router(app, passport), () => {
    console.clear()
    console.log(`listening on ${port}`)
})