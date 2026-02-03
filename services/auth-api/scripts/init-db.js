#!/usr/bin/env node
// Initialise la base Postgres: crée la table users et insère un admin si la table est vide
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL || null;
const clientConfig = connectionString ? { connectionString } : {
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  user: process.env.PGUSER || 'dbeaver',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'appdb'
};

async function main(){
  const client = new Client(clientConfig);
  await client.connect();
  console.log('Connected to Postgres');

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  const res = await client.query('SELECT count(*) FROM users');
  const count = parseInt(res.rows[0].count, 10);
  if (count === 0){
    const password = process.env.ADMIN_PASSWORD || 'password';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const id = '1';
    const hash = bcrypt.hashSync(password, 8);
    await client.query('INSERT INTO users(id,email,password_hash,name) VALUES($1,$2,$3,$4)', [id,email,hash,'Admin']);
    console.log('Admin user inserted:', email);
  } else {
    console.log('Users table already contains users:', count);
  }

  await client.end();
  console.log('Done');
}

main().catch(err => {
  console.error('Erreur init-db:', err);
  process.exit(1);
});
