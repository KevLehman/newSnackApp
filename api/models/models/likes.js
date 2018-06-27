/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('likes', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		productId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'products',
				key: 'id'
			}
		}
	}, {
		tableName: 'likes'
	});
};
