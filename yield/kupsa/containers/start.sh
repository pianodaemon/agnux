#!/bin/sh

set -x

CUST="kupsa"
FISCAL_IMG=maxima/fiscal:dc3e76af
FRONTEND_IMG=maxima/frontend:dc3e76af
FRONTEND_PORT=8080
MS_DBMS_USER="us_kupsa"
MS_DBMS_PASS="kupsa"

#### Not modify from this point onwards

MS_BASE_DIR=$(dirname `pwd`)
MS_DBMS_DB=$CUST

MS_DBMS_HOST="dbms"
MS_DBMS_PORT="5432"
MS_PROFILE="default.json"
MS_DEBUG="DEBUG"
MS_PORT="10080"


FISCAL_CMD="docker run --name "${CUST}-fiscal" \
--link ${MS_DBMS_HOST} \
-e MS_DBMS_DB \
-e MS_DBMS_USER \
-e MS_DBMS_PASS \
-e MS_DBMS_HOST \
-e MS_DBMS_PORT \
-e MS_PROFILE \
-e MS_DEBUG \
-e MS_PORT -d $FISCAL_IMG"

MS_DBMS_URL="jdbc:postgresql://${MS_DBMS_HOST}:${MS_DBMS_PORT}/${MS_DBMS_DB}"
MS_FISCAL_HOST="${CUST}-fiscal:${MS_PORT}"

AS_ADMIN_PASSWORD="1234qwer"
AS_ADMIN_ENABLE_SECURE="1"

FRONTEND_CMD="docker run --name "${CUST}-frontend" \
--link ${MS_DBMS_HOST} \
--link $CUST-fiscal \
-p 8080:$FRONTEND_PORT \
-e MS_DBMS_URL \
-e MS_FISCAL_HOST \
-e AS_ADMIN_PASSWORD \
-e AS_ADMIN_ENABLE_SECURE -d $FRONTEND_IMG"
