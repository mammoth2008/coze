#!/bin/bash

exec 2>&1
set -e

#volumes:
#  - ./conf/default/nginx/entrypoint.sh:/cozeloop/conf/nginx/entrypoint.sh
#  - ./conf/default/tools:/cozeloop/conf/tools
CONF_PATH="/cozeloop/conf"
TOOLS_CONF_PATH="$CONF_PATH/tools"

. "$TOOLS_CONF_PATH/print_banner.sh"

print_banner "Starting..."
print_banner_delay "Successfully Started!" 2

echo "+ docker-entrypoint.sh nginx -g 'daemon off;'"
exec /docker-entrypoint.sh nginx -g 'daemon off;'