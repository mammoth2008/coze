#!/bin/sh

exec 2>&1
set -e

# volumes:
#   - .:/cozeloop
. /cozeloop/conf/default/tools/print_banner.sh

export ROCKETMQ_GO_LOG_LEVEL=error

printf "+ Waiting for basic services - redis, mysql, minio, clickhouse, rocketmq (namesrv & broker) - to stabilize...\n"
sleep 30

if [ "$RUN_MODE" = "debug" ]; then
  print_banner "Starting in [DEBUG] mode..."
  print_banner_delay "Successfully Started in [DEBUG] mode! Please toggle debugger in IDEA at [HOST_IP:40000]." 3

  set -x
  dlv exec /cozeloop-bin/backend/debug/main \
    --headless \
    --listen=:40000 \
    --api-version=2 \
    --accept-multiclient \
    --log

  wait
elif [ "$RUN_MODE" = "release" ]; then
  print_banner "Starting in [RELEASE] mode..."
  print_banner_delay "Successfully Started in [RELEASE] mode!" 5

  set -x
  /cozeloop-bin/backend/release/main

  wait
else
  print_banner "Starting in [DEV] mode..."
  print_banner_delay "Successfully Started in [DEV] mode!" 50

  set -x
  air

  wait
fi