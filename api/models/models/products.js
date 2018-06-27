/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('products', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		category: {
			type: DataTypes.ENUM('Drinks','Snacks'),
			allowNull: false
		},
		stock: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			isInt: true
		},
		price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			isFloat: true
		},
		likes: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: 0
		}
	}, {
		tableName: 'products',
		timestamps: false
	});
};
