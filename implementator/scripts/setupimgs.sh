#!/bin/sh

echo "Setting up foundation images"

COMMIT=`git log --pretty=format:'%h' -n 1`

docker build -t maxima/fiscal:$COMMIT ../../fiscal
docker build -t maxima/frontend:$COMMIT ../../frontend

docker pull postgres:11.1-alpine
