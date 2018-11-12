#!/bin/sh

BASE_DIR="$PWD"
JAVA_HOME="$BASE_DIR/jdk"
GLASS="$BASE_DIR/glassfish3"
ASADMIN=$GLASS/bin/asadmin

$ASADMIN start-domain
$ASADMIN -u admin deploy $1
$ASADMIN stop-domain
$ASADMIN start-domain --verbose
