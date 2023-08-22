CREATE USER 'app'@'localhost' IDENTIFIED BY '{{ DB_PASSWORD }}';
GRANT SELECT, INSERT, UPDATE, DELETE ON telegraph.* TO 'app'@'localhost';
