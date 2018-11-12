FROM dockette/stretch
MAINTAINER eplauchu@agnux.com

RUN apt-get update

# JDK 1.8 and more to build war
RUN apt-get install -y openjdk-8-jdk default-jdk maven

COPY erp-quimicos /erp-quimicos
COPY bbgum-impt /bbgum-impt
COPY bbgum-jcli /bbgum-jcli
COPY r1 /r1
COPY service /service

WORKDIR /r1

# Build R1 project
RUN JAVA_HOME="/usr/lib/jvm/default-java" mvn clean install -DskipTests

# Deploy war
WORKDIR /service

RUN mv ../erp-quimicos/target/agnux.war ./
RUN stat agnux.war

# Support for JDK 1.6 (required to run glassfish)
RUN apt-get install -y lib32ncurses5 bzip2

RUN tar xvjf glassfish.tar.bz2
RUN tar xvzf jdkxi386.tar.gz

RUN rm glassfish.tar.bz2
RUN rm jdkxi386.tar.gz
RUN rm -rf /erp-quimicos
RUN rm -rf /bbgum-impt
RUN rm -rf /bbgum-jcli
RUN rm -rf /r1


EXPOSE 8080

ENTRYPOINT ["/service/webui.sh", "../erp-quimicos/target/agnux.war"]
