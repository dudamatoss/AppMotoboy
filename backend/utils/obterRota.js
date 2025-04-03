const axios = require("axios");

async function obterRota(origemCoords, destinoCoords) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origemCoords.lng},${origemCoords.lat};${destinoCoords.lng},${destinoCoords.lat}?overview=simplified&geometries=geojson`;

    try {
        const resposta = await axios.get(url);
        if (!resposta.data.routes || resposta.data.routes.length === 0) {
            throw new Error("Não foi possível calcular a rota.");
        }

        return resposta.data.routes[0].geometry;
    } catch (error) {
        console.error("Erro ao calcular rota:", error);
        throw new Error("Falha ao obter rota.");
    }
}

module.exports = obterRota;
