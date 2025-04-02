const db = require('../config/database');

const { Corrida } = require('../models');

// Criar uma nova corrida
exports.criarCorrida = async (req, res) => {
    try {
        console.log("🚀 Empresa ID recebido:", req.empresa_id);

        const { descricao, origem, destino, valor, forma_pagamento } = req.body;
        const empresa_id = req.empresa_id; // 🔹 Pegamos o ID do token automaticamente

        if (!empresa_id) {
            return res.status(403).json({ error: "Empresa não autenticada!" });
        }

        if (!descricao || !origem || !destino || !valor || !forma_pagamento) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
        }

        const novaCorrida = await Corrida.create({
            empresa_id,  // O ID já vem automaticamente do token JWT
            descricao,
            origem,
            destino,
            valor,
            forma_pagamento,
            status: 'pendente' // Definir status inicial
        });

        return res.status(201).json({ message: "Corrida criada com sucesso!", corrida: novaCorrida });

    } catch (error) {
        console.error("Erro ao criar corrida:", error);
        return res.status(500).json({ error: "Erro interno ao criar corrida!" });
    }
};

// Listar corridas pendentes
exports.listarCorridasPendentes = async (req, res) => {
    try {
        const corridas = await Corrida.findAll({ where: { status: ['pendente', 'aceita'] } });

        res.status(200).json(corridas);
    } catch (error) {
        console.error("❌ Erro ao buscar corridas pendentes:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};


// Aceitar uma corrida (motoboy)
exports.aceitarCorrida = async (req, res) => {
    const motoboy_id = req.motoboyId; // ✅ Pegando do middleware corretamente
    const { id } = req.params; // ID da corrida



    try {
        const corrida = await Corrida.findOne({ where: { id, status: 'pendente' } });

        if (!corrida) {
            return res.status(400).json({ error: "Corrida já foi aceita ou não existe" });
        }



        corrida.motoboy_id = motoboy_id;
        corrida.status = 'aceita';

        await corrida.save();

        console.log("✅ Depois de atualizar:", corrida.toJSON());

        res.status(200).json({ message: "Corrida aceita com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao aceitar corrida:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};


// Atualizar status da corrida (concluir ou cancelar)
exports.atualizarStatusCorrida = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const motoboy_id = req.motoboyId; // Pegando do token
    const empresa_id = req.empresa_id; // Pegando do token

    if (!['concluída', 'cancelada'].includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
    }

    try {
        const corrida = await Corrida.findByPk(id);

        if (!corrida) {
            return res.status(404).json({ error: "Corrida não encontrada" });
        }

        console.log("🚀 Debug:");
        console.log("Empresa que criou a corrida:", corrida.empresa_id);
        console.log("Motoboy da corrida:", corrida.motoboy_id);
        console.log("Empresa tentando alterar:", empresa_id);
        console.log("Motoboy tentando alterar:", motoboy_id);

        // Somente empresa ou motoboy responsável pode alterar
        if (corrida.empresa_id !== empresa_id && corrida.motoboy_id !== motoboy_id) {
            return res.status(403).json({ error: "Você não tem permissão para alterar esta corrida" });
        }


        // Impedir mudanças indevidas
        if (corrida.status === 'concluída' || corrida.status === 'cancelada') {
            return res.status(400).json({ error: "Essa corrida já foi finalizada e não pode ser alterada" });
        }

        corrida.status = status;
        if (status === 'concluída') {
            corrida.data_conclusao = new Date();
        }

        await corrida.save();

        res.status(200).json({ message: `Corrida ${status} com sucesso!`, corrida });
    } catch (error) {
        console.error("❌ Erro ao atualizar status da corrida:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};

