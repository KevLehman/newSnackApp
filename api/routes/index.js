const { auth, likes, products } = require('../controllers')
const {isAuthenticated, isAdmin} = require('../middlewares')
const helpers = require('../helpers')

module.exports = router = (app, passport) => {

    app.route('/users/login')
        .post(passport.authenticate('local'), (req, res) => {
            res.status(200).send()
        })
    
    app.route('/users/logout')
        .post(isAuthenticated, (req, res) => {
            req.logout()
            res.status(200).send([])
        })

    app.route('/products')
        .get(products.getAllProducts)
        .post(isAuthenticated, isAdmin, products.createAProduct)

    app.route('/products/:productId')
        .get(products.getThisProduct)
        .put(isAuthenticated, isAdmin, products.updateProduct)
        .delete(isAuthenticated, isAdmin, products.deleteProduct)
        .patch(isAuthenticated, isAdmin, products.updateProperties)
     
    app.route('/products/:productId/buy')
        .post(isAuthenticated, products.buyProduct)


    app.route('/products/:productId/like')
        .post(isAuthenticated, likes.likeProduct)
        .delete(isAuthenticated, likes.dislikeProduct)

    app.route((req, res) => {
        res.status(404).send('Not found')
    })
}

