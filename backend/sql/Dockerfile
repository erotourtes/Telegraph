FROM mysql:8.0.34

COPY ["./telegraph_scheme.sql", "./docker-entrypoint-initdb.d/1.sql"]
COPY ["./stored_procedures.sql", "./docker-entrypoint-initdb.d/2.sql"]
