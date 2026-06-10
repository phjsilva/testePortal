const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const pool = require("../../database/db");

const csvPath = path.resolve(__dirname, "seed-data", "questoes.csv");


async function importCsv() {
  await pool.query("TRUNCATE TABLE questoes CASCADE");

  const fileContent = fs
    .readFileSync(csvPath, "utf-8")
    .replace(/^\uFEFF/, "");

  const { data: allRows } = Papa.parse(fileContent, {
    delimiter: ";",
    header: false,
    skipEmptyLines: true,
  });

  const rows = allRows.slice(1);

  const values = [];
  const params = [];
  let i = 1;
  console.log(rows[0]);
  for (const row of rows) {
    const [
        id_questao,
        id_modulo,
        grupo,
        numero,
        dificuldade,
        enunciado,
        alternativa_correta,
        alternativa_a,
        alternativa_b,
        alternativa_c,
        alternativa_C,
        imagem
    ] = row;

values.push(
  `($${i},$${i+1},$${i+2},$${i+3},$${i+4},$${i+5},$${i+6},$${i+7},$${i+8},$${i+9},$${i+10},$${i+11})`
);
    params.push(
      id_questao,
      id_modulo,
      grupo,
      numero,
      dificuldade,
      enunciado,
      alternativa_correta,
      alternativa_a,
      alternativa_b,
      alternativa_c,
      alternativa_C,
      imagem === "NULL" ? null:imagem
    );
    i += 12;
  }

  await pool.query(
    `INSERT INTO questoes (
      id_questao,
      id_modulo,
      grupo,
      numero,
      dificuldade,
      enunciado,
      alternativa_correta,
      alternativa_a,
      alternativa_b,
      alternativa_c,
      alternativa_d,
      imagem
    ) VALUES ${values.join(",")}`,
    params
  );

  console.log("CSV importado com sucesso");

  await pool.end();
}

importCsv().catch(console.error);