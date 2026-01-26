# 📱 GUIDA COMPLETA: Come Creare l'APK di Autofficina Euganea

## ⚠️ IMPORTANTE: Questa procedura va fatta SOLO UNA VOLTA!

Dopo aver creato il keystore la prima volta, i build successivi saranno completamente automatici.

---

## 🎯 COSA STAI PER FARE

Stai per:
1. Installare uno strumento (EAS CLI) sul tuo computer
2. Fare login con le tue credenziali Expo
3. Lanciare UN comando per creare l'APK
4. Aspettare 10-15 minuti
5. Ricevere il link per scaricare l'APK

**TEMPO TOTALE: 5 minuti di lavoro + 15 minuti di attesa**

---

## 📋 REQUISITI

- Un computer (Windows, Mac, o Linux)
- Connessione internet
- Node.js installato (se non ce l'hai, scaricalo da: https://nodejs.org/)

---

## 🚀 PROCEDURA PASSO-PASSO

### PASSO 1: Apri il Terminale

**Su Windows:**
- Premi `Win + R`
- Scrivi `cmd` e premi Enter

**Su Mac:**
- Premi `Cmd + Spazio`
- Scrivi "Terminal" e premi Enter

**Su Linux:**
- Premi `Ctrl + Alt + T`

---

### PASSO 2: Installa EAS CLI

Copia e incolla questo comando nel terminale:

```bash
npm install -g eas-cli
```

Premi **Enter** e aspetta che finisca (circa 1-2 minuti).

---

### PASSO 3: Fai il Login

Copia e incolla questo comando:

```bash
eas login
```

Ti chiederà:
- **Email or username:** Scrivi `autofficina-euganea`
- **Password:** Scrivi `Battagliaterme26.`

---

### PASSO 4: Scarica il Codice (se non ce l'hai)

**OPZIONE A - Se hai accesso al repository:**
```bash
git clone [URL_DEL_REPOSITORY]
cd frontend
```

**OPZIONE B - Se ti ho mandato un file ZIP:**
1. Estrai il file ZIP in una cartella
2. Apri il terminale nella cartella `frontend`:
   ```bash
   cd /percorso/della/cartella/frontend
   ```

---

### PASSO 5: Avvia il Build APK 🎉

Questo è il comando magico! Copia e incolla:

```bash
eas build --platform android --profile preview
```

**COSA SUCCEDERÀ:**

1. Ti chiederà: **"Generate a new Android Keystore?"**
   → Scrivi `Y` e premi Enter

2. Ti chiederà: **"Set up Push Notifications?"**
   → Scrivi `N` e premi Enter (le configureremo dopo se serve)

3. Inizierà il build! Vedrai qualcosa tipo:
   ```
   ✔ Build started
   ✔ Build in progress...
   ```

---

### PASSO 6: Aspetta e Ottieni l'APK

Il build richiede **10-15 minuti**. 

**Due modi per seguirlo:**

**MODO 1 - Nel Terminale:**
Il terminale ti mostrerà un link tipo:
```
Build details: https://expo.dev/accounts/autofficina-euganea/projects/autofficina-euganea/builds/abc123
```

**MODO 2 - Sul Web:**
Vai su: https://expo.dev/accounts/autofficina-euganea/projects/autofficina-euganea/builds

---

### PASSO 7: Scarica l'APK! 🎉

Quando il build è completato (vedrai "✔ Build finished"):

1. Il terminale ti mostrerà un link per scaricare l'APK
2. Oppure vai su https://expo.dev → Projects → Autofficina Euganea → Builds
3. Clicca sull'ultimo build
4. Clicca su **"Download"**

**FATTO! Hai il tuo APK!** 🎊

---

## 📲 COME INSTALLARE L'APK SUL TELEFONO

1. Invia l'APK al telefono Android (via email, WhatsApp, ecc.)
2. Sul telefono, apri il file APK
3. Quando dice "Installa app sconosciute" → Permetti l'installazione
4. Clicca **"Installa"**
5. **FATTO!** L'app è installata! 🚀

---

## 🎁 BONUS: Build Futuri (Dopo la Prima Volta)

Dopo aver creato il keystore la prima volta, i build successivi sono AUTOMATICI!

Basta eseguire:
```bash
eas build --platform android --profile preview --non-interactive
```

E NON ti chiederà più nulla! 😎

---

## ❓ PROBLEMI COMUNI

### "npm: command not found"
→ Devi installare Node.js da: https://nodejs.org/

### "Permission denied"
→ Aggiungi `sudo` davanti al comando (solo su Mac/Linux)

### "Build failed"
→ Copia l'errore e contattami, ti aiuto!

---

## 📞 SERVE AIUTO?

Se hai difficoltà con QUALSIASI passo, fammi sapere! Posso:
- Spiegarti meglio un passaggio specifico
- Darti comandi alternativi
- Aiutarti a risolvere errori

**Non sei solo! Sono qui per aiutarti!** 💪

---

## 📝 CREDENZIALI IMPORTANTI

**Account Expo:**
- Username: `autofficina-euganea`
- Password: `Battagliaterme26.`

**MongoDB Atlas:**
- Email: La tua email personale
- Connection String: già configurata nel backend
- Database: `autofficina_db`

**Package Name:**
- Android: `it.autofficina.euganea`

---

## ✅ CHECKLIST

Prima di iniziare, assicurati di avere:

- [ ] Node.js installato
- [ ] Terminale aperto
- [ ] Credenziali Expo a portata di mano
- [ ] Connessione internet stabile
- [ ] 20 minuti di tempo disponibile

**Vai e spacca tutto!** 🚀💪
