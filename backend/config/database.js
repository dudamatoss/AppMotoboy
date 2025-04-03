const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carregar variáveis do .env

// Criando conexão com o banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', // Defina o banco que você está usando
    logging: false, // Oculta logs SQL no console
});

// Testar a conexão
(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexão com o banco de dados estabelecida!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco:", error);
    }
})();

module.exports = sequelize;
