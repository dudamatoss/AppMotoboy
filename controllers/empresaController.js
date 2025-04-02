const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const { Empresa } = require('../models');
const db = require('../config/database'); // Conexão com o banco


const SECRET_KEY = process.env.SECRET_KEY || "minha-chave-secreta";

// Função para cadastrar motoboy
exports.registerEmpresa = async (req, res) => {
    const { nome, email, senha, telefone, cnpj, endereco } = req.body;

    try {
        // Verificar se o email ou CNPJ já existem
        const rows = await db.query("SELECT * FROM empresas WHERE email = :email OR cnpj = :cnpj", {
            replacements: { email, cnpj },
            type: QueryTypes.SELECT
        });

        if (rows.length > 0) {
            return res.status(400).json({ error: "Email ou CNPJ já cadastrado" });
        }

        // Criptografar senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Inserir no banco de dados
        await db.query("INSERT INTO empresas (nome, email, senha, telefone, cnpj, endereco) VALUES (:nome, :email, :senha, :telefone, :cnpj, :endereco)", {
            replacements: { 
                nome, 
                email, 
                senha: hashedSenha, 
                telefone, 
                cnpj, 
                endereco
             },
            type: QueryTypes.INSERT
        }
    );

        res.status(201).json({ message: "Empresa cadastrada com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao cadastrar empresa:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};


// Função para login de empresa
exports.loginEmpresa = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const empresa = await Empresa.findOne({ where: { email } });

        if (!empresa) {
            return res.status(404).json({ error: "Empresa não encontrada!" });
        }

        // Comparação correta da senha criptografada
        const senhaCorreta = await bcrypt.compare(senha, empresa.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: "Senha incorreta!" });
        }

        // Gerar token JWT com o ID da empresa
        const token = jwt.sign(
            { id: empresa.id, email: empresa.email, empresa_id: empresa.id }, 
            SECRET_KEY,
            { expiresIn: '8h' }
        );

        return res.json({ message: "Login realizado com sucesso!", token });

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: "Erro interno ao fazer login!" });
    }
};
