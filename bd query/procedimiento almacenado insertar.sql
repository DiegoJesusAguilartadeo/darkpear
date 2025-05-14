DROP PROCEDURE IF EXISTS tragaperas_registrar;

DELIMITER //

CREATE PROCEDURE tragaperas_registrar(
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_birthdate DATE
)
BEGIN
    INSERT INTO usuarios (username, password, birthdate)
    VALUES (p_username, p_password, p_birthdate);
END //

DELIMITER ;

