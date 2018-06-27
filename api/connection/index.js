const Sequelize = require("sequelize")
let sequelize;

class Connection {
    constructor(db, username, password, config){
        this.db = db
        this.username = username
        this.password = password
        this.config = config
    }

    connect() {
        sequelize = new Sequelize(this.db, this.username, this.password, this.config);
        return sequelize
    }

    destroy(){
        sequelize.close();
        return true;
    }
}

module.exports = Connection;