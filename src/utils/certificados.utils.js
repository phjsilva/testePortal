// Agrupa as tentativas por id_modulo em um Map
function groupTentativasByModulo(tentativas) {
    return tentativas.reduce((groups, tentativa) => {
        const idModulo = Number(tentativa.id_modulo);

        if (!groups.has(idModulo)) {
            groups.set(idModulo, []);
        }

        groups.get(idModulo).push(tentativa);

        return groups;
    }, new Map());
}

// Transforma uma linha do banco + tentativas no formato usado pelo domínio
function mapModulo(modulo, tentativas) {
    return {
        id_modulo: modulo.id_modulo,
        titulo: modulo.titulo,
        metaQuestoes: Number(tentativas[0]?.questoes) || 0,
        notasTentativas: tentativas.map((tentativa) => ({
            nota: Number(tentativa.nota) || 0,
            metaQuestoes: Number(tentativa.questoes) || 0,
            tentativa: tentativa.tentativa,
            concluida:
                Number(tentativa.questoes_respondidas) >=
                Number(tentativa.questoes),
            inicioEm: tentativa.inicio,
            fimEm: tentativa.fim,
        })),
    };
}

// Retorna o período (início e fim) a partir dos módulos concluídos
function getCertificatePeriod(modulosConcluidos) {
    const dates = modulosConcluidos
        .flatMap((modulo) => modulo.notasTentativas)
        .filter((tentativa) => tentativa.concluida)
        .flatMap((tentativa) => [tentativa.inicioEm, tentativa.fimEm])
        .filter(Boolean)
        .map((value) => new Date(value))
        .filter((date) => !Number.isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

    return {
        inicioEm: dates[0]?.toISOString() || null,
        fimEm: dates[dates.length - 1]?.toISOString() || null,
    };
}

module.exports = {
    groupTentativasByModulo,
    mapModulo,
    getCertificatePeriod,
};
