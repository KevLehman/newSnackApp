const { likes, products } = require('../controllers')
const { isAdmin } = require('../middlewares')
const helpers = require('../helpers')
const jwt = require('jsonwebtoken');
const { secret } = process.env;

module.exports = router = (app, passport) => {

    app.use('/products/:productId/like', passport.authenticate('jwt', {session:false}))
    app.use('/products/:productId/buy', passport.authenticate('jwt', {session:false}))

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
                    
                    const token = jwt.sign(user, secret)
                    return res.send({user, token})
                })
            })(req, res)
        })
    
    app.route('/users/logout')
        .post(passport.authenticate('jwt', {session:false}), (req, res) => {
            req.logout()
            res.status(200).send([])
        })

    app.route('/products')
        .get(products.getAllProducts)
        .post(passport.authenticate('jwt', {session:false}), isAdmin, products.createAProduct)
    
    
    app.route('/products/:productId')
        .get(products.getThisProduct)
        .put(passport.authenticate('jwt', {session:false}), isAdmin, products.updateProduct)
        .delete(passport.authenticate('jwt', {session:false}), isAdmin, products.deleteProduct)
        .patch(passport.authenticate('jwt', {session:false}), isAdmin, products.updateProperties)
     
    app.route('/products/:productId/buy')
        .post(products.buyProduct)

    app.route('/products/:productId/like')
        .post(likes.likeProduct)
        .delete(likes.dislikeProduct)

    app.route((req, res) => {
        res.status(404).send('Not found')
    })
}

