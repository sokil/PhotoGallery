#!/usr/bin/env bash

# Prepare config with replaced variabes
envsubst '$COMPOSE_PROJECT_NAME $SRC_DOCUMENT_ROOT $PHP_APP_ENTRYPOINT' < /etc/nginx/conf.d.template/nginx.conf > /etc/nginx/conf.d/nginx.conf

# Start nginx
nginx -g 'daemon off;'
