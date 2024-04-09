module.exports = (sequelize, DataType) => {
  const Encuestas_satisfaccion = sequelize.define(
    "Encuestas_satisfaccion",
    {
      id_Encuestas_satisfaccion: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pregunta1: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta2: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta3: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta4: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta5: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta6: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta7: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta8: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta9: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta10: {
        type: DataType.STRING,
        allowNull: false,
      },
      pregunta11: {
        type: DataType.STRING,
        allowNull: false,
      },
    },
    { freezeTableName: true }
  );

  Encuestas_satisfaccion.associate = (models) => {
    // Pertenece a UN solo turno
    Encuestas_satisfaccion.belongsTo(models.Turnos_satisfaccion, {
      foreignKey: {
        name: "COD_TURNO",
        allowNull: false,
        defaultValue: 1,
        unique: true,
      },
    });

    Encuestas_satisfaccion.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
        defaultValue: 1,
      },
    });
  };
  return Encuestas_satisfaccion;
};
