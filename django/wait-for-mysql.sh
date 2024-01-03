#!/bin/bash
# wait-for-mysql.sh

set -e

host="$1"  # Primer argumento es el host
shift
cmd="$@"  # Resto de los argumentos

until mysqladmin ping -h"$host" --silent; do
  echo "MySQL está inalcanzable - esperando..." >&2
  sleep 5
done

echo "MySQL está disponible - ejecutando el comando" >&2
exec $cmd
