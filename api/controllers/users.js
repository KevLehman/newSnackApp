const { Users } = require('../models')

const createUser = (req, res, next) => {
    const { username } = req.body || null
    const { password } = req.body || null
    
    if(username == null || password == null) return res.status(400).send({error: 'Must provide a valid username and password'})

    Users.build({
        username: username,
        password: Users.hashPassword(password)
    }).save().then()
}