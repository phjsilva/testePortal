const { randomBytes, scryptSync, timingSafeEqual } = require("crypto");

// Recebe a senha em texto puro e retorna o hash bcrypt (scrypt) para salvar no banco
function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");

    return `${salt}:${hash}`;
}

// Compara a senha do login com o hash armazenado
function verifyPassword(password, storedPassword) {
    const [salt, storedHash] = (storedPassword || "").split(":")

    if (!salt || !storedHash) {
        return false;
    }

    const hash = scryptSync(password, salt, 64);
    const storedHashBuffer = Buffer.from(storedHash, "hex");

    if (hash.length !== storedHashBuffer.length) {
        return false;
    }

    return timingSafeEqual(hash, storedHashBuffer);
}

module.exports = {
    hashPassword,
    verifyPassword,
};
