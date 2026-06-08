const {
    findUsuarioByCertificadoHash,
    findModulos,
    findMediaFinalByUsuario,
} = require("../repositories/certificados.repositories");
const {
    findModulosRespondidosByUsuario,
} = require("../repositories/questoes.repositories");
const {
    groupTentativasByModulo,
    mapModulo,
    getCertificatePeriod,
} = require("../utils/certificados.utils");
const { NOTA_MINIMA_APROVACAO } = require("../utils/calcule");
const { createHttpError } = require("../utils/http-error");

async function buscarCertificadoPorHash(hash) {
    const certificadoHash = String(hash || "").trim();

    if (!certificadoHash) {
        throw createHttpError(400, "Hash do certificado obrigatorio.");
    }

    const usuario = await findUsuarioByCertificadoHash(certificadoHash);

    if (!usuario) {
        throw createHttpError(
            404,
            "Certificado inexistente para o hash informado.",
        );
    }

    const modulosRows = await findModulos();
    const tentativas = await findModulosRespondidosByUsuario(
        usuario.id_usuario,
    );
    const tentativasByModulo = groupTentativasByModulo(tentativas);

    const modulos = [];
    const modulosConcluidos = [];

    for (const moduloRow of modulosRows) {
        const idModulo = Number(moduloRow.id_modulo);
        const tentativasDoModulo = tentativasByModulo.get(idModulo) || [];
        const modulo = mapModulo(moduloRow, tentativasDoModulo);

        modulos.push(modulo);

        const moduloConcluido = modulo.notasTentativas.some(
            (tentativa) =>
                tentativa.concluida &&
                Number(tentativa.nota) >= NOTA_MINIMA_APROVACAO,
        );

        if (moduloConcluido) {
            modulosConcluidos.push(modulo);
        }
    }

    if (!modulos.length || modulosConcluidos.length !== modulos.length) {
        throw createHttpError(
            409,
            "Certificado indisponivel: Conclusao de todos os modulos obrigatoria.",
        );
    }

    const mediaFinal = await findMediaFinalByUsuario(usuario.id_usuario);

    if (mediaFinal === null) {
        throw createHttpError(
            409,
            "Media final nao encontrada para o usuario.",
        );
    }

    const periodo = getCertificatePeriod(modulosConcluidos);

    return {
        aluno: {
            nome: usuario.nome,
            cpf: usuario.cpf,
            email: usuario.email,
        },
        certificado: {
            certificadoHash: usuario.certificado_hash,
            codigoValidacao: usuario.certificado_hash,
            emitidoEm: periodo.fimEm,
            inicioEm: periodo.inicioEm,
            fimEm: periodo.fimEm,
        },
        progresso: {
            modulosConcluidos,
        },
        mediaFinal,
    };
}

module.exports = {
    buscarCertificadoPorHash,
};
