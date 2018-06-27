require("dotenv").config();

const SequelizeAuto = require("sequelize-auto")
const { database, host, user, pass } = process.env;

const auto = new SequelizeAuto(database, user, pass, host)

auto.run(err => {
    if(err) throw err;
    console.log("Success")
})
