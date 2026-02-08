# 🚀 Progetto GPO – Setup & Workflow di Sviluppo

> ⚠️ **Leggi tutto prima di toccare qualsiasi cosa.**
> Questa guida serve a configurare l’ambiente **senza distruggere il server di produzione**.

---

## 🧠 Prerequisiti rapidi

Prima di iniziare assicurati di avere:

* Git installato
* Un terminale decente (PowerShell, CMD, Git Bash, quello che vuoi)
* Minima familiarità con i comandi base (`cd`, `npm`, `git`)

---

## 🛠️ 1. Installazione Node.js (v20 – obbligatoria)

Per evitare drammi tra versioni diverse di Node, **usiamo NVM** (Node Version Manager).

### 🪟 Windows

1. Scarica `nvm-setup.exe` da qui:
   👉 [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. Installa NVM e apri il terminale Powershell.
3. Esegui:

```bash
nvm install 20
nvm use 20
```

✅ **Verifica**

```bash
node -v
```

Deve uscire qualcosa tipo:

```
v20.x.x
```

Se no → stop, non andare avanti.

---

## 📂 2. Inizializzazione del Progetto

### 2.1 Clona il repository

```bash
git clone https://github.com/Fezze07/ProgettoGPOI
cd ProgettoGPOI
```

---

### 2.2 Setup Variabili d’Ambiente (.env)

📩 Chiedi a **Federico** il file `.env`.

Fai **DUE COPIE IDENTICHE** del file:

* 📁 `/Backend/.env`
* 📁 `/Frontend/.env`

#### ⚙️ Configurazione locale (Frontend)

Nel file `.env` del **Frontend**, assicurati che ci sia:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5002
```

Questo serve per lavorare **in locale**, senza toccare produzione.

---

## 💻 3. Sviluppo Locale (aka: come non fare disastri)

### 🛑 REGOLA SUPREMA

❌ **NON lavorare MAI sul branch `main`**

---

### 3.1 Crea un branch per la tua modifica

```bash
git checkout -b nome-tua-modifica
```

Esempi decenti:

* `fix-login`
* `feature-dashboard`
* `refactor-api-users`

---

### 3.2 Avvia il Backend da terminale
### IMPORTANTE = NON chiudere NESSUNA finestra del terminale una volta fatto partire il server

```bash
cd Backend
npm install
npm run dev
```

📡 Backend attivo su:

```
http://localhost:5002 (il terminale si riavvierà da solo ad ogni salvataggio)
```

---

### 3.3 Avvia il Frontend da terminale

Apri **UN ALTRO TERMINALE** (importante 👀):

```bash
cd Frontend
npm install
npm run dev
```

🌐 Frontend attivo su:

```
http://localhost:5003
```

Se vedi la web app → stai vincendo.

---

## 📤 4. Caricare le Modifiche (modo civile)

Quando su `localhost:5003` **funziona tutto**:

### 4.1 Salva le modifiche

```bash
git add .
git commit -m "Descrizione chiara e sensata di quello che hai fatto"
```

❌ NO commit tipo:

* `fix`
* `update`
* `boh`

---

### 4.2 Push del branch

```bash
git push origin nome-tua-modifica
```

---

### 4.3 Pull Request

1. Vai su GitHub
2. Apri una **Pull Request** verso `main`
3. Il codice verrà revisionato
4. Se approvato → merge
5. 🚀 Il server si aggiorna **automaticamente**

Tu non devi fare altro.

---

## 🚫 Regole d’Oro (non opzionali)

* 🔒 **MAI** pushare il file `.env`
* 🔄 Prima di lavorare:

  ```bash
  git pull origin main
  ```
* 🧹 **NON** pushare:

  * `node_modules/`
  * `.next/`
    *(sono già nel `.gitignore`, se li vedi pushati → qualcosa non va)*

---

## 🧯 In caso di dubbi

👉 **Chiedi prima di fare danni.**
Meglio una domanda in più che un rollback in produzione.

Happy coding ✨