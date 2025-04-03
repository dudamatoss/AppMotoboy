const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "minha-chave-secreta";

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
    }

    const token = authHeader.split(" ")[1]; // Obtém apenas o token sem "Bearer"

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        // Verifica se é um motoboy ou empresa
        if (decoded.empresa_id) {
            req.empresa_id = decoded.empresa_id;
        } else if (decoded.id) {
            req.motoboyId = decoded.id;
        } else {
            return res.status(403).json({ error: "Acesso negado. Tipo de usuário inválido." });
        }

        next();
    } catch (error) {
        console.error(" Erro ao verificar token:", error);
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};

module.exports = { verificarToken };
