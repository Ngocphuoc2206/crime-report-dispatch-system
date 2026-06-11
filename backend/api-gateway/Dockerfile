FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY shared-lib/pom.xml ./shared-lib/pom.xml
COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY auth-service/pom.xml ./auth-service/pom.xml
COPY report-service/pom.xml ./report-service/pom.xml
COPY evidence-service/pom.xml ./evidence-service/pom.xml
COPY urgency-service/pom.xml ./urgency-service/pom.xml
COPY api-gateway/src ./api-gateway/src
RUN mvn -q -pl api-gateway -am -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/api-gateway/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
