# 🚗 MANUALE COMPLETO - Autofficina Euganea

## App Web per la Gestione Officina

---

# PARTE 1: GUIDA UTENTE

---

## 1. ACCESSO ALL'APP

### URL dell'Applicazione
Accedi all'app dal tuo browser (computer, tablet o smartphone):
**https://autofficina-euganea-app.vercel.app**

### Metodi di Accesso

#### Opzione A: Accesso con Google
1. Clicca sul pulsante **"Accedi con Google"**
2. Seleziona il tuo account Google
3. Verrai automaticamente registrato e collegato

#### Opzione B: Registrazione con Email
1. Clicca su **"Registrati"**
2. Compila i campi:
   - **Nome**: Il tuo nome completo
   - **Email**: La tua email (sarà il tuo username)
   - **Password**: Minimo 8 caratteri, con almeno una lettera maiuscola e un numero
3. Clicca **"Registrati"**
4. Usa le stesse credenziali per i futuri accessi

#### Opzione C: Login con Email esistente
1. Inserisci **Email** e **Password**
2. Clicca **"Accedi"**

---

## 2. GESTIONE VEICOLI

### Aggiungere un Nuovo Veicolo

1. Dalla schermata principale, vai alla sezione **"Veicoli"** (icona auto nella barra in basso)
2. Clicca sul pulsante **"+ Aggiungi Veicolo"**
3. Compila i campi obbligatori:
   - **Marca**: es. Fiat, Volkswagen, BMW
   - **Modello**: es. Panda, Golf, Serie 3
   - **Targa**: Formato italiano (es. AB123CD)
   - **Anno** (opzionale): Anno di immatricolazione
4. Clicca **"Salva"**
5. Apparirà un messaggio di conferma ✅

### Visualizzare i Tuoi Veicoli

- Tutti i tuoi veicoli sono elencati nella sezione **"Veicoli"**
- Ogni veicolo mostra: Marca, Modello, Targa e Anno

### Modificare un Veicolo

1. Clicca sul veicolo che vuoi modificare
2. Modifica i campi desiderati
3. Clicca **"Salva modifiche"**

### Eliminare un Veicolo

1. Clicca sul veicolo
2. Clicca **"Elimina"**
3. Conferma l'eliminazione

---

## 3. PRENOTARE UN SERVIZIO

### Passo 1: Avvia la Prenotazione
1. Dalla schermata principale, clicca **"Prenota"** (icona calendario)
2. Oppure clicca **"Nuova Prenotazione"** dalla home

### Passo 2: Seleziona il Veicolo
- Scegli quale dei tuoi veicoli necessita del servizio
- Se non hai veicoli, ti verrà chiesto di aggiungerne uno

### Passo 3: Scegli il Servizio
Seleziona il tipo di intervento necessario:

| Servizio | Descrizione | Durata Stimata |
|----------|-------------|----------------|
| Tagliando | Controllo completo e cambio olio | 2-3 ore |
| Cambio Gomme | Sostituzione pneumatici | 1 ora |
| Freni | Controllo/sostituzione freni | 2-4 ore |
| Diagnosi | Controllo computerizzato | 1 ora |
| Climatizzatore | Ricarica e controllo A/C | 1-2 ore |
| Carrozzeria | Riparazioni carrozzeria | Variabile |

### Passo 4: Seleziona Data e Ora
1. Scegli una data dal calendario
2. Seleziona uno slot orario disponibile (evidenziati in verde)
3. Gli slot grigi non sono disponibili

### Passo 5: Aggiungi Note (Opzionale)
- Descrivi eventuali problemi specifici
- Es: "Rumore strano quando freno", "Spia motore accesa"

### Passo 6: Conferma
1. Rivedi il riepilogo della prenotazione
2. Clicca **"Conferma Prenotazione"**
3. Riceverai una conferma ✅

---

## 4. LE TUE PRENOTAZIONI

### Visualizzare le Prenotazioni
1. Vai alla sezione **"Prenotazioni"** dalla barra in basso
2. Vedrai tutte le tue prenotazioni ordinate per data

### Stati della Prenotazione

| Stato | Significato | Colore |
|-------|-------------|--------|
| **In Attesa** | Prenotazione ricevuta, in attesa di conferma | 🟡 Giallo |
| **Confermata** | Appuntamento confermato dall'officina | 🔵 Blu |
| **In Lavorazione** | Il veicolo è in officina | 🟠 Arancione |
| **Completata** | Lavoro terminato, puoi ritirare | 🟢 Verde |
| **Cancellata** | Prenotazione annullata | 🔴 Rosso |

### Cancellare una Prenotazione
1. Clicca sulla prenotazione
2. Clicca **"Cancella"**
3. Conferma la cancellazione

⚠️ **Nota**: Puoi cancellare solo prenotazioni "In Attesa" o "Confermate"

---

## 5. TRACCIAMENTO VEICOLO

### Seguire lo Stato del Lavoro
1. Clicca su una prenotazione attiva
2. Vedrai lo storico degli aggiornamenti:
   - Data e ora di ogni cambio stato
   - Note dell'officina
   - Stato attuale del lavoro

### Notifiche
Riceverai notifiche quando:
- La prenotazione viene confermata
- Il lavoro inizia
- Il lavoro è completato e puoi ritirare

