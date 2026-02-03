#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${1:-http://localhost:4000}

echo "Test login success (admin@example.com/password)"
curl -sS -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}' | jq .

echo "\nTest login fail (wrong password)"
curl -sS -o /dev/null -w "%{http_code}\n" -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"wrong"}'
