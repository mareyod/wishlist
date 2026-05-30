import { Pool, types } from 'pg';
import dotenv from "dotenv";
dotenv.config();


// INTEGER (int4)
types.setTypeParser(23, (val) => parseInt(val, 10));

// BIGINT (int8)
types.setTypeParser(20, (val) => parseInt(val, 10));

// NUMERIC / DECIMAL
types.setTypeParser(1700, (val) => parseFloat(val));

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Требуется переменная окружения ${name}`);
  }

  return value;
}

const pool = new Pool({
    user: getEnv("DB_USER"),
    host: getEnv("DB_HOST"),
    database: getEnv("DB_NAME"),
    password: getEnv("DB_PASSWORD"),
    port: Number(getEnv("DB_PORT")),
});

pool.on('connect', ():void => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err: Error): void => {
  console.error('Unexpected error on idle client', err);
  process.exit(1);
});

export default pool;