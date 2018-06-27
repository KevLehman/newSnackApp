
const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        next()
    } else {
        res.status(401).send([])
    }
}

const isAdmin = (req, res, next) => {
    if(req.user.isAdmin) {
        next()
    } else {
        res.status(403).send([])
    }
}

module.exports = {
    isAuthenticated,
    isAdmin
}