module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('delivery_men', 'avatar_id');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('delivery_men', 'avatar_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};

// {
//   type: Sequelize.INTEGER,
//   references: { model: 'files', key: 'id' },
//   onUpdate: 'CASCADE',
//   onDelete: 'SET NULL',
//   allowNull: true,
// }
