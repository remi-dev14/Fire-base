Backend (Spring Boot)

This is a minimal Spring Boot backend skeleton created to match the project requirements in `Docs/sujet.txt`.

How to run (requires Java 17 and a Postgres DB):

1. Configure env vars or edit `src/main/resources/application.properties` for `DATABASE_URL`, `DB_USER`, `DB_PASS`.
2. Build and run:

```bash
mvn -f App/backend/pom.xml clean package
java -jar App/backend/target/backend-0.1.0.jar
```

The app will run on port 8080.
