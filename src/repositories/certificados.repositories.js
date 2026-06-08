const pool = require("../database/db");

async function findUsuarioByCertificadoHash(certificadoHash) {
    const result = await pool.query(
        `SELECT id_usuario, nome, cpf, email, certificado_hash
         FROM usuarios
         WHERE certificado_hash = $1`,
        [certificadoHash],
    );
    return result.rows[0] || null;
}

async function findModulos() {
    const result = await pool.query(
        `SELECT id_modulo, titulo FROM modulos ORDER BY id_modulo ASC`,
    );
    return result.rows;
}

async function findMediaFinalByUsuario(id_usuario) {
    const result = await pool.query(
        `SELECT ROUND(AVG(r.nota) * 100, 2) AS media_certificado
         FROM exames e
         JOIN respostas r ON r.id_exame = e.id_exame
         WHERE e.id_usuario = $1`,
        [id_usuario],
    );

    const row = result.rows[0];

    if (!row || row.media_certificado === null) {
        return null;
    }

    return parseFloat(row.media_certificado);
}

module.exports = {
    findUsuarioByCertificadoHash,
    findModulos,
    findMediaFinalByUsuario,
};
