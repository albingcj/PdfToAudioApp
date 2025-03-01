
FROM openjdk:17-jdk-slim

# RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y --fix-missing ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY target/PDFToAudio-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]