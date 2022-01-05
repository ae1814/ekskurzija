# Ekskurzija

Repozitorij Ekskurzija vsebuje datoteke za spletno aplikacijo. Mapa /ekskurzija-frontend vsebuje Angular frontend aplikacijo. Mapa /ekskurzija-backend vsebuje NodeJS backend (server) aplikacijo. V mapi /mysql se nahaja skripta za vzpostavitev sql sheme v mysql okolju. 
V naslednjih sekcijah so po vrsti opisani koraki, kako zagnati vse dele aplikacije (ključni koraki so oštevilčeni).

## Kopiranje repozitorija
<br /><br />
Naveden primer opisuje navodila za namestitev preko terminala (konzole), za kar potrebujete veljaven git ukaz. Druge možnosti so na primer kloniranje repozitorija preko GitHub desktop aplikacije. 
<br /><br />
V terminalu (Windows uporabniki - gitforwindows.org) se postavite v direktorij, kjer želite namestiti aplikacijo. Ukaz v terminalu (pazi na spremembo %your_username%):
<br /><br />
`2. local_directory> git clone https://github.com/%your_username%/ekskurzija.git`

## MySql

Aplikacija uporablja MySql bazo za shranjevanje podatkov. Prvi korak je inštalacija in priprava MySql Serverja:
<br /><br />
`3. Naloži iz spletne strani https://dev.mysql.com/downloads/mysql/ ter sledi navodilom inštalacije.` -> Za izbiro root passworda si preberite točko 5.
<br /><br />
Za vzpostavitev nove povezave ter opravljanje z samo bazo bomo uporabljali aplikacijo MySQL Workbench:
<br /><br />
`4. Naloži (če je prejšnji korak ni) MySQL Workbench iz strani https://dev.mysql.com/downloads/workbench/`.
<br /><br />
`5. (Točka 3 ponavadi vsebuje pripravo povezavo, če ne, sledite navodilom) Dodaj novo povezavo (MySql Connections +), ter dopolni/popravi vnosna polja glede na spodnjo sliko. Kot vidimo na sliki je Username = root, Password = root2021, Hostname = 127.0.0.1, Port = 3306. Če želite katero od navedenih vrednosti spremeniti, je potrebno spremeniti tudi ./ekskurzija_backend/.env datoteko (polja DB_HOST za Hostname, DB_USER za Username, DB_PORT za Port ter DB_PASS za Password).`![Image not found!](./general_images/mysql.png?raw=true "MySqlConnection")
<br /><br />
Ko imamo pripravljeno povezavo do MySql serverja, moramo dodati shemo, ki se nahaja v mysql mapi (./mysql/db_schema.sql). V MySql Workbench okolju:
<br /><br />
`6. Poiščemo Data Import opcijo (Levo -> Administration/Management ali Zgoraj -> Server/Data Import)`.
<br /><br />
`7. Izpolnimo polja, kot kaže spodnja slika.`![Image not found!](./general_images/mysql_import.png?raw=true "MySqlConnection")
<br /><br />
Baza je sedaj pripravljena za shranjevanje!

## Build in Zagon BACKEND dela aplikacije
Za uspešno vzpostavitev backend NodeJS okolja je potrebno namestiti NodeJS paket:
<br /><br />
`8. Namestitev NodeJS preko spletne strani https://nodejs.org/en/download/`. 
<br /><br />
Po uspešni namestitvi pridobimo potrebna ukaza - npm in node. Potrditev uspešne namestitve -  ukaza `npm -v` ter `node -v` vrneta trenutno verzijo!
<br /><br />
Naslednji korak je namestitev potrebnih knjižnic in modulov. Nadaljna navodila predvidevajo, da ste v terminalu (konzoli) trenutno v direktoriju `ekskurzija`:
<br /><br />
`9. local_directory\ekskurzija> cd ekskurzija_backend`
<br /><br />
`10. local_directory\ekskurzija> npm install --global yarn`
<br /><br />
`11. local_directory\ekskurzija> npm install --global pm2`
<br /><br />
`12. local_directory\ekskurzija\ekskurzija_backend> npm install`
<br /><br />
`13. local_directory\ekskurzija\ekskurzija_backend> "./node_modules/.bin/pm2" install typescript`
<br /><br />
`14. local_directory\ekskurzija\ekskurzija_backend> yarn serve`
<br /><br />
Backend aplikacija bi sedaj morala delovati (ukaz `yarn log` izpiše trenutne zapise aplikacije (strežnika), če je zadnja izpisana vrstica `Server listening on port 5201!` se je strežnik pravilno zagnal). Na določenih sistemih pm2 rad nagaja, če pride do težav pri zagonu aplikacije, ponovimo točko 11 - 14! 
<br /><br />
Nastavitve okolja strežnika (razvojno, ...) ter nastavitve naslova preko katerega je strežnik dostopen, se nahajajo v datoteki ./ekskurzija_backend/.env. Spremenljivka NODE_ENV=dev shranjuje trenutno okolje (trenutno je razvojno),  NODE_PORT=5201 specificira trenutna vrata skozi katera je strežnik dostopen (nastavljen na 5201), NODE_HOST=0.0.0.0 pa trenutni naslov (nastavljen na 0.0.0.0 - localhost). Glede na trenutne nastavitve, je strežnik dostopen na naslovu `http://0.0.0.0:5201`. V primeru spremembe naslova ali porta, je potrebna sprememba spremenljivke `apiUrl` v datoteki ./ekskurzija_frontend/src/environments/environment.ts.
<br />
Ostali ukazi (stop, delete, list trenutne instance serverja):
<br />
`15. local_directory\ekskurzija\ekskurzija_backend>  yarn stop`  -> Ustavi trenutno zagnane strežnike
<br />
`16. local_directory\ekskurzija\ekskurzija_backend>  yarn delete`  -> Izbriše trenutno zagnane strežnike
<br />
`17. local_directory\ekskurzija\ekskurzija_backend>  yarn log`  -> Prikaže izpise (loge) strežnika
<br />
`18. local_directory\ekskurzija\ekskurzija_backend>  yarn list-all`  -> Izpiše trenutno zagnane strežnike

## Build in Zagon FRONTEND dela aplikacije

Za potrebe frontend aplikacije, odprimo ločen terminal (postavljen v direktorij ekskurzija) ter izvedimo naslednje ukaze:
<br /><br />
`19. local_directory\ekskurzija> cd ekskurzija_frontend`
<br /><br />
`20. local_directory\ekskurzija\ekskurzija_frontend> npm install`
<br /><br />
`21. local_directory\ekskurzija\ekskurzija_frontend> npm install -g @angular/cli`
<br /><br />
`22. local_directory\ekskurzija\ekskurzija_frontend> ng serve`
<br /><br />
Sedaj imamo vse tri komponente (sql, backend, frontend) vzpostavljene in zagnane. Privzet naslov frontend komponente se nahaja na naslovu `http://localhost:4200`. Če nam angular avtomatsko ponudi drug naslov (IP ali port), je za dostop do zalednega (backend) dela potrebna posodobitev datoteke ./ekskurzija_backend/.env.NodeJS backend strežnik ima omejen dostop - do njega lahko dostopajo le frontend aplikacije z izvornimi naslovi, ki so zapisani v ./ekskurzija_backend/.env datoteki pod spremenljivko ALLOWED_ORIGIN (ALLOWED_ORIGIN=http://localhost:4200). Če se frontend aplikacija prestavi na drug naslov ali dostopa preko drugega porta, je potrebno pravilno popraviti ALLOWED_ORIGIN spremenljivko.

