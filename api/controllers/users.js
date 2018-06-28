const { Users } = require('../models')

const createUser = (req, res, next) => {
    const { username } = req.body || null
    const { password } = req.body || null
    const { isAdmin } = req.user || false
    let admin = 0

    if(isAdmin) admin = 1

    if(username == null || password == null) return res.status(400).send({error: 'Must provide a valid username and password'})

    Users.build({
        username: username,
        password: Users.hashPassword(password),
        admin: admin
    }).save().then( user => {
        res.status(201).send([])
    }).catch(err => {
        res.status(500).send(err)
    })
}

module.exports = {
    createUser
}