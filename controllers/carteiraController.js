const {Corrida, Carteira } = require("../models");

exports.consultarSaldo = async (req, res) => {
    try {
        const motoboyId = req.motoboyId;
        const carteira = await Carteira.findOne({ where: { motoboy_id: motoboyId } });

        if (!carteira) {
            return res.status(404).json({ error: "Carteira não encontrada." });
        }

        res.status(200).json({ saldo: carteira.saldo });
    } catch (error) {
        console.error("Erro ao consultar saldo:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};

exports.solicitarSaque = async (req, res) => {
    const { valor } = req.body;
    const motoboy_id = req.motoboyId; // Pegando do token

    if (!valor || isNaN(valor) || valor <= 0) {
        return res.status(400).json({ error: "Valor do saque inválido." });
    }

    try {
        const carteira = await Carteira.findOne({ where: { motoboy_id } });

        if (!carteira) {
            return res.status(404).json({ error: "Carteira não encontrada." });
        }

        if (carteira.saldo < valor) {
            return res.status(400).json({ error: "Saldo insuficiente para saque." });
        }

        // Atualizar saldo subtraindo o valor sacado
        carteira.saldo -= parseFloat(valor);
        await carteira.save();

        return res.status(200).json({ message: "Saque realizado com sucesso!", novo_saldo: carteira.saldo });
    } catch (error) {
        console.error(" Erro ao processar saque:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};


exports.historicoTransacoes = async (req, res) => {
    const motoboy_id = req.motoboyId; // Pegando do token

    try {
        const carteira = await Carteira.findOne({ where: { motoboy_id } });

        if (!carteira) {
            return res.status(404).json({ error: "Carteira não encontrada." });
        }

        // Conta quantas corridas o motoboy já fez
        const totalCorridas = await Corrida.count({ where: { motoboy_id } });

        return res.status(200).json({
            saldo_atual: carteira.saldo,
            total_corridas: totalCorridas,
            mensagem: "Histórico básico: saldo e corridas concluídas."
        });

    } catch (error) {
        console.error(" Erro ao consultar histórico:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};

