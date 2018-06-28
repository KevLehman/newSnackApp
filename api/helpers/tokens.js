const redis = require('redis')
const client = redis.createClient()

const getKey = (key) => new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
        if(err) reject(err)
        resolve(res)
    })
})

const setValue = (key, value) => new Promise((resolve, reject) => {
    client.set(key, value, (err, reply) => {
        if(err) reject(err)
        resolve(reply)
    })
})

const invalidateToken = (userId, token) => {
    const ntoken = token.split(" ")[1]

    return setValue(ntoken, userId).then(res => {
        return res
    }).catch(err => {
        return err
    })
}

const isInvalidToken = (userId, token) => {
    return getKey(token).then(value => {
        if(value == userId) {
            return true
        } else {
            return false
        }
    }).catch(err => {
        return err
    })
}

module.exports = {
    isInvalidToken, 
    invalidateToken
}