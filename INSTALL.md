# Installation

Bevor das Projekt installiert werden kann sollte der Server vorbereit werden. Siehe hierzu: [Server Installation](SERVER.md)

_**Hinweis:** In dieser Anleitung gehen wir davon aus, dass das Projekt unter ```/var/www``` installiert wird. Zu diesem Zweck vorher zum www-data User werden:_

    su - www-data

Wenn kein Login als www-data erlaubt ist, dann:

    su -s /bin/bash www-data

Im ersten Schritt der Projekt klonen:

    cd /var/www
    git clone git@github.com:bassix/FreakXoHBingo.git
    cd FreakXoHBingo

Ist der Code von Github lokal verfügbar, das Installationsscript Ausführen um die Composer Pakete zu installieren:

    ./composer.sh i

Von Symfony wird ein Dialog gestartet in dem dann die bei der [Server Installation](SERVER.md) (Datenbank User und Password) eingegebene Daten eingetragen werden.

_**Hinweis:** Ist bei der Konfiguration etwas schief gelaufen, dann kann die Installation auch manuel erstellt werden. Hier zu die ```app/config/parameters.yml.dist``` in  ```app/config/parameters.yml``` kopieren und bearbeiten._

    cp app/config/parameters.yml.dist app/config/parameters.yml
    
Nun kann die Konfiguration bearbeitet werden:

    nano app/config/parameters.yml
