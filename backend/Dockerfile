# # === BUILD STAGE ===
# FROM gradle:8.11.1-jdk17 AS build
# WORKDIR /app
# COPY build.gradle settings.gradle ./
# COPY src ./src
# RUN gradle clean build -x test --no-daemon

# # === RUNTIME STAGE ===
# FROM openjdk:17-jdk-slim
# WORKDIR /app

# # COPY TO A DIRECTORY (required for wildcard)
# COPY --from=build /app/build/libs/*.jar /app/

# # Run the JAR (use wildcard to pick the only one)
# ENTRYPOINT ["java", "-jar", "/app/*.jar"]


# Build stage
# Build stage
FROM gradle:8.11.1-jdk17 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle clean build -x test --no-daemon

# Production stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy only the main JAR file (the one without -plain.jar)
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]