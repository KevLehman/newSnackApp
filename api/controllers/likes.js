const { Likes, Products } = require('../models')

const likeProduct = (req, res, next) => {
    const { id } = req.user
    const { productId } = req.params

    Likes.findOne({
        where: {productId: productId, userId: id}
    }).then(like =>{
        if(like) return res.status(200).send({status: "You liked this product"})
        return Products.findOne({
            where: {id: productId}
        })
    }).then(snack => {
        if(!snack) return res.status(404).send([])
        snack.likes += 1
        return snack.save()
    }).then(snack => {
        const newLike = Likes.build({
            userId: id,
            productId: productId
        })
        return newLike.save()
    }).then((like) => {
        if(like) return res.status(200).send({status: "You liked this product"})
    })
    .catch(err => {
        res.status(500).send(err)
    })
}

const dislikeProduct = (req, res, next) => {
    const { id } = req.user
    const { productId } = req.params

    Likes.findOne({
        where: {productId: productId, userId: id}
    }).then(like =>{
        if(!like) return res.status(200).send({status: "You disliked this product"})
        
        return Likes.destroy({
            where: {productId: productId, userId: id}
        })
    }).then(() => {
        return Products.findOne({
            where: {id: productId}
        })
    }).then(snack => {
        if(!snack) return res.status(404).send([])
        snack.likes -= 1

        return snack.save()
    }).then(newsnack => {

        if(newsnack) return res.status(200).send({status: "You disliked this product"})
    }).catch(err => {
        res.status(500).send(err)
    })
}

module.exports = { 
    likeProduct, 
    dislikeProduct 
}