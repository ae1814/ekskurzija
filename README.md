# Ekskurzija

Repozitorij Ekskurzija vsebuje datoteke za spletno aplikacijo. Mapa /ekskurzija-frontend vsebuje Angular frontend aplikacijo. Mapa /ekskurzija-backend vsebuje NodeJS backend (server) aplikacijo. V mapi /mysql se nahaja skripta za vzpostavitev sql sheme v mysql okolju. 
V naslednjih sekcijah so po vrsti opisani koraki, kako zagnati vse dele aplikacije (ključni koraki so oštevilčeni).

## Kopiranje repozitorija
1. `Fork` repository
<br />
Naveden primer opisuje navodila za namestitev preko terminala (konzole), za kar potrebujete veljaven `git` ukaz. Druge možnosti so na primer kloniranje repozitorija preko GitHub desktop aplikacije. 
<br />
V terminalu (Windows uporabniki - `gitforwindows.org`) se postavite v direktorij, kjer želite namestiti aplikacijo (<curr_dir>). Ukaz v terminalu (pazi na spremembo <your_username>):
<br />
2. git clone https://github.com/<your_username>/ekskurzija.git

## MySql

Aplikacija uporablja MySql sistem za shranjevanje podatkov. Prvi korak je inštalacija in priprava MySql Serverja:
<br />
3. Naloži iz spletne strani `https://dev.mysql.com/downloads/mysql/` ter sledi navodilom inštalacije
<br />
Za vzpostavitev nove povezave ter opravljanje z samo bazo bomo uporabljali aplikacijo `MySQL Workbench`:
<br />
4. Naloži `MySQL Workbench` iz strani `https://dev.mysql.com/downloads/workbench/`
<br />
5. Dodaj novo povezavo (MySql Connections +), ter dopolni/popravi vnosna polja glede na spodnjo sliko. Kot vidimo na sliki je `Username = root`, `Password = root2021`, `Hostname = 127.0.0.1`, `Port = 3306`. Če želite katero od navedenih vrednosti spremeniti, je potrebno spremeniti tudi `.env` datoteko (polja DB_HOST za Hostname, DB_USER za Username, DB_PORT za Port ter DB_PASS za Password).![Image not found!](./general_images/mysql.png?raw=true "MySqlConnection")
<br />

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
