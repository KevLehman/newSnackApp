const { likes, products, users } = require('../controllers')
const { isAdmin, isValidToken } = require('../middlewares')
const { tokens } = require('../helpers')
const jwt = require('jsonwebtoken');
const { secret } = process.env;

module.exports = router = (app, passport) => {

    app.use('/products/:productId/like', passport.authenticate('jwt', {session:false}), isValidToken)
    app.use('/products/:productId/buy', passport.authenticate('jwt', {session:false}), isValidToken)

    app.route('/users/login')
        .post((req, res, next) => {
            passport.authenticate('local', {session: false}, (err, user, info) => {
                if(err || !user) return res.status(400).send({
                    message: 'Something is not goood',
                    user: user
                })
                req.login(user, {session:false}, (err) => {
                    if(err) {
                        res.send(err)
                    }
                    console.log(req.user)
                    const token = jwt.sign(user, secret, {
                        expiresIn: '12h'
                    })
                    return res.send(token)
                })
            })(req, res)
        })
    
    app.route('/users/logout')
        .post(passport.authenticate('jwt', {session:false}), isValidToken, (req, res) => {
            tokens.invalidateToken(req.user.id, req.headers.authorization)
            req.logout()
            res.status(200).send([])
        })
    
    app.route('/users/create/admin')
        .post(passport.authenticate('jwt', {session:false}), isValidToken, isAdmin, users.createUser)
    
    app.route('/users/create')
        .post(users.createUser)
    
    app.route('/products')
        .get(passport.authenticate('jwt', {session:false}),isValidToken, products.getAllProducts)
        .post(passport.authenticate('jwt', {session:false}), isValidToken, isAdmin, products.createAProduct)
    
    
    app.route('/products/:productId')
        .get(products.getThisProduct)
        .put(passport.authenticate('jwt', {session:false}), isValidToken, isAdmin, products.updateProduct)
        .delete(passport.authenticate('jwt', {session:false}), isValidToken, isAdmin, products.deleteProduct)
        .patch(passport.authenticate('jwt', {session:false}), isValidToken, isAdmin, products.updateProperties)
     
    app.route('/products/:productId/buy')
        .post(products.buyProduct)

    app.route('/products/:productId/like')
        .post(likes.likeProduct)
        .delete(likes.dislikeProduct)

    app.route((req, res) => {
        res.status(404).send('Not found')
    })
}

