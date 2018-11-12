FROM dockette/jessie
MAINTAINER eplauchu@agnux.com

RUN apt-get update

# JDK 1.8 and more to build war
RUN apt-get install -y wget openjdk-7-jdk default-jdk maven \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME="/usr/lib/jvm/default-java" \
    GLASSFISH_PKG=/service/glassfish-3.1.2.2.zip \
    GLASSFISH_URL=http://download.oracle.com/glassfish/3.1.2.2/release/glassfish-3.1.2.2.zip \
    GLASSFISH_HOME=/service/glassfish3 \
    MD5=ae8e17e9dcc80117cb4b39284302763f \
    PATH=$PATH:/service/glassfish3/bin

# Build R1 project
COPY erp-quimicos /erp-quimicos
COPY bbgum-impt /bbgum-impt
COPY bbgum-jcli /bbgum-jcli
COPY r1 /r1
COPY service /service
WORKDIR /r1
RUN mvn clean install -DskipTests

# Deploy war
WORKDIR /service

RUN mv ../erp-quimicos/target/agnux.war ./
RUN stat agnux.war

# remove needless stuff
RUN rm -rf /erp-quimicos
RUN rm -rf /bbgum-impt
RUN rm -rf /bbgum-jcli
RUN rm -rf /r1

# Download and install GlassFish
RUN wget -q -O $GLASSFISH_PKG $GLASSFISH_URL && \
    echo "$MD5 *$GLASSFISH_PKG" | md5sum -c - && \
    unzip -o $GLASSFISH_PKG -d /service && \
    rm -f $GLASSFISH_PKG && \
    \
    # Remove Windows .bat and .exe files to save space
    cd $GLASSFISH_HOME && \
    find . -name '*.bat' -delete && \
    find . -name '*.exe' -delete

# Ports being exposed
EXPOSE 4848 8080 8181

ENTRYPOINT ["/service/webui.sh", "/service/agnux.war"]
