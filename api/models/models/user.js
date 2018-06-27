/* jshint indent: 1 */
const { secret } = process.env
const bcrypt = require('bcrypt')



module.exports = function(sequelize, DataTypes) {
	let Users = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING(16),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		admin: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		}
	});
	Users.prototype.validatePassword = function (passwd){
		return bcrypt.compareSync(passwd, this.password)
	}
	Users.prototype.hashPassword = function (password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
	}
	Users.prototype.isAdmin = function () { 
		(this.admin) ? true : false
	}
	Users.prototype.toJson = function () {
		const userInfo = {
			id: this.id,
			username: this.username,
			isAdmin: (this.admin) ? true : false
		}
		return userInfo
	}
	return Users
};
