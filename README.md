# 🚀 Progetto GPOI – Guida per Iniziare (Setup & Sviluppo)

Benvenuto nel progetto! Questa guida è scritta apposta per aiutarti a configurare il tuo computer e iniziare a programmare senza stress e senza il rischio di fare danni sul server principale (quello di "produzione"). 

> ⚠️ **IMPORTANTE: Leggi tutto con calma prima di iniziare a fare qualsiasi cosa.**

---

## 🎒 Cosa ti serve prima di iniziare (Prerequisiti)

Assicurati di avere installato sul tuo computer:
1. **[Git](https://git-scm.com/downloads)**: Ci serve per scaricare il codice e salvare le tue modifiche.
2. Un **Terminale**: Puoi usare PowerShell, il Prompt dei Comandi (CMD), Git Bash, oppure quello integrato in Visual Studio Code.

---

## 🛠️ 1. Installare Node.js (Versione 20)

Node.js è il motore che fa girare il nostro progetto. Per installarlo correttamente, useremo un programma chiamato **NVM** (Node Version Manager).

### Windows:
1. Vai a questa pagina web e scarica il file `nvm-setup.exe`: 👉 [Scarica NVM per Windows](https://github.com/coreybutler/nvm-windows/releases)
2. Apri il file scaricato e segui l'installazione normale (clicca sempre "Avanti").
3. Apri il tuo **Terminale** (per esempio, PowerShell).
4. Scrivi questi due comandi (premi Invio dopo aver scritto ciascuna riga):

```bash
nvm install 20
nvm use 20.20.2
```

> **Fatto!** Ora il tuo computer è pronto per far girare il progetto.

---

## 📂 2. Scaricare il Progetto

Ora dobbiamo prendere il codice da Internet e metterlo nel tuo computer.

1. Crea una cartella vuota nel tuo computer dove vuoi salvare il progetto (ad esempio, sul Desktop o nei Documenti).
2. Apri il **Terminale** e naviga fino a quella cartella (usando il comando `cd`), oppure fai clic col tasto destro dentro la cartella e apri il terminale lì.
3. Scrivi questo comando per scaricare il codice:

```bash
git clone https://github.com/Fezze07/ProgettoGPOI
```
4. Ora entra nella cartella appena creata del progetto:
```bash
cd ProgettoGPOI
```

---

## ⚙️ 3. Configurazione per lavorare sul tuo PC (.env)

Il progetto ha bisogno di alcune "istruzioni segrete" per funzionare sul tuo computer senza andare a toccare la versione online. Lo facciamo usando i file di configurazione chiamati `.env`.

Devi creare **due file** di testo chiamati esattamente `.env`. 

**Cosa devi scriverci dentro?** In entrambi i file, copia e incolla esattamente questo testo:
```env
BACKEND_PORT=5002
FRONTEND_PORT=5003
NEXT_PUBLIC_BACKEND_URL=http://localhost:5002
```

**Dove devi mettere questi due file appena creati?**
1. Metti il primo file dentro la cartella `Backend`: diventerà 📁 `ProgettoGPOI/Backend/.env`
2. Metti il secondo file dentro la cartella `Frontend`: diventerà 📁 `ProgettoGPOI/Frontend/.env`

---

## 💻 4. Iniziamo a lavorare! (Sviluppo in locale)

### 4.1 Crea il tuo spazio di lavoro personale (Branch)
Non lavorare mai direttamente sul codice principale! Crea sempre una "copia isolata e sicura" (chiamata branch) solo per la tua modifica:

1. Apri **Visual Studio Code**.
2. Dal menu File, fai "Apri Cartella..." e scegli la cartella `ProgettoGPOI`.
3. Apri il terminale integrato in VS Code (dal menu in alto: `Terminale` -> `Nuovo terminale`).
4. Scrivi questo comando per creare la tua stanza di lavoro (cambia "nome-della-tua-modifica" con qualcosa che descriva cosa farai, es: `modifica-colore-bottone`):

```bash
git checkout -b nome-della-tua-modifica
```

### 4.2 Avvio del Backend e del Frontend
Per vedere il sito funzionante sul tuo computer, devi far partire sia il "motore nascosto" (Backend) sia quello che si vede e con cui si interagisce (Frontend).

**Attenzione:** Una volta avviati questi comandi, **non chiudere i terminali**, altrimenti il sito si fermerà!

**Passo A: Avvia il Backend**
Nel terminale di VS Code scrivi:
```bash
cd Backend
npm install
npm run dev
```

**Passo B: Avvia il Frontend**
1. Apri un **nuovo terminale** a lato del primo (c'è un tastino `+` in alto a destra nel pannello del terminale di VS Code).
2. Nel nuovo terminale appena aperto scrivi:
```bash
cd Frontend
npm install
npm run dev
```

🎉 **Finito!** Ora aspetta qualche secondo che si carichi tutto, apri il tuo browser preferito (Chrome, Edge, ecc.) e vai a questo indirizzo:
👉 [http://localhost:5003](http://localhost:5003)

---

## 📤 5. Come salvare e condividere il tuo fantastico lavoro

Quando hai finito di fare delle modifiche, le hai testate nel tuo browser e tutto funziona perfettamente, devi salvare il tuo lavoro online condividerlo.

### 5.1 Prepara e salva i tuoi file
Apri il terminale in VS Code e scrivi in ordine:

1. Aggiungi tutte le tue nuove modifiche in blocco:
```bash
git add .
```

2. Associa queste modifiche a un messaggio che spiega **cosa** hai cambiato:
```bash
git config --global user.email = "email@gmai.com"
git config --global user.name = "nome"
```
*(Nota: se è la primissima volta in assoluto che usi Git sul tuo pc, ti darà un errore e ti chiederà di "presentarti" inserendo la tua email e il tuo nome. Segui le istruzioni che ti suggerisce a schermo).*

3. Carica finalmente il tuo pacchetto di lavoro su Internet:
```bash
git push origin nome-della-tua-modifica
```

### 5.2 Unire il tuo lavoro a quello di tutti (Pull Request)
Ora che il tuo lavoro è online, devi chiedere agli amministratori del progetto di approvarlo e unirlo al progetto principale.

1. Vai sulla pagina GitHub del progetto: [https://github.com/Fezze07/ProgettoGPOI](https://github.com/Fezze07/ProgettoGPOI)
2. Vedrai in alto un grosso pulsante verde che dice **"Compare & pull request"**. Cliccalo!
3. Scrivi un titolo chiaro e poi clicca in fondo su **"Create pull request"**.
4. Ottimo lavoro! Ora il tuo codice verrà controllato. Se va bene, verrà unito al progetto principale e lo vedranno tutti! 🚀

---

## 🚫 3 Regole d'Oro da NON dimenticare mai!

* ❌ **1. NON lavorare MAI direttamente sul codice condiviso (chiamato branch `main`)**. Crea sempre il tuo branch personale con `git checkout -b`.
* 🔄 **2. Aggiorna sempre il tuo computer** prima di iniziare a lavorare un nuovo giorno, per avere l'ultima versione del lavoro di tutti gli altri:
  ```bash
  git checkout main
  git pull origin main
  ```
* 🧹 **3. Non caricare mai cartelle pesanti di sistema**: Fai attenzione a non caricare mai online (fare push) le cartelle `node_modules/` o `.next/`. Normalmente il sistema le ignora in automatico, ma se le vedi su GitHub c'è un piccolo problema!