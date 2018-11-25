#!/bin/sh


export CUST="kupsa"
export TAG_IMG=fe618c4e
export FRONTEND_PORT=8080
export MS_DBMS_USER="us_kupsa"
export MS_DBMS_PASS="kupsa"

# Please. Not modify from this point onwards

FISCAL_IMG=maxima/fiscal:$TAG_IMG
FRONTEND_IMG=maxima/frontend:$TAG_IMG
YIELD_DIR=$(dirname `pwd`)

export MS_BASE_DIR=/yield
export MS_DBMS_DB=$CUST

export MS_DBMS_HOST="dbms"
export MS_DBMS_PORT="5432"
export MS_PROFILE="default.json"
export MS_DEBUG="DEBUG"
export MS_PORT="10080"

export MS_DBMS_URL="jdbc:postgresql://${MS_DBMS_HOST}:${MS_DBMS_PORT}/${MS_DBMS_DB}"
export MS_FISCAL_HOST="${CUST}-fiscal:${MS_PORT}"

export AS_ADMIN_PASSWORD="1234qwer"
export AS_ADMIN_ENABLE_SECURE="1"

FISCAL_CMD="docker run --name "${CUST}-fiscal" \
-v ${YIELD_DIR}:${MS_BASE_DIR} \
--link ${MS_DBMS_HOST} \
-e MS_BASE_DIR \
-e MS_DBMS_DB \
-e MS_DBMS_USER \
-e MS_DBMS_PASS \
-e MS_DBMS_HOST \
-e MS_DBMS_PORT \
-e MS_PROFILE \
-e MS_DEBUG \
-e MS_PORT -d $FISCAL_IMG"

$FISCAL_CMD


FRONTEND_CMD="docker run --name "${CUST}-frontend" \
-v ${YIELD_DIR}:${MS_BASE_DIR} \
--link ${MS_DBMS_HOST} \
--link $CUST-fiscal \
-p 8080:$FRONTEND_PORT \
-e MS_BASE_DIR \
-e MS_DBMS_USER \
-e MS_DBMS_PASS \
-e MS_DBMS_URL \
-e MS_FISCAL_HOST \
-e AS_ADMIN_PASSWORD \
-e AS_ADMIN_ENABLE_SECURE -d $FRONTEND_IMG"

$FRONTEND_CMD
