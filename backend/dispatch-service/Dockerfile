FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy lib pom.xml
COPY pom.xml ./pom.xml
COPY shared-lib/pom.xml ./shared-lib/pom.xml
COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY auth-service/pom.xml ./auth-service/pom.xml
COPY report-service/pom.xml ./report-service/pom.xml
COPY evidence-service/pom.xml ./evidence-service/pom.xml
COPY urgency-service/pom.xml ./urgency-service/pom.xml
COPY dispatch-service/pom.xml ./dispatch-service/pom.xml

# Copy source
COPY shared-lib/src ./shared-lib/src
COPY dispatch-service/src ./dispatch-service/src

RUN mvn -q -pl dispatch-service -am -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /workspace/dispatch-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]