---

## 6. PROFILO E IMPOSTAZIONI

### Visualizzare il Profilo
1. Clicca sull'icona **Profilo** (in alto a destra o nella barra)
2. Vedrai: Nome, Email, Data registrazione

### Disconnettersi
1. Vai al Profilo
2. Clicca **"Esci"** o **"Logout"**

---

# PARTE 2: GUIDA AMMINISTRATORE

---

## 1. ACCESSO ADMIN

### Credenziali Amministratore
- **Email**: baxadmin@autofficina.it
- **Password**: Bassinimerda1.

### Procedura di Accesso
1. Vai su **https://autofficina-euganea-app.vercel.app**
2. Inserisci le credenziali admin
3. Clicca **"Accedi"**
4. Verrai automaticamente reindirizzato al **Pannello Admin**

---

## 2. PANNELLO AMMINISTRAZIONE

### Dashboard Principale
Il pannello admin mostra:
- **Tutte le prenotazioni** di tutti i clienti
- **Filtri** per stato e data
- **Azioni rapide** per gestire ogni prenotazione

### Filtri Disponibili

| Filtro | Funzione |
|--------|----------|
| **Tutti** | Mostra tutte le prenotazioni |
| **In Attesa** | Solo prenotazioni da confermare |
| **Confermate** | Appuntamenti confermati |
| **In Lavorazione** | Veicoli attualmente in officina |
| **Completate** | Lavori terminati |
| **Per Data** | Filtra per giorno specifico |

---

## 3. GESTIONE PRENOTAZIONI

### Confermare una Prenotazione
1. Trova la prenotazione con stato **"In Attesa"**
2. Clicca sulla prenotazione per aprire i dettagli
3. Clicca **"Conferma"**
4. Il cliente riceverà una notifica

### Avviare un Lavoro
1. Quando il cliente porta il veicolo, trova la prenotazione
2. Clicca **"Inizia Lavorazione"**
3. Lo stato cambierà in **"In Lavorazione"**

### Completare un Lavoro
1. Quando il lavoro è finito, clicca **"Completa"**
2. Aggiungi eventuali note finali (es. "Sostituiti pastiglie freni anteriori")
3. Il cliente verrà notificato che può ritirare

### Cancellare una Prenotazione
1. Clicca sulla prenotazione
2. Clicca **"Cancella"**
3. Inserisci il motivo (opzionale)
4. Conferma

---

## 4. AGGIORNAMENTI STATO VEICOLO

### Aggiungere Aggiornamenti Dettagliati
Per tenere informato il cliente durante la lavorazione:

1. Apri la prenotazione in lavorazione
2. Clicca **"Aggiungi Aggiornamento"**
3. Seleziona lo stato:
   - **Ricevuto**: Veicolo arrivato in officina
   - **Diagnosi**: In fase di controllo
   - **In Riparazione**: Lavoro in corso
   - **Controllo Qualità**: Verifica finale
   - **Pronto**: Disponibile per il ritiro
4. Aggiungi note descrittive
5. Salva

Il cliente vedrà questi aggiornamenti in tempo reale nell'app.

---

## 5. VISUALIZZARE DETTAGLI CLIENTE

Per ogni prenotazione puoi vedere:
- **Nome cliente**
- **Email cliente**
- **Veicolo**: Marca, Modello, Targa
- **Storico prenotazioni** del cliente

---

## 6. BEST PRACTICES PER L'ADMIN

### Routine Giornaliera Consigliata

**Mattina:**
1. Accedi al pannello admin
2. Controlla le prenotazioni **"In Attesa"** → Conferma o contatta il cliente
3. Verifica gli appuntamenti del giorno

**Durante il giorno:**
4. Aggiorna lo stato dei veicoli in lavorazione
5. Aggiungi note per tenere informati i clienti

**Sera:**
6. Completa i lavori terminati
7. Verifica le prenotazioni per il giorno successivo

### Comunicazione con i Clienti
- Usa le **note** per comunicare informazioni importanti
- Aggiorna lo stato **tempestivamente**
- In caso di problemi, contatta il cliente direttamente

---

# PARTE 3: RISOLUZIONE PROBLEMI

---

## Problemi Comuni

### "Non riesco ad accedere"
- Verifica di usare l'email corretta
- Controlla che la password sia corretta (maiuscole/minuscole)
- Prova il recupero password o registrati di nuovo

### "Non vedo i miei veicoli"
- Assicurati di essere loggato con l'account corretto
- Prova a ricaricare la pagina (pull-to-refresh su mobile)

### "La prenotazione non si salva"
- Verifica di aver compilato tutti i campi obbligatori
- Controlla la connessione internet
- Prova a ricaricare la pagina

### "L'app è lenta"
- Verifica la connessione internet
- Chiudi e riapri il browser
- Svuota la cache del browser

---

## Contatti Supporto

**Autofficina Euganea**
- 📧 Email: info@autofficinaeuganea.it
- 📞 Telefono: [Inserire numero]
- 📍 Indirizzo: [Inserire indirizzo]

**Orari Officina:**
- Lunedì - Venerdì: 8:00 - 18:00
- Sabato: 8:00 - 12:00
- Domenica: Chiuso

---

*Manuale aggiornato a Gennaio 2026*
*Versione App: 1.0*
