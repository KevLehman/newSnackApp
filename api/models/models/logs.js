/* jshint indent: 1 */
const methods = {
	getterMethods: {
		toJson: () => {
			const invoice = {
				userId: this.userId,
				productId: this.productId,
				productName: this.productName,
				quantity: this.quantity,
				totalToPay: this.total
			}
		}
	}
}
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('logs', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'user',
				key: 'id'
			}
		},
		productId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'products',
				key: 'id'
			}
		},
		quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		price: {
			type: "DOUBLE",
			allowNull: false
		}
	}, {
		tableName: 'logs'
	}, methods);
};
