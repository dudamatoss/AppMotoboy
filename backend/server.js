require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // Importar módulo HTTP para o Socket.io
const socketIo = require('socket.io'); // Importar Socket.io

const sequelize = require('./config/database'); 
const Motoboy = require('./models/Motoboy'); // Importar modelo do motoboy

const app = express();
const server = http.createServer(app); // Criar servidor HTTP
const io = socketIo(server, { cors: { origin: "*" } }); // Configurar WebSocket

app.use(express.json());
app.use(cors());

// Testar conexão com o banco
app.get('/', (req, res) => {
    res.send(' API do Motoboy está rodando!');
});

// WebSocket para rastreamento em tempo real
io.on("connection", (socket) => {
    console.log("📡 Motoboy conectado!");

    socket.on("updateLocation", async (data) => {
        const { id, lat, lng } = data;
        try {
            await Motoboy.update({ latitude: lat, longitude: lng }, { where: { id } });
            io.emit("motoboyLocationUpdated", { id, lat, lng });
        } catch (error) {
            console.error("Erro ao atualizar localização do motoboy:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(" Motoboy desconectado");
    });
});

// Importar rotas de motoboy
const motoboyRoutes = require('./routes/motoboyRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const corridaRoutes = require('./routes/corridaRoutes');
const carteiraRoutes = require('./routes/carteiraRoutes');

app.use('/api/motoboy', motoboyRoutes);
app.use('/api/empresa',empresaRoutes);
app.use('/api/corridas',corridaRoutes);
app.use('/api/carteira',carteiraRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    console.log(` Servidor rodando na porta ${PORT}`);

    try {
        await sequelize.authenticate(); // Testa conexão
        console.log(" Conectado ao banco de dados!");
    } catch (error) {
        console.error(" Erro ao conectar ao banco:", error);
    }
});
