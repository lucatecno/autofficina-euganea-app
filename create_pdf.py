from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Autofficina Euganea - Manuale', 0, 1, 'C')
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Pagina ' + str(self.page_no()), 0, 0, 'C')

pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=15)

# TITOLO
pdf.add_page()
pdf.set_font('Arial', 'B', 24)
pdf.ln(40)
pdf.cell(0, 15, 'MANUALE COMPLETO', 0, 1, 'C')
pdf.set_font('Arial', 'B', 20)
pdf.cell(0, 15, 'Autofficina Euganea', 0, 1, 'C')
pdf.set_font('Arial', '', 14)
pdf.cell(0, 10, 'App Web per la Gestione Officina', 0, 1, 'C')
pdf.ln(30)
pdf.set_font('Arial', 'I', 10)
pdf.cell(0, 10, 'Versione 1.0 - Gennaio 2026', 0, 1, 'C')

# PARTE 1
pdf.add_page()
pdf.set_font('Arial', 'B', 16)
pdf.set_fill_color(41, 128, 185)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, 'PARTE 1: GUIDA UTENTE', 0, 1, 'C', True)
pdf.set_text_color(0, 0, 0)
pdf.ln(5)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '1. ACCESSO ALL\'APP', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, 'URL: https://autofficina-euganea-app.vercel.app\nAccedi da qualsiasi browser (PC, tablet, smartphone).')
pdf.ln(3)

pdf.set_font('Arial', 'B', 11)
pdf.cell(0, 7, 'Metodi di Accesso:', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''OPZIONE A - Google:
- Clicca "Accedi con Google"
- Seleziona il tuo account Google
- Accesso automatico

OPZIONE B - Registrazione Email:
- Clicca "Registrati"
- Inserisci Nome, Email, Password
- Password: minimo 8 caratteri, 1 maiuscola, 1 numero
- Clicca "Registrati"

OPZIONE C - Login Email:
- Inserisci Email e Password
- Clicca "Accedi"''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '2. GESTIONE VEICOLI', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Aggiungere un Veicolo:
- Vai a "Veicoli" nella barra in basso
- Clicca "+ Aggiungi Veicolo"
- Compila: Marca, Modello, Targa, Anno (opzionale)
- Clicca "Salva"

Modificare/Eliminare:
- Clicca sul veicolo per aprire i dettagli
- Modifica i campi oppure clicca "Elimina"''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '3. PRENOTARE UN SERVIZIO', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Procedura:
1. Clicca "Prenota" nella barra in basso
2. Seleziona il veicolo
3. Scegli il servizio desiderato
4. Seleziona data e orario disponibile
5. Aggiungi note (opzionale)
6. Conferma la prenotazione

Servizi Disponibili:
- Tagliando (2-3 ore)
- Cambio Gomme (1 ora)
- Freni (2-4 ore)
- Diagnosi (1 ora)
- Climatizzatore (1-2 ore)
- Carrozzeria (variabile)''')

pdf.add_page()
pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '4. STATI PRENOTAZIONE', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''- IN ATTESA: Prenotazione ricevuta, in attesa conferma
- CONFERMATA: Appuntamento confermato dall\'officina
- IN LAVORAZIONE: Veicolo in officina
- COMPLETATA: Lavoro terminato, puoi ritirare
- CANCELLATA: Prenotazione annullata''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '5. TRACCIAMENTO VEICOLO', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Clicca su una prenotazione attiva per vedere:
- Storico degli aggiornamenti
- Note dell\'officina
- Stato attuale del lavoro

Riceverai notifiche per ogni cambio di stato.''')

# PARTE 2
pdf.add_page()
pdf.set_font('Arial', 'B', 16)
pdf.set_fill_color(41, 128, 185)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, 'PARTE 2: GUIDA AMMINISTRATORE', 0, 1, 'C', True)
pdf.set_text_color(0, 0, 0)
pdf.ln(5)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '1. CREDENZIALI ADMIN', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Email: baxadmin@autofficina.it
Password: Bassinimerda1.

Dopo il login, verrai automaticamente reindirizzato al Pannello Admin.''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '2. PANNELLO ADMIN', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Il pannello mostra:
- Tutte le prenotazioni di tutti i clienti
- Filtri per stato e data
- Dettagli cliente e veicolo per ogni prenotazione''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '3. GESTIRE PRENOTAZIONI', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Confermare una prenotazione:
- Trova prenotazione "In Attesa"
- Clicca per aprire i dettagli
- Clicca "Conferma"
- Il cliente riceve notifica

Avviare Lavorazione:
- Clicca "Inizia Lavorazione"
- Lo stato cambia in "In Lavorazione"

Completare:
- Clicca "Completa"
- Aggiungi note finali se necessario
- Il cliente viene notificato''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '4. AGGIORNAMENTI STATO', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Durante la lavorazione, tieni informato il cliente:
- Apri la prenotazione
- Clicca "Aggiungi Aggiornamento"
- Seleziona stato: Ricevuto, Diagnosi, Riparazione, Pronto
- Aggiungi note descrittive
- Il cliente vede tutto in tempo reale''')

pdf.add_page()
pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, '5. ROUTINE GIORNALIERA CONSIGLIATA', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''MATTINA:
- Controlla prenotazioni "In Attesa"
- Conferma gli appuntamenti

DURANTE IL GIORNO:
- Aggiorna lo stato dei veicoli in lavorazione
- Aggiungi note per i clienti

SERA:
- Completa i lavori terminati
- Verifica le prenotazioni per domani''')

# PARTE 3
pdf.ln(10)
pdf.set_font('Arial', 'B', 16)
pdf.set_fill_color(41, 128, 185)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, 'PARTE 3: RISOLUZIONE PROBLEMI', 0, 1, 'C', True)
pdf.set_text_color(0, 0, 0)
pdf.ln(5)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, 'Problemi Comuni', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''"Non riesco ad accedere"
- Verifica email e password corretti
- Controlla maiuscole/minuscole
- Prova a registrarti di nuovo

"Non vedo i miei veicoli"
- Sei loggato con l\'account corretto?
- Ricarica la pagina

"L\'app e lenta"
- Controlla la connessione internet
- Svuota la cache del browser''')
pdf.ln(5)

pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, 'Contatti Supporto', 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, '''Autofficina Euganea
Email: info@autofficinaeuganea.it
Orari: Lun-Ven 8:00-18:00, Sab 8:00-12:00''')

pdf.output('/app/MANUALE_AUTOFFICINA_EUGANEA.pdf', 'F')
print('PDF creato con successo: /app/MANUALE_AUTOFFICINA_EUGANEA.pdf')
