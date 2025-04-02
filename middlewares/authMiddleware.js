const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "minha-chave-secreta";
 // Use a mesma chave do login

const verificarToken = (req, res, next) => {
    const token = req.headers.authorization;

   

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        
        // Verifica se o token pertence a um motoboy ou a uma empresa
        if (decoded.empresa_id) {
            req.empresa_id = decoded.empresa_id;
        } else if (decoded.id) {
            req.motoboyId = decoded.id;
        } else {
            return res.status(403).json({ error: "Acesso negado. Tipo de usuário inválido." });
        }
        

        next(); // Continua para a próxima função
    } catch (error) {
        return res.status(401).json({ error: "Token inválido." });
    }
};
module.exports = { verificarToken };