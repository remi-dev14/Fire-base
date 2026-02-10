# Build stage
FROM maven:3.9.4-eclipse-temurin-21 as build
WORKDIR /workspace

# copy only Maven metadata first to leverage layer cache
COPY pom.xml ./
COPY src ./src

RUN mvn -B -DskipTests clean package

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/target/*.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
