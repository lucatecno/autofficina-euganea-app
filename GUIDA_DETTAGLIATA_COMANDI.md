# 📖 GUIDA DETTAGLIATA: Cosa Fa Ogni Comando

## 🎯 INDICE
1. Spiegazione dettagliata comandi
2. Perché serve ogni passaggio
3. Cosa succede "dietro le quinte"
4. Cosa può andare storto e come risolverlo

---

## 🔍 COMANDO 1: Verifica Node.js

```bash
node --version
```

### **Cosa fa:**
- Controlla se Node.js è installato sul tuo Mac
- Mostra quale versione hai installato

### **Cosa succede dietro le quinte:**
1. Il sistema cerca il programma "node" nel tuo computer
2. Se lo trova, chiede a Node.js di dire la sua versione
3. Node.js risponde con un numero tipo "v20.11.0"

### **Perché serve:**
Node.js è l'ambiente che permette di eseguire JavaScript sul tuo computer (non solo nel browser). EAS CLI (lo strumento per fare il build) è scritto in JavaScript e ha bisogno di Node.js per funzionare.

### **Possibili risultati:**

**✅ SUCCESSO:**
```
v20.11.0
```
Significa: Node.js versione 20.11.0 è installato → Puoi proseguire!

**❌ ERRORE:**
```
command not found: node
```
Significa: Node.js non è installato → Vai su https://nodejs.org/ e installalo

### **Analogia semplice:**
È come controllare se hai Microsoft Word prima di aprire un documento .docx. Node.js è il "programma" che fa girare gli strumenti Expo.

---

## 🔍 COMANDO 2: Installa EAS CLI

```bash
sudo npm install -g eas-cli
```

### **Spiegazione parola per parola:**

- **`sudo`** = "Super User DO" = Esegui come amministratore
  - Serve perché stiamo installando un programma a livello di sistema
  - Ti chiederà la password del Mac per sicurezza

- **`npm`** = "Node Package Manager" = Il "negozio" di strumenti Node.js
  - È incluso automaticamente quando installi Node.js
  - Serve per scaricare e installare pacchetti/programmi JavaScript

- **`install`** = Installa
  - Dice a npm: "Voglio installare qualcosa"

- **`-g`** = "global" = Installazione globale
  - Significa: installa per TUTTO il computer, non solo per una cartella
  - Così puoi usare il comando `eas` da qualsiasi punto del terminale

- **`eas-cli`** = Il nome del pacchetto da installare
  - "EAS" = Expo Application Services
  - "CLI" = Command Line Interface (interfaccia a riga di comando)
  - È lo strumento ufficiale di Expo per creare build Android/iOS

### **Cosa succede dietro le quinte:**

1. **npm contatta i server di Expo** (registry.npmjs.org)
2. **Scarica eas-cli** e tutte le sue dipendenze (~50-100 MB)
3. **Installa tutto** nella cartella di sistema `/usr/local/bin/` (o simile)
4. **Configura il comando** `eas` per essere disponibile globalmente
5. **Finisce** e ti torna il prompt del terminale

### **Perché serve:**

`eas-cli` è il "telecomando" ufficiale per:
- Creare build Android (.apk o .aab)
- Creare build iOS (.ipa)
- Gestire credenziali (keystore, certificati)
- Inviare build ai server di Expo
- Pubblicare aggiornamenti

### **Tempo richiesto:** 1-2 minuti

### **Possibili problemi:**

**❌ "Permission denied"**
→ **Soluzione:** Hai dimenticato `sudo` all'inizio. Riesegui con `sudo`

**❌ "npm: command not found"**
→ **Soluzione:** Node.js non è installato. Installalo prima.

**❌ Chiede la password**
→ **NORMALE!** Scrivi la password del Mac e premi Enter (non vedrai i caratteri)

### **Analogia semplice:**
È come installare un'app sul Mac. EAS CLI diventa un nuovo "programma" che puoi usare dal Terminale.

---

## 🔍 COMANDO 3: Login su Expo

```bash
eas login
```

### **Cosa fa:**
- Ti fa accedere al tuo account Expo
- Salva le tue credenziali per i prossimi comandi

### **Cosa succede dietro le quinte:**

1. **EAS CLI contatta i server Expo** (expo.dev)
2. **Ti chiede username e password**
3. **Invia le credenziali** ai server Expo (criptate)
4. **Riceve un "token"** (una chiave temporanea di accesso)
5. **Salva il token** sul tuo Mac in una cartella nascosta (~/.expo)
6. **Usa questo token** per tutti i comandi successivi

