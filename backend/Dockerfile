
FROM gradle:8.11.1-jdk17 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle clean build -x test --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/build/libs/app.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]