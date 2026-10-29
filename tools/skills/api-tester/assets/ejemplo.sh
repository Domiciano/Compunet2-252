# Pruebas de /courses. Las corre test.sh, que define check,
# status, body, has y los tokens.

check "GET /courses · admin" 200 "$(status GET /courses "$ADMIN")"
check "GET /courses · director" 200 "$(status GET /courses "$DIRECTOR")"
check "GET /courses · sin token" 401 "$(status GET /courses)"
check "GET /courses · token alterado" 401 "$(status GET /courses "$ALTERADO")"

LIST=$(body GET /courses "$ADMIN")
check "GET /courses · trae publicId" si "$(has "$LIST" '"publicId"')"
check "GET /courses · no trae el id" no "$(has "$LIST" '"id":')"

ID=$(echo "$LIST" | sed -E 's/.*"publicId":"([^"]+)".*/\1/')
check "GET /courses/{publicId} · existe" 200 \
  "$(status GET "/courses/$ID" "$ADMIN")"
check "GET /courses/{publicId} · no existe" 404 \
  "$(status GET /courses/00000000-0000-0000-0000-000000000000 "$ADMIN")"

NEW="{\"name\":\"Curso $(date +%s)\"}"
check "POST /courses · admin" 201 "$(status POST /courses "$ADMIN" "$NEW")"
check "POST /courses · sin permiso" 403 \
  "$(status POST /courses "$DIRECTOR" "$NEW")"
check "POST /courses · JSON mal formado" 400 \
  "$(status POST /courses "$ADMIN" '{"name":')"
