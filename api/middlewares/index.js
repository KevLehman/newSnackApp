const { tokens } = require('../helpers')

const isAdmin = (req, res, next) => {
    if(req.user.isAdmin) {
        next()
    } else {
        res.status(403).send([])
    }
}

const isValidToken = (req, res, next) => {
    const { id } = req.user
    const token = req.headers.authorization.split(' ')[1]

    return tokens.isInvalidToken(id, token).then(result => {
        if(!result) return next()
        else return res.status(401).send([])
    })
}

module.exports = {
    isAdmin,
    isValidToken
}