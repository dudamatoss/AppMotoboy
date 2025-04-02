require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); 

const app = express();
app.use(express.json());
app.use(cors());

// Testar conexão com o banco
app.get('/', (req, res) => {
    res.send('🚀 API do Motoboy está rodando!');
});

// Importar rotas de motoboy
const motoboyRoutes = require('./routes/motoboyRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const corridaRoutes = require('./routes/corridaRoutes');

app.use('/api/motoboy', motoboyRoutes);
app.use('/api/empresa',empresaRoutes);
app.use('/api/corridas',corridaRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);

    try {
        await sequelize.authenticate(); // Testa conexão
        console.log("✅ Conectado ao banco de dados!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco:", error);
    }
});
