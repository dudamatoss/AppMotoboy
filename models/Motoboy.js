const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Motoboy = db.define('Motoboy', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    placa: {
        type: DataTypes.STRING
    },
    modelo: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'motoboys', // Usa exatamente o nome da tabela no banco
    timestamps: false // Remove os campos `createdAt` e `updatedAt`
});

module.exports = Motoboy;
