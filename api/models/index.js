const connection = require("../connection")

const { database, host, user, pass } = process.env;

const db = new connection(database, user, pass, {
    host: host,
    dialect: 'mysql',
    logging: console.log,
    operatorAliases: false,
    define: {
        timestamps: false
    }
}).connect();

const Users = db.import('./models/user')
const Products = db.import('./models/products')
const Logs = db.import('./models/logs')
const Likes = db.import('./models/likes')

// relations

Users.hasMany(Logs, {foreignKey: 'userId'})
Logs.belongsTo(Users, {foreignKey: 'userId'})

Products.hasMany(Logs, {foreignKey: 'productId'})
Logs.belongsTo(Products, {foreignKey: 'productId'})

Users.hasMany(Likes, {foreignKey: 'productId'})
Likes.belongsTo(Users, {foreignKey: 'productId'})

Products.hasMany(Likes, {as: "Products", foreignKey: 'userId'})
Likes.belongsTo(Products, {as: "Likes", foreignKey: 'userId'})

module.exports = {
    Users,
    Products,
    Logs,
    Likes
}