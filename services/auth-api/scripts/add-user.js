#!/usr/bin/env node
// Usage: node scripts/add-user.js email password [name]
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const [,, email, password, name] = process.argv;
if (!email || !password) {
  console.error('Usage: node scripts/add-user.js email password [name]');
  process.exit(2);
}

const usersFile = path.join(__dirname, '..', 'users.json');
let users = [];
if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

const id = `${Date.now()}`;
const passwordHash = bcrypt.hashSync(password, 8);
const user = { id, email, passwordHash, name: name || email.split('@')[0] };
users.push(user);
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
console.log('Ajouté user:', email);
