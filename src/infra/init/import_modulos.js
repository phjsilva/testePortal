const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const pool = require("../../database/db");

const csvPath = path.resolve(__dirname, "seed-data", "modulos.csv");


async function importCsv() {
  await pool.query("TRUNCATE TABLE modulos CASCADE");

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

    for (const row of rows) {
    const [id_modulo, titulo] = row;

    values.push(`($${i},$${i + 1})`);

    params.push(id_modulo, titulo);

    i += 2;
    }

    await pool.query(
    `INSERT INTO modulos (
        id_modulo,
        titulo
    ) VALUES ${values.join(",")}`,
    params
    );

    console.log("CSV importado com sucesso");

    await pool.end();
    }

importCsv().catch(console.error);