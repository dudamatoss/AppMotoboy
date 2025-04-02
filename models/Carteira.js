const { DataTypes } = require("sequelize");
const db = require("../config/database"); // Certifique-se de que este arquivo exporta a instância do Sequelize

const Carteira = db.define("Carteira", {
    motoboy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Motoboy",
            key: "id"
        },
        unique: true
    },
    saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    tableName: "carteira",
    timestamps: false
});

module.exports = Carteira;