### **Input richiesti:**

**Email or username:**
```
autofficina-euganea
```

**Password:**
```
Battagliaterme26.
```

### **Perché serve:**

Expo ha bisogno di sapere CHI sta facendo il build per:
- Associare il build al progetto corretto
- Salvare le credenziali Android/iOS nel tuo account
- Darti accesso alla dashboard per scaricare l'APK
- Tracciare i tuoi build (quanti ne hai fatti, quando, ecc.)

### **Sicurezza:**

✅ Il token è salvato solo sul tuo Mac
✅ È criptato
✅ Scade dopo un po' di tempo
✅ Puoi fare logout con `eas logout`

### **Possibili problemi:**

**❌ "Invalid credentials"**
→ Username o password sbagliati. Ricontrolla!

**❌ "Network error"**
→ Problemi di connessione internet. Riprova.

### **Analogia semplice:**
Come fare login su Netflix per vedere i tuoi film. Expo ha bisogno di sapere chi sei per associarti ai tuoi progetti.

---

## 🔍 COMANDO 4: Vai nella cartella del progetto

```bash
cd /percorso/alla/cartella/frontend
```

### **Spiegazione:**

- **`cd`** = "Change Directory" = Cambia cartella
  - È come fare doppio click su una cartella nel Finder
  - Ma lo fai dal Terminale scrivendo il percorso

### **Esempio pratico:**

Se il tuo progetto è in:
```
/Users/luca/Desktop/autofficina-euganea/frontend
```

Devi scrivere:
```bash
cd /Users/luca/Desktop/autofficina-euganea/frontend
```

### **Trucco veloce per Mac:**

1. Scrivi `cd` (con lo spazio dopo)
2. **Trascina la cartella `frontend`** dal Finder nel Terminale
3. Il percorso si compila automaticamente!
4. Premi Enter

### **Come verificare di essere nella cartella giusta:**

Dopo aver fatto `cd`, scrivi:
```bash
ls
```

Dovresti vedere file tipo:
- `app.json`
- `package.json`
- `eas.json`
- cartella `app/`
- cartella `src/`

Se vedi questi file → ✅ Sei nel posto giusto!

### **Perché serve:**

EAS CLI ha bisogno di essere nella cartella del progetto per:
- Leggere i file di configurazione (`app.json`, `eas.json`)
- Capire quale app stai buildando
- Accedere al codice sorgente
- Preparare tutto per l'upload ai server

### **Possibili problemi:**

**❌ "No such file or directory"**
→ Il percorso è sbagliato. Controlla che la cartella esista.

**❌ "Permission denied"**
→ Non hai permessi per accedere a quella cartella.

### **Comandi utili:**

**Vedere dove sei:**
```bash
pwd
```
Mostra il percorso completo della cartella attuale

**Tornare indietro di una cartella:**
```bash
cd ..
```

**Andare nella tua Home:**
```bash
cd ~
```

### **Analogia semplice:**
È come aprire una cartella nel Finder prima di lavorare sui file dentro. Il Terminale ha bisogno di "stare" nella cartella giusta.

---

## 🔍 COMANDO 5: Avvia il Build APK

```bash
eas build --platform android --profile preview
```

### **Spiegazione dettagliata:**

- **`eas build`** = Comando principale per creare un build
  
- **`--platform android`** = Specifica la piattaforma
  - `android` = Crea un APK/AAB per Android
  - (Potresti anche usare `ios` per iPhone)

- **`--profile preview`** = Specifica il "profilo" di build
  - `preview` = Build di anteprima (APK installabile direttamente)
  - `production` = Build per Google Play Store (AAB)
  - `development` = Build per sviluppo locale

### **Cosa succede dietro le quinte (STEP BY STEP):**

#### **FASE 1: Preparazione Locale (sul tuo Mac)**

1. **Legge `app.json`**
   - Nome app: "Autofficina Euganea"
   - Package: "it.autofficina.euganea"
   - Versione: "1.0.0"
   - Icone, splash screen, permessi, ecc.

2. **Legge `eas.json`**
   - Profilo "preview" → buildType: "apk"
   - Configurazioni specifiche per il build

3. **Verifica dipendenze**
   - Controlla `package.json`
   - Verifica che tutte le librerie siano compatibili

