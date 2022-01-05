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

Naslednji korak je namestitev potrebnih knjižnic in modulov. Nadaljna navodila predvidevajo, da ste v terminalu (konzoli) trenutno v direktoriju `ekskurzija`:
<br />
`9. cd ekskurzija_backend'
<br />
`10. npm install`
<br />
`11. yarn serve`
<br />
Backend strežnik bi sedaj moral delovati! V primeru da server ni zagnan in vam je terminal vrnil napako ki se nanaša na pm2 ali yarn, izvedite še naslednja ukaza (oziroma le potreben ukaz):
<br />
`12. npm install --global yarn`
<br />
`13. npm install pm2 -g`
<br />
Po uspešni namestitvi, ponovite korak 11, oziroma korak, kjer se je napaka pojavila.
<br />
Nastavitve okolja strežnika (razvojno, ...) ter nastavitve naslova preko katerega je strežnik dostopen, se nahajajo v datoteki ./ekskurzija_backend/.env. Spremenljivka NODE_ENV=dev shranjuje trenutno okolje (trenutno je razvojno),  NODE_PORT=5201 specificira trenutna vrata skozi katera je strežnik dostopen (nastavljen na 5201), NODE_HOST=0.0.0.0 pa trenutni naslov (nastavljen na 0.0.0.0 - localhost). Glede na trenutne nastavitve, je strežnik dostopen na naslovu `http://0.0.0.0:5201`. V primeru spremembe naslova ali porta, je potrebna sprememba spremenljivke `apiUrl` v datoteki ./ekskurzija_frontend/src/environments/environment.ts.

## Build in Zagon FRONTEND dela aplikacije

Za potrebe frontend aplikacije, odprimo ločen terminal ter izvedimo naslednje ukaze:
<br />
`14. cd local_path/ekskurzija/ekskurzija_frontend  - V terminalu se postavimo v direktorij ekskurzija_frontend`
<br />
`15. npm install`
<br />
`16. ng serve`
<br />
Sedaj imamo vse tri komponente (sql, backend, frontend) vzpostavljene in zagnane. Privzet naslov frontend komponente se nahaja na naslovu `http://localhost:4200`. Če nam angular avtomatsko ponudi drug naslov (IP ali port), je za dostop do zalednega (backend) dela potrebna posodobitev datoteke ./ekskurzija_backend/.env.NodeJS backend strežnik ima omejen dostop - do njega lahko dostopajo le frontend aplikacije z izvornimi naslovi, ki so zapisani v ./ekskurzija_backend/.env datoteki pod spremenljivko ALLOWED_ORIGIN (ALLOWED_ORIGIN=http://localhost:4200). Če se frontend aplikacija prestavi na drug naslov ali dostopa preko drugega porta, je potrebno pravilno popraviti ALLOWED_ORIGIN spremenljivko.
