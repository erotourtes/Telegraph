CREATE USER 'app'@'%' IDENTIFIED BY '${DB_PASSWORD}';
GRANT SELECT, INSERT, UPDATE, DELETE ON telegraph.* TO 'app'@'%';
