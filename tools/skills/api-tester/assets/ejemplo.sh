#!/usr/bin/env bash
# Pruebas de /courses. Antes: ./mvnw spring-boot:run
BASE="${BASE:-http://localhost:8080/WebApp6/api/v1}"
PASS=0
FAIL=0

login() {
  curl -s -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$1\",\"password\":\"$2\"}" \
    | sed -E 's/.*"accessToken":"([^"]+)".*/\1/'
}

status() {
  local args=(-s -o /dev/null -w "%{http_code}" -X "$1" "$BASE$2")
  [ -n "$3" ] && args+=(-H "Authorization: Bearer $3")
  [ -n "$4" ] && args+=(-H "Content-Type: application/json" -d "$4")
  curl "${args[@]}"
}

check() {
  if [ "$2" = "$3" ]; then
    PASS=$((PASS + 1)); echo "  OK     $1"
  else
    FAIL=$((FAIL + 1)); echo "  FALLA  $1 · esperaba $2, llegó $3"
  fi
}

ADMIN=$(login nicolas 123456)
DIRECTOR=$(login barragan 123456)
ALTERADO=$(echo "$ADMIN" | sed 's/\./.e/')

echo "GET /courses"
check "GET /courses · admin" 200 "$(status GET /courses "$ADMIN")"
check "GET /courses · director" 200 "$(status GET /courses "$DIRECTOR")"
check "GET /courses · sin token" 401 "$(status GET /courses)"
check "GET /courses · token alterado" 401 \
  "$(status GET /courses "$ALTERADO")"

BODY=$(curl -s "$BASE/courses" -H "Authorization: Bearer $ADMIN")
check "GET /courses · trae publicId" si \
  "$(echo "$BODY" | grep -q '"publicId"' && echo si || echo no)"
check "GET /courses · no trae el id" no \
  "$(echo "$BODY" | grep -q '"id":' && echo si || echo no)"

echo
echo "$PASS pasaron · $FAIL fallaron"
[ "$FAIL" -eq 0 ]
