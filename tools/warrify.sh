#!/bin/sh

MAXIMA_ROOT="$HOME/agnux"
MAXIMA_TOOLS="$MAXIMA_ROOT/tools"
MAXIMA_R1="$MAXIMA_ROOT/r1"

cd $MAXIMA_R1
JAVA_HOME="/usr/lib/jvm/default-java" mvn clean install -DskipTests
cd -
