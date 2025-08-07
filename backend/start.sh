#!/bin/bash

# Script to easily switch between development and production

if [ "$1" = "prod" ]; then
    echo "Starting in PRODUCTION mode..."
    cp .env.production .env
    node server-mongo.js
else
    echo "Starting in DEVELOPMENT mode..."
    cp .env.development .env
    node server-mongo.js
fi