#!/usr/bin/env bash
# wait-for-it.sh: Wait for a service to be available

host="$1"
shift
port="$1"
shift

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port to be available..."
  sleep 2
done

exec "$@"
