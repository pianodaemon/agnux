FROM dockette/stretch
MAINTAINER eplauchu@agnux.com

RUN apt-get update
RUN apt-get install -y openjdk-8-jdk default-jdk
RUN apt-get install -y maven

COPY erp-quimicos /erp-quimicos
COPY bbgum-impt /bbgum-impt
COPY bbgum-jcli /bbgum-jcli
COPY service /service
WORKDIR /service

RUN JAVA_HOME="/usr/lib/jvm/default-java" mvn clean install -DskipTests

EXPOSE 8080

ENTRYPOINT ["/bin/echo", "hola mundo"]
