-- verifica quantidade de módulos carregados
SELECT COUNT(*) AS total_modulos FROM public.modulos;

-- verifica quantidade de questões carregadas
SELECT COUNT(*) AS total_questoes FROM public.questoes;

-- verifica questões por módulo

SELECT 
  m.id_modulo,
  m.titulo,
  COUNT(q.id_questao) AS total_questoes
FROM public.modulos m
LEFT JOIN public.questoes q ON q.id_modulo = m.id_modulo
GROUP BY m.id_modulo, m.titulo
ORDER BY m.id_modulo;

-- verifica integridade: questões sem módulo válido

SELECT COUNT(*) AS questoes_orfas
FROM public.questoes q
WHERE NOT EXISTS (
  SELECT 1 FROM public.modulos m WHERE m.id_modulo = q.id_modulo
);

-- verifica alternativas corretas fora do padrão (deve ser a, b, c ou d)
SELECT id_questao, alternativa_correta
FROM public.questoes
WHERE alternativa_correta NOT IN ('a','b','c','d');


-- verifica campos obrigatórios nulos
SELECT COUNT(*) AS enunciados_nulos FROM public.questoes WHERE enunciado IS NULL;
SELECT COUNT(*) AS dificuldade_nula FROM public.questoes WHERE dificuldade IS NULL;