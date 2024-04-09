module.exports = (sequelize, DataType) => {
    const Historicos_satisfaccion = sequelize.define("Historicos_satisfaccion", {
      historico_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fecha: {
        type: DataType.DATEONLY,
        allowNull: false,
        unique: true
      },
      cant_enviados: {
        type: DataType.BIGINT,
        allowNull: false,
      },
      cant_no_enviados: {
        type: DataType.BIGINT,
        allowNull: false,
      },
    }, {freezeTableName: true});
  
    Historicos_satisfaccion.associate = (models) => {
      Historicos_satisfaccion.belongsTo(models.Users, {
        foreignKey: {
          name: "user_id",
          allowNull: true,
          defaultValue: 1,
        },
      });
    };
  
    return Historicos_satisfaccion;
  };
  