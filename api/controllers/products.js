const { Products, Logs } = require('../models')
const Op = require('sequelize').Op

const getAllProducts = (req, res, next) => {
    const orderBy = req.query.orderby || 'name'
    const sort = req.query.sort || 'asc'
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    const search = req.query.search || null
    
    if(limit < 0) return res.status(400).send({error: 'limit cant be less than 0'})
    if(page < 0) return res.status(400).send({error: 'page cant be less than 0'})
    if(['name', 'likes'].indexOf(orderBy) == -1 ) return res.status(400).send({error: 'Invalid orderBy parameter. Must be "likes" or "name"'})
    if(['asc', 'desc'].indexOf(sort) == -1) return res.status(400).send({error: 'Invalid sort parameter. Must be "asc" or "desc"'})

    if(search == null){
        Products.findAll({
            order: [
                [orderBy, sort]
            ],
            offset: ((page - 1) * limit),
            limit: limit
        })
        .then(products => {
            res.status(200).send(products)
        }).catch(err => {
            res.status(500).send(err)
        })
    } else {
        Products.findAll({
            order: [
                [orderBy, sort]
            ],
            offset: ((page - 1) * limit),
            limit: limit,

            where: {
                name: {
                    [Op.like]: `%${search}%`
                }
            }
        }).then(results => {
            if(!results) return res.status(404).send([])
            res.status(200).send(results)
        }).catch(err => {
            res.status(500).send(err)
        })
    }

}

const createAProduct = (req, res, next) => {
    const { name, stock, category, price } = req.body
    
    const product = Products.build({
        name: name,
        stock: stock,
        category: category,
        price: price
    }).save()
    .then(() => {
        return Products.findOne({where: {name: name}})
    }).then((snack) => {
        res.set('Location', `/products/${snack.get('id')}`);
        res.status(204).send()
    }).catch(err => {
        console.log(err)
    })
}

const getThisProduct = (req, res, next) => {
    const { productId } = req.params

    Products.findOne({
        where: {id: productId}
    }).then((snack) => {
        if(!snack) return res.status(404).send([])
        else res.status(200).send(snack)
    }).catch(err => {
        res.status(500).send([])
    })

}

const updateProduct = (req, res, next) => {
    const { productId } = req.params
    const { category, name, stock, price } = req.body

    if(typeof category === undefined) res.status(400).send({error: 'category is not defined'})
    if(typeof name === undefined || name == '') res.status(400).send({error: 'name is not defined'})
    if(typeof stock === undefined || stock < 0) res.status(400).send({error: 'stock is not defined'})
    if(typeof price === undefined || price < 0.01) res.status(400).send({error: 'price is not defined'})

    Products.findOne({
        where: {id: productId}
    }).then(snack => {
        if(!snack) return res.status(404).send([])
        snack.category = category
        snack.name = name
        snack.stock = stock
        snack.price = price
        return snack.save()
    }).then((newSnack) => {
        res.status(201).send(newSnack)
    }).catch(err => {
        res.status(500).send([])
    })

}

const deleteProduct = (req, res, next) => {
    const { productId } = req.params

    Products.findOne({
        where: {id: productId}
    }).then(snack => {
        if(!snack) return res.status(404).send([])

        return Products.destroy({ where: {id: productId}})

    }).then(() => {
        res.status(204).send([])
    }).catch(err => {
        res.status(500).send([])
    })
}

const updateProperties = (req, res, next) => {
    const { stock } = req.body || null
    const { price } = req.body || null
    const { productId } = req.params

    if(stock === null && price === null) return res.status(400).send({error: 'Must provide properties to update'})

    Products.findOne({
        where: {id: productId}
    }).then(snack => {
        if(!snack) return res.status(404).send([])

        snack.price = price || snack.price
        snack.stock = stock || snack.stock

        return snack.save()
    }).then(newsnack => {
        res.status(204).send([])
    }).catch(err => {
        res.status(500).send([])
    })

}

const buyProduct = (req, res, next) => {
    const { productId } = req.params
    const { quantity } = req.body || null
    const { id } = req.user

    if(quantity == null) return res.status(400).send({error: 'Must provide quantity to buy'})
    if(quantity < 0) return res.status(400).send({error: 'Quantity must be greater than 0'})

    Products.findOne({
        where: {id: productId}
    }).then(snack => {
        if(!snack) return res.status(404).send([])

        if(snack.stock < 0) {
            return res.status(400).send({error: 'Theres no more stock of this product'})
        }
        if(quantity > snack.stock) {
            return res.status(400).send({error: 'There arent enough products!'})
        }

        snack.stock -= quantity
        return snack.save()
    }).then((snack) => {
        let buy = Logs.build({
            userId: id,
            productId: productId,
            quantity: quantity,
            price: snack.price * quantity
        })
        return buy.save()
    }).then(invoice => {
        res.status(200).send(invoice)
    })
    .catch(err => {
        res.status(500).send([])
    })
}

module.exports = { 
    getAllProducts, 
    createAProduct, 
    getThisProduct,
    updateProduct, 
    deleteProduct, 
    updateProperties, 
    buyProduct 
}