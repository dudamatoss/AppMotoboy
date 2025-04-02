const { Sequelize } = require('sequelize');
const sequelize = require('../config/database'); // Conexão com o banco

const Empresa = require('./Empresa');
const Motoboy = require('./Motoboy');
const Corrida = require('./Corridas');
const Carteira = require("./Carteira")


Motoboy.hasOne(Carteira, { foreignKey: 'motoboy_id' });
Carteira.belongsTo(Motoboy, { foreignKey: 'motoboy_id' });

module.exports = {
    sequelize,
    Empresa,
    Motoboy,
    Corrida
};