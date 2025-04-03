const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const db = require('../config/database'); // Conexão com o banco


const SECRET_KEY = process.env.SECRET_KEY || "minha-chave-secreta";


// Função para cadastrar motoboy
exports.registerMotoboy = async (req, res) => {
    const { nome, email, senha, telefone, cpf, placa, modelo } = req.body;

    if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório" });
    }

    // Normaliza o CPF removendo pontos e traço
    const cpfNormalizado = cpf.replace(/\D/g, '');

    try {
        // Verificar se o email ou CPF já existem no banco
        const rows = await db.query(
            "SELECT * FROM motoboys WHERE email = :email OR cpf = :cpf",
            {
                replacements: { email, cpf: cpfNormalizado },
                type: QueryTypes.SELECT
            }
        );

        if (rows.length > 0) {
            return res.status(400).json({ error: "Email ou CPF já cadastrado" });
        }

        // Criptografar senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Inserir no banco de dados
        const [result] = await db.query(
            "INSERT INTO motoboys (nome, email, senha, telefone, cpf, placa, modelo) VALUES (:nome, :email, :senha, :telefone, :cpf, :placa, :modelo)",
            {
                replacements: {
                    nome,
                    email,
                    senha: hashedSenha,
                    telefone,
                    cpf: cpfNormalizado,
                    placa,
                    modelo
                },
                type: QueryTypes.INSERT
            }
        );

        // Capturar o ID do motoboy cadastrado
        const motoboy_id = result; // Sequelize retorna apenas o ID no INSERT


        // Criar carteira para o motoboy
        await db.query(
            "INSERT INTO carteira (motoboy_id, saldo) VALUES (:motoboy_id, 0.00)",
            {
                replacements: { motoboy_id },
                type: QueryTypes.INSERT
            }
        );

        res.status(201).json({ message: "Motoboy cadastrado com sucesso!" });
    } catch (error) {
        console.error(" Erro ao cadastrar motoboy:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};


// Função para login de motoboy
exports.loginMotoboy = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Buscar usuário no banco
        const motoboys = await db.query(
            "SELECT * FROM motoboys WHERE email = ?",
            {
                replacements: [email],
                type: QueryTypes.SELECT
            }
        );

        if (motoboys.length === 0) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        const motoboy = motoboys[0];

        // Validar senha
        if (!motoboy.senha || !(await bcrypt.compare(senha, motoboy.senha))) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: motoboy.id, email: motoboy.email },
            SECRET_KEY,
            { expiresIn: '8h' }
        );

        res.status(200).json({ message: "Login realizado com sucesso!", token });
    } catch (error) {
        console.error(" Erro ao fazer login:", error.stack);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};
