#!/bin/sh

PG_SQL_IMG="postgres:11.1-alpine"
docker run --name dbms \
-e POSTGRES_PASSWORD=1234qwer \
-e TZ=`cat /etc/timezone` \
-p 5432:5432 -d $PG_SQL_IMG
