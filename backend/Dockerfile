# Build stage
FROM gradle:8.11.1-jdk17 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle clean build -x test --no-daemon

# Production stage - CHANGE THIS LINE:
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy only the main JAR file (the one without -plain.jar)
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]