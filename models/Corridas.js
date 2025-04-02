const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Empresa = require('./Empresa');
const Motoboy = require('./Motoboy');

const Corrida = sequelize.define('Corrida', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Empresa,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    motoboy_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Será preenchido quando um motoboy aceitar a corrida
        references: {
            model: Motoboy,
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    origem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destino: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendente', 'aceita', 'concluída', 'cancelada'),
        defaultValue: 'pendente'
    },
    forma_pagamento: {
        type: DataTypes.ENUM('dinheiro', 'cartao', 'pix'),
        allowNull: false
    }
}, {
    tableName: 'corridas', // Usa exatamente o nome da tabela no banco
    timestamps: false // Remove os campos `createdAt` e `updatedAt`
});

module.exports = Corrida;
