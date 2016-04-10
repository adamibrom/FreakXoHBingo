# MySQL

Gängige Queries und Befehle...

## Datenbank und User erstellen

Als **ROOT** User mit MySQL verbinden:

    mysql -uroot -p

Datenbank und User erstellen:

    CREATE DATABASE bingo CHARACTER SET utf8 COLLATE utf8_bin;
    CREATE USER 'bingo'@'%' IDENTIFIED BY 'qwer1234';
    GRANT ALL PRIVILEGES ON bingo.* TO 'bingo'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;

Nun kann die App mit der Datenbank verbunden werden!

### Passwort ändern

Wieder als **root** User verbinden und folgenden String ausführen:

    UPDATE USER SET password=PASSWORD('qwer1234') WHERE User='bingo';

### Als Bingo User Verbinden

Als **bingo** User mit Passwort verbinden:

    mysql -h 127.0.0.1 -ubingo -pqwer1234 bingo

## Datenbank Schema schreiben

Hierfür kann Propel verwendet werden:

    app/console propel:sql:insert

## Eine Sammlung mit nützlichen Queries

Alle Klicks löschen:

    TRUNCATE TABLE `bingo_click`;
    
Bestimmtes Icon bzw. Karte entfernen und aus dem Spiel nehmen (muss neu geklickt werden):

    DELETE FROM bingo_click WHERE card LIKE '2';
