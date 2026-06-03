const dotenv = require("dotenv");
const path = require("path");
const { Pool, Connection } = require("pg");

dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..", "..", ".env"),
});

 let config

if (process.env.DATABASE_URL) {
    
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  console.log("neon")
} else {
  config = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
  };

    console.log("pg")
}

const pool = new Pool(config);
module.exports = pool;
