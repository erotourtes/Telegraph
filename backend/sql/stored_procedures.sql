-- -----------
-- CREATE CHAT 
-- -----------
USE `telegraph`;
DROP procedure IF EXISTS `CREATE_CHAT`;

DELIMITER $$
USE `telegraph`$$
CREATE PROCEDURE `CREATE_CHAT` (
	user_id1 INT,
    username1 VARCHAR(45),
    username2 VARCHAR(45)
)
BEGIN
	DECLARE user_id2 INT;
    
    SELECT user_id INTO user_id2
    FROM telegraph.users
    WHERE username = username2;
    
    INSERT INTO telegraph.chats (
		name,
		user_id1,
		user_id2
	) VALUES (CONCAT(username1, "-", username2  ), user_id1, user_id2);
    
END$$

DELIMITER ;

GRANT EXECUTE ON PROCEDURE telegraph.CREATE_CHAT TO 'app'@'localhost';
