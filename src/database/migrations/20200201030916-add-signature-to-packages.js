module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('packages', 'signature_id');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('packages', 'signature_id', {
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
