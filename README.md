# Ekskurzija

Repozitorij Ekskurzija vsebuje datoteke za spletno aplikacijo. Mapa /ekskurzija-frontend vsebuje Angular frontend aplikacijo. Mapa /ekskurzija-backend vsebuje NodeJS backend (server) aplikacijo. V mapi /mysql se nahaja skripta za vzpostavitev sql sheme v mysql okolju. 
V naslednjih sekcijah so po vrsti opisani koraki, kako zagnati vse dele aplikacije (ključni koraki so oštevilčeni).

## Kopiranje repozitorija
`1. Fork repository`
<br />
Naveden primer opisuje navodila za namestitev preko terminala (konzole), za kar potrebujete veljaven git ukaz. Druge možnosti so na primer kloniranje repozitorija preko GitHub desktop aplikacije. 
<br />
V terminalu (Windows uporabniki - gitforwindows.org) se postavite v direktorij, kjer želite namestiti aplikacijo (%curr_dir%). Ukaz v terminalu (pazi na spremembo %your_username%):
<br />
`2. git clone https://github.com/%your_username%/ekskurzija.git`

## MySql

Aplikacija uporablja MySql sistem za shranjevanje podatkov. Prvi korak je inštalacija in priprava MySql Serverja:
<br />
`3. Naloži iz spletne strani https://dev.mysql.com/downloads/mysql/ ter sledi navodilom inštalacije`
<br />
Za vzpostavitev nove povezave ter opravljanje z samo bazo bomo uporabljali aplikacijo MySQL Workbench:
<br />
`4. Naloži MySQL Workbench iz strani https://dev.mysql.com/downloads/workbench/`
<br />
`5. Dodaj novo povezavo (MySql Connections +), ter dopolni/popravi vnosna polja glede na spodnjo sliko. Kot vidimo na sliki je Username = root, Password = root2021, Hostname = 127.0.0.1, Port = 3306. Če želite katero od navedenih vrednosti spremeniti, je potrebno spremeniti tudi ./ekskurzija_backend/.env datoteko (polja DB_HOST za Hostname, DB_USER za Username, DB_PORT za Port ter DB_PASS za Password).`![Image not found!](./general_images/mysql.png?raw=true "MySqlConnection")
<br />
Ko imamo pripravljeno povezavo do MySql serverja, moramo dodati shemo, ki se nahaja v mysql mapi (./mysql/db_schema.sql). V MySql Workbench okolju:
<br />
`6. Poiščemo Data Import opcijo (Levo -> Administration/Management ali Zgoraj -> Server/Data Import)`
<br />
`7. Izpolnimo polja, kot kaže spodnja slika.`![Image not found!](./general_images/mysql_import.png?raw=true "MySqlConnection")
<br />
Baza je sedaj pripravljena za shranjevanje!

## Build in Zagon BACKEND dela aplikacije
Za uspešno vzpostavitev backend NodeJS okolja je potrebno namestiti NodeJS paket:
<br />
`8. Namestitev NodeJS preko spletne strani https://nodejs.org/en/download/`. 
<br />
Po uspešni namestitvi pridobimo potrebna ukaza - npm in node!
<br />
Preden se posvetimo pogonu aplikacije, moramo naložiti še 2 paketa:
<br />
`10. npm install --global yarn`
`11. npm install pm2 -g`
Naslednji korak je namestitev potrebnih knjižnic in modulov. Nadaljna navodila predvidevajo, da ste v terminalu (konzoli) trenutno v direktoriju `ekskurzija`:
<br />
`9. cd ekskurzija_backend'
`10. npm install`
`9. `

## Build in Zagon FRONTEND dela aplikacije

