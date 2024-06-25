import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'credential',
    password: 'Joseph966$',
    port: 5432,  // Default PostgreSQL port
});

export default pool;