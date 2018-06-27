const { Likes, Products } = require('../models')

const likeProduct = (req, res, next) => {
    const { id } = req.user
    const { productId } = req.params
    let likesCount = 0

    Likes.findOne({
        where: {productId: productId, userId: id}
    }).then(like =>{
        if(like) return res.status(200).send({status: "You liked this product"})
        let newLike = Likes.build({
            productId: productId,
            userId: id
        })
        return newLike.save()
    }).then(newLike => {
        return Likes.findAndCountAll({
            where: {productId: productId}
        })
    }).then(likes => {
        likesCount = likes.count
        return Products.findOne({
            where: {id: productId}
        })
    }).then(snack => {
        if(!snack) return res.status(404).send([])
        snack.likes = likesCount
        return snack.save()
    }).then(newSnack => {
        return res.status(200).send({status: "You liked this product"})
    }).catch(err => {
        return res.status(500).send(err)
    })
}

const dislikeProduct = (req, res, next) => {
    const { id } = req.user
    const { productId } = req.params
    let likesCount = 0

    Likes.findOne({
        where: {productId: productId, userId: id}
    }).then(like =>{
        if(!like) return res.status(200).send({status: "You disliked this product"})
        return Likes.destroy({
            where: {productId: productId, userId: id}
        })
    }).then(() => {
        return Likes.findAndCountAll({
            where: {productId: productId}
        })
    }).then(likes => {
        likesCount = likes.count
        return Products.findOne({
            where: {id: productId}
        })
    }).then(snack => {
        if(!snack) return res.status(404).send([])
        snack.likes = likesCount
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