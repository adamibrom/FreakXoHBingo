# Symfony 2

Das Frontend (die Spiele), der Adminbereich werden von Symfony erzeugt. Das Backend des Spiele wird über eine REST API angesprochen.

## Installation

Eine genau [Installationsanleitung](INSTALL.md) ist unter [INSTALL.md](INSTALL.md) zu finden.

Im ersten Schritt der Projekt klonen:

    git clone git@github.com:bassix/FreakXoHBingo.git
    cd FreakXoHBingo
    
Composer Bundles installieren:

    php composer.phar install

Von nun an kann die App ausgeführt werden.

### Externe Bundles

Die wichtisten Pakete in einer kurzen Übersicht:

* **PHPUnit** in der 5er Version zum Ausführen von Tests.
* **[Symfony 2.7](https://symfony.com/)** als Framework zum erzeugen von Seiten.
* **[Propel 2](http://propelorm.org/)** als Datenbankabstraktionsschicht und für die Schema Versionierung.
* **FOS Rest** ein Bundle, das eine Rest Full API erzeugt.

_Unter **[Erstinstallation](erstinstallation)** ist beschrieben wie ein neues Projekt aufgesetzt wurde._

### Grundstruktur

Alle Routen werden über annotations (```@Route``` und ```@Method```) konfiguriert. Die Route ist somit im Doc-Block der Controller-Methode definiert.

## Arbeiten mit Symfony

Die wichtigsten Kommandos für das Arbeiten mit Symfony und mit Assetic sind im ```./assets.sh``` Script zusammengefasst. Die im Folgenden beschriebenen Befehle werden dabei ausgeführt.

### Symfony Cache

Den Produktions-Cache neu aufbauen:

    app/console cache:clear --env=prod --no-debug

Den Cache für die Entwicklungs-Umgebung aufbauen:

    app/console cache:clear --env=dev

### Symfony Assetic

Die Assets für die Live-Umgebung aufbauen:

    app/console assetic:dump --env=prod

Die Assets für die Entwicklungs-Umgebung aufbauen:

    app/console assets:install --env=dev --symlink

## Propel

[Propel](http://propelorm.org/) ist eine Datenbank Abstractions Schicht (ORM) zum Beschleunigen der Entwicklung von Lese und Schreibzugriffen auf die Datenbank.

* Konfiguriert wird Propel über die ```app/config/propel.yml```
* Im Bundle liegt eine Schema-Beschreibung der Tabellen: ```src/BingoBundle/Resources/config/propel/schema.xml```
* Mit Propel werden Basis Models und Klassen mit Methoden zum Handhaben von Daten mit ```app/console propel:build```
* Der Generierte Code wird abgelegt in: ```src/BingoBundle/Propel```

Die wichtigsten Kommandos:

* ```app/console propel:database:create``` Erstellen der Datenbank (Vorausgesetzt, der User hat die nötigen Rechte ;) ).
* ```app/console propel:build``` Bauen des SQL Schema und der Propel Klassen. Alternative ```app/console propel:sql:build``` um das SQL zu erzeugen und ```app/console propel:model:build``` Model Klassen zu generieren.
* ```app/console propel:sql:insert``` Das erzeuge Tabellen Schema SQL in die Datenbank schreiben.

Anpassungen im Scheme und Migrationen:

* ```app/console propel:migration:status``` Den Status der Migrations abfragen.
* ```app/console propel:migration:up``` Die Aufwerts Migration ausführen.
* ```app/console propel:migration:down``` Migrationen zurücknehmen.
* ```app/console propel:migration:diff``` **Wichtig!** Wird das Schema angepasst, dann muss ein Migrationsscript erzeugt werden, damit die Tabellen auf das neue Schmea migriert werden können. **Achtung!** Das Script hat so seine Probleme mit Groß- und Kleinschreibung! Daher immer vor dem Commiten des Migrationsscript dieses vorher prüfen! _Speicherort: ```app/propel/migrations```_

**Achtung!** Workaround auf Grund eines Bugs: ```app/console propel:build``` klappt nicht, wenn ```app/propel/sql/sqldb.map``` bereits exitiert!

    rm app/propel/sql/sqldb.map
    app/console propel:build

Wenn der Bug behoben ist, dann sollte ```app/console propel:build --overwrite``` klappen.

## <a name="erstinstallation"></a>Erstinstallation

Einige Befehle werden nur einmal beim ersten Aufsetzen eines Projekts ausgeführt. Hier also nur zu Dokummentationszwecken ;) 

Open your command console and execute the following commands:

```
sudo curl -LsS http://symfony.com/installer -o /usr/local/bin/symfony
sudo chmod a+x /usr/local/bin/symfony
```

Projekt mit Symfony erstellen:

```
symfony new reporting 2.7
```

Unsere Variante, Projekt mit Composer erstellen:

```
./composer.phar create-project symfony/framework-standard-edition reporting "2.7.*" 
```

Nach dem das Projekt erstellt wurde kann es konfiguriert werden.

## Neues Bundle erstellen

Es gibt mehrere Bundles, die bnötigt werden und die ersteinmal angelegt werden müssen:

* **BaseBundle** 
    app/console generate:bundle --namespace=BaseBundle
* **BingoBundle**
    app/console generate:bundle --namespace=BingoBundle

Anschließend stehen die Bundles zur Verfügung.