4. **Controlla credenziali Android**
   - Cerca il Keystore (certificato per firmare l'app)
   - Se non esiste → TI CHIEDERÀ se vuoi generarlo (qui rispondi Y)

#### **FASE 2: Domande Interattive**

**DOMANDA 1: "Generate a new Android Keystore?"**

**Cosa significa:**
Un "Keystore" è un file speciale che contiene:
- Una chiave privata (come una password segreta)
- Un certificato (come una firma digitale)

Serve per:
- **Firmare** l'app (come firmare un documento)
- **Identificare** te come sviluppatore
- **Aggiornare** l'app in futuro (DEVI usare lo stesso keystore!)

**Cosa rispondere:** `Y` (Yes)

Expo:
- Genera il keystore automaticamente
- Lo salva nel tuo account Expo (cloud)
- Lo userà per firmare questo e tutti i futuri build

**IMPORTANTE:** Il keystore è salvato per sempre nel tuo account Expo. Non lo perderai mai!

---

**DOMANDA 2: "Set up Push Notifications?"**

**Cosa significa:**
Push Notifications sono le notifiche che compaiono sul telefono anche quando l'app è chiusa.

Per configurarle serve:
- Un account Firebase (Google)
- Un file di configurazione speciale
- Più tempo per setup

**Cosa rispondere:** `N` (No per ora)

Puoi configurarle in futuro quando servono. Non sono necessarie per far funzionare l'app base.

#### **FASE 3: Upload ai Server Expo**

5. **Comprime tutto il progetto**
   - Codice sorgente
   - Assets (immagini, icone)
   - Configurazioni
   - Dipendenze (node_modules esclusi)

6. **Upload ai server Expo**
   - Carica il file compresso (~5-50 MB)
   - Mostra una progress bar
   - Può richiedere 1-5 minuti (dipende dalla connessione)

7. **Crea un "Job" di build**
   - I server Expo ricevono la tua richiesta
   - Mettono il build in coda
   - Ti danno un link per seguire il progresso

**Esempio di output:**
```
✔ Uploaded project to EAS servers
Build ID: abc123-def456-ghi789
Build URL: https://expo.dev/accounts/autofficina-euganea/projects/autofficina-euganea/builds/abc123
```

#### **FASE 4: Build sui Server Expo (NON sul tuo Mac!)**

**IMPORTANTE:** Il build NON avviene sul tuo Mac, ma sui server cloud di Expo!

8. **Setup ambiente di build**
   - Avvia una macchina virtuale Ubuntu
   - Installa Android SDK
   - Installa Node.js e dipendenze

9. **Installa dipendenze del progetto**
   - Esegue `npm install` o `yarn install`
   - Scarica tutte le librerie React Native
   - Compila moduli nativi se necessari

10. **Genera assets nativi**
    - Ridimensiona icone per tutte le risoluzioni
    - Genera splash screen
    - Ottimizza immagini

11. **Compila il codice**
    - JavaScript → Bundle ottimizzato
    - React Native → Codice nativo Android
    - Minificazione e ottimizzazione

12. **Firma l'APK**
    - Usa il Keystore generato prima
    - Firma digitalmente l'APK
    - Rende l'app installabile

13. **Carica l'APK sui server Expo**
    - L'APK finito viene salvato
    - Generato un link di download
    - Inviata notifica di completamento

#### **FASE 5: Notifica e Download**

14. **Terminale mostra il risultato**
```
✔ Build finished
APK: https://expo.dev/artifacts/eas/abc123.apk
```

15. **Puoi scaricare l'APK**
    - Dal link diretto
    - Dalla dashboard Expo
    - Tramite email (se configurata)

### **Quanto tempo richiede:**

- Upload progetto: **2-5 minuti**
- Build sui server: **10-15 minuti**
- **TOTALE: 12-20 minuti**

### **Cosa puoi fare mentre aspetti:**

✅ Chiudere il Terminale (il build continua sui server)
✅ Spegnere il Mac (non influisce)
✅ Fare altro
✅ Seguire il progresso sul link web

### **Perché è così lento:**

Il build deve:
- Installare ~500-1000 pacchetti
- Compilare codice nativo Android
- Ottimizzare tutto
- Firmare con certificati crittografici

È come costruire una casa da zero, non una fotocopia!

### **Possibili problemi:**

**❌ "Generating a new Keystore is not supported in --non-interactive mode"**
→ Hai usato flag `--non-interactive` senza keystore. Togli quel flag.

**❌ "Build failed"**
→ Guarda l'errore specifico. Potrebbe essere:
- Dipendenza mancante
- Errore nel codice
- Configurazione sbagliata

**❌ "Project not configured"**
→ Non sei nella cartella giusta, o manca `app.json`

### **Output di successo:**

```
✔ Project validated
✔ Using remote Android credentials  
✔ Uploaded project
✔ Build started
⠋ Building...

✔ Build finished
Platform: Android
Status: finished
Created: 2 minutes ago
ID: abc123-def456

Download: https://expo.dev/artifacts/eas/abc123.apk
```

### **Analogia semplice:**

È come ordinare una pizza a domicilio:
1. Chiami e fai l'ordine (upload progetto)
2. La pizzeria prepara la pizza (build sui server)
3. Il fattorino te la porta (download APK)

Tu non fai la pizza a casa tua, ma in una cucina professionale (server Expo)!

---

## 🎯 RIEPILOGO: Perché Serve Ogni Passo

### **1. Node.js**
È il "motore" che fa girare tutti gli strumenti JavaScript

### **2. EAS CLI**
È il "telecomando" per comunicare con i server Expo

### **3. Login**
Identifica te e il tuo progetto

### **4. cd nella cartella**
Dice a EAS dove trovare il codice dell'app

### **5. eas build**
Avvia tutto il processo di compilazione sui server Expo

---

## 🔐 SICUREZZA E PRIVACY

### **Cosa viene caricato ai server Expo:**
✅ Codice sorgente dell'app
✅ Assets (immagini, icone)
✅ File di configurazione

### **Cosa NON viene caricato:**
❌ File `.env` (variabili ambiente)
❌ File in `.gitignore`
❌ Password o credenziali (se ben configurate)

### **Cosa fa Expo con il tuo codice:**
✅ Lo compila
✅ Lo cancella dopo il build (non viene conservato)
✅ Salva solo l'APK finale

### **Il Keystore:**
✅ È salvato nel tuo account Expo (criptato)
✅ Solo tu puoi accedervi
✅ È necessario per aggiornare l'app in futuro
✅ Expo non può rubare o usare male il tuo keystore

---

## 📚 COMANDI BONUS UTILI

### **Vedere lo stato di un build:**
```bash
eas build:list
```
Mostra tutti i tuoi build (in corso, completati, falliti)

### **Vedere i dettagli di un build:**
```bash
eas build:view [BUILD_ID]
```

### **Cancellare i log locali:**
```bash
eas build:cancel
```

### **Fare logout:**
```bash
eas logout
```

### **Vedere quale account sei:**
```bash
eas whoami
```

---

## 🆘 GUIDA ALLA RISOLUZIONE PROBLEMI

### **Problema: Build fallito**

**Step di debug:**

1. **Guarda l'errore nel Terminale**
2. **Vai sul link del build** (nella dashboard Expo)
3. **Leggi i log completi** (c'è un pulsante "View logs")
4. **Cerca l'errore** (di solito è alla fine)

**Errori comuni:**

**"Cannot find module 'xxx'"**
→ Dipendenza mancante. Aggiungi in `package.json`

**"Build tool version xxx not found"**
→ Versione Android SDK non compatibile. Aggiorna `app.json`

**"Keystore error"**
→ Problema con le credenziali. Rigenera il keystore

**"Out of memory"**
→ Progetto troppo grande. Ottimizza assets

### **Quando chiedere aiuto:**

❌ Hai provato 3 volte e fallisce sempre
❌ L'errore non è chiaro
❌ Non sai come risolvere

✅ Copia l'INTERO log di errore
✅ Mandamelo
✅ Ti aiuto a debuggare!

---

## 💡 TIPS E TRUCCHI

### **Build più veloci:**

✅ Usa `--profile preview` per test (APK)
✅ Usa `--profile production` solo per pubblicare

### **Risparmiare tempo:**

✅ Non chiudere il Terminale durante l'upload
✅ Usa WiFi veloce (non 4G)
✅ Comprimi assets prima (immagini, video)

### **Best practices:**

✅ Testa sempre l'APK prima di pubblicare
✅ Incrementa la versione in `app.json` ad ogni build
✅ Salva il link di ogni build (per riferimento)

---

## 🎓 CONCLUSIONE

**Ora sai esattamente:**
- ✅ Cosa fa ogni comando
- ✅ Perché serve
- ✅ Cosa succede dietro le quinte
- ✅ Come risolvere problemi

**Sei pronto per creare il tuo APK!** 🚀

---

**Domande? Dubbi? Problemi?**
Sono qui per aiutarti ad ogni passo! 💪
