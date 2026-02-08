# 🚀 Progetto GPO – Setup & Workflow di Sviluppo

> ⚠️ **Leggi tutto prima di toccare qualsiasi cosa.**

> Questa guida serve a configurare l’ambiente **senza distruggere il server di produzione**.

---

## 🧠 Prerequisiti rapidi

Prima di iniziare assicurati di avere:

* Git installato
* Un terminale decente (PowerShell, CMD, Git Bash, quello che vuoi)

---

## 🛠️ 1. Installazione Node.js (v20 – obbligatoria)

Usiamo NVM Manager per installare l'ultima versione di Node.js e Next.js

### 🪟 Windows

1. Scarica `nvm-setup.exe` da qui:
   👉 [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. Installa NVM e apri il terminale Powershell.
3. Chiudi e riapri il terminale
4. Esegui:

```bash
nvm install 20
nvm use 20
```

✅ **Verifica**

```bash
node -v
```

Deve uscire qualcosa tipo: v20.x.x

Se no → stop, non andare avanti.

---

## 📂 2. Inizializzazione del Progetto

### 2.1 Clona il repository

```bash
git clone https://github.com/Fezze07/ProgettoGPOI
cd ProgettoGPOI
```
> Per praticità consiglio di spostare i file dentro la cartella ProgettoGPOI nella cartella stessa creata da te
---

### 2.2 Setup Variabili d’Ambiente (.env)

Questo serve per lavorare **in locale**, senza toccare produzione.

* Crea un file nella cartella del progetto e rinominalo **.env**
* Inserisci questi parametri:

```
BACKEND_PORT=5002
FRONTEND_PORT=5003
NEXT_PUBLIC_BACKEND_URL=http://localhost:5002
```

---
Fai **DUE COPIE IDENTICHE** del file:

* 📁 `/Backend/.env`
* 📁 `/Frontend/.env`

## 💻 3. Sviluppo Locale

### 3.1 Crea un branch per la tua modifica

1. Apri il tuo editor di codice, come **Visual Studio Code**.
2. Dentro l'editor apri il **terminale**.
3. Digita questo comando per creare il tuo branch personale:

```bash
git checkout -b nome-tua-modifica
```

---

### 3.2 Avvia il Backend e il Frontend da terminale in locale
### IMPORTANTE: NON chiudere NESSUNA finestra del terminale una volta fatto partire il server

```bash
cd Backend
npm install
npm run dev
```
Apri **UN ALTRO TERMINALE** (importante 👀):

```bash
cd Frontend
npm install
npm run dev
```


📡 Backend e Frontend saranno attivi su:

```
BACKEND -> http://localhost:5002
FRONTEND -> http://localhost:5003 -> Clicca qui per vedere l'app
```

---

## 📤 4. Come Salvare le Modifiche

### 4.1 Salva le modifiche
Aggiungi un commento a quello che si è fatto
```bash
git commit -m "Descrizione"
```

> Se è il primo commit bisogna inserire anche l'email e il nome dell'utente:
```bash
git config --global user.email = "email@gmai.com"
git config --global user.name = "nome"
```

Questo modificherà l'origine creata da te (i file online)

```bash
git push origin nome-tua-modifica
```

---

### 4.2 Pull Request

Per mandare i file in produzione bisogna creare una **Pull Request**

1. Vai su GitHub
2. Apri una **Pull Request** verso `main`
3. Il codice verrà revisionato
4. Se approvato → merge
5. 🚀 Il server si aggiorna **automaticamente**

Tu non devi fare altro.

---

## 🚫 Regole d’Oro

* ❌ **NON lavorare MAI sul branch `main`**
  * Crea un branch solo per te
  * Usalo fino a quando non viene completato il merge
* 🔄 Prima di lavorare:

  ```bash
  git pull origin main
  ```
* 🧹 **NON** pushare:

  * `node_modules/`
  * `.next/`
    *(sono già nel `.gitignore`, se li vedi pushati → qualcosa non va)*