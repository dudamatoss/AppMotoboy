const {DataTypes} = require('sequelize');
const db = require('../config/database');


const Empresa = db.define('Empresa', {
    id:
    { type:DataTypes.INTEGER, 
        primaryKey:true, 
        autoIncrement:true
    },
    nome: 
    { type: DataTypes.STRING,
        allowNull: false 
    },
    email: 
    { type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    senha: 
    { type: DataTypes.STRING, 
        allowNull: false 
    },
    telefone: 
    { type: DataTypes.STRING, 
        allowNull: false 
    },
    endereco: 
    { type: DataTypes.STRING, 
        allowNull: false 
    },
    cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }

}, {
    tableName: 'empresas', // Usa exatamente o nome da tabela no banco
    timestamps: false // Remove os campos `createdAt` e `updatedAt`
});

module.exports = Empresa;