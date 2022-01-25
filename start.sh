#!/bin/bash

if [ "$APP" = "cms" ] | [ "$APP" = "api" ] | [ "$APP" = "web" ]; then
  npm run $APP
else
  echo "Could not run unknown app: $APP"
fi
