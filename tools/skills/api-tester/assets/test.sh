#!/usr/bin/env bash
# Corre las pruebas de la API. Antes: ./mvnw spring-boot:run
cd "$(dirname "$0")"
BASE="${BASE:-http://localhost:8080/WebApp6/api/v1}"

ENDPOINTS=(
  "GET /courses"
  "GET /courses/{publicId}"
  "POST /courses"
)

NAMES=(); WANT=(); GOT=()

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

body() {
  curl -s -X "$1" "$BASE$2" -H "Authorization: Bearer $3"
}

has() {
  echo "$1" | grep -q "$2" && echo si || echo no
}

check() {
  NAMES+=("$1"); WANT+=("$2"); GOT+=("$3")
}

passed() {
  [ "${WANT[$1]}" = "${GOT[$1]}" ]
}

row() {
  echo "| ${NAMES[$1]} | $2 | ${WANT[$1]} | ${GOT[$1]} |"
}

if [ "$(status GET /courses)" = "000" ]; then
  echo "La API no responde en $BASE · corre ./mvnw spring-boot:run"
  exit 1
fi

ADMIN=$(login nicolas 123456)
DIRECTOR=$(login barragan 123456)
ALTERADO=$(echo "$ADMIN" | sed 's/\./.e/')

for f in tests/api/*.sh; do
  from=${#NAMES[@]}
  source "$f"
  ok=0; fails=()
  for ((i = from; i < ${#NAMES[@]}; i++)); do
    if passed "$i"; then ok=$((ok + 1))
    else fails+=("  FALLA  ${NAMES[$i]} · ${WANT[$i]} → ${GOT[$i]}")
    fi
  done
  name=${f##*/}
  printf '%-14s %d/%d\n' "${name%.sh}" "$ok" $((${#NAMES[@]} - from))
  for line in "${fails[@]}"; do echo "$line"; done
done

TOTAL=${#NAMES[@]}
pass=0
for i in "${!NAMES[@]}"; do passed "$i" && pass=$((pass + 1)); done

covered=0; missing=()
for ep in "${ENDPOINTS[@]}"; do
  hit=no
  for n in "${NAMES[@]}"; do [[ "$n" == "$ep ·"* ]] && hit=si && break; done
  if [ "$hit" = si ]; then covered=$((covered + 1))
  else missing+=("\`$ep\`")
  fi
done
pct=$((100 * covered / ${#ENDPOINTS[@]}))
COVERAGE="$pct % ($covered de ${#ENDPOINTS[@]} endpoints)"

{
  echo "# Resultados de las pruebas · $(date '+%Y-%m-%d %H:%M')"
  echo
  echo "Cobertura: $COVERAGE · Pasaron: $pass de $TOTAL"
  echo
  echo '```bash'
  echo 'bash test.sh'
  echo '```'
  echo
  echo "| Prueba | Resultado | Esperado | Llegó |"
  echo "|---|---|---|---|"
  for i in "${!NAMES[@]}"; do passed "$i" || row "$i" FALLA; done
  for i in "${!NAMES[@]}"; do passed "$i" && row "$i" OK; done
  if [ ${#missing[@]} -gt 0 ]; then
    echo
    echo "Sin probar: ${missing[*]}"
  fi
} > testresults.md

echo
echo "Cobertura $COVERAGE · $pass de $TOTAL pasaron"
echo "Detalle en testresults.md"
[ "$pass" -eq "$TOTAL" ]
