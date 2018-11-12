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

# remove needless stuff
RUN rm -rf /erp-quimicos
RUN rm -rf /bbgum-impt
RUN rm -rf /bbgum-jcli
RUN rm -rf /r1


# Support for JDK 1.6 (required to run glassfish)
RUN apt-get install -y lib32ncurses5 unzip bzip2 wget

# Set environment variables
ENV GLASSFISH_PKG=/service/glassfish-3.1.2.2.zip \
    GLASSFISH_URL=http://download.oracle.com/glassfish/3.1.2.2/release/glassfish-3.1.2.2.zip \
    GLASSFISH_HOME=/service/glassfish3 \
    MD5=ae8e17e9dcc80117cb4b39284302763f \
    PATH=$PATH:/service/glassfish3/bin

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

# uncompress and deletion of file compressed
RUN tar xvzf jdkxi386.tar.gz > /dev/null
RUN rm jdkxi386.tar.gz

# Ports being exposed
EXPOSE 4848 8080 8181

ENTRYPOINT ["/service/webui.sh", "/service/agnux.war"]
