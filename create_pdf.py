from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.cell(0, 10, 'Autofficina Euganea - Manuale Completo', 0, 1, 'C')
        self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Pagina {self.page_no()}', 0, 0, 'C')
    
    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(41, 128, 185)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, title, 0, 1, 'L', fill=True)
        self.set_text_color(0, 0, 0)
        self.ln(2)
    
    def section_title(self, title):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(41, 128, 185)
        self.cell(0, 8, title, 0, 1, 'L')
        self.set_text_color(0, 0, 0)
        self.ln(1)
    
    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 6, text)
        self.ln(2)
    
    def bullet_point(self, text):
        self.set_font('Helvetica', '', 10)
        self.cell(5)
        self.cell(5, 6, chr(149), 0, 0)
        self.multi_cell(0, 6, text)

pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# Title Page
pdf.set_font('Helvetica', 'B', 24)
pdf.cell(0, 60, '', 0, 1)
pdf.cell(0, 15, 'MANUALE COMPLETO', 0, 1, 'C')
pdf.set_font('Helvetica', 'B', 20)
pdf.cell(0, 15, 'Autofficina Euganea', 0, 1, 'C')
pdf.set_font('Helvetica', '', 14)
pdf.cell(0, 10, 'App Web per la Gestione Officina', 0, 1, 'C')
pdf.cell(0, 30, '', 0, 1)
pdf.set_font('Helvetica', 'I', 10)
pdf.cell(0, 10, 'Versione 1.0 - Gennaio 2026', 0, 1, 'C')

# PARTE 1: GUIDA UTENTE
pdf.add_page()
pdf.chapter_title('PARTE 1: GUIDA UTENTE')

pdf.section_title('1. ACCESSO ALL\'APP')
pdf.body_text('URL dell\'Applicazione:\nhttps://autofficina-euganea-app.vercel.app')
pdf.body_text('Puoi accedere all\'app da qualsiasi browser (computer, tablet o smartphone).')

pdf.section_title('Metodi di Accesso')
pdf.body_text('OPZIONE A: Accesso con Google')
pdf.bullet_point('Clicca sul pulsante "Accedi con Google"')
pdf.bullet_point('Seleziona il tuo account Google')
pdf.bullet_point('Verrai automaticamente registrato e collegato')

pdf.body_text('OPZIONE B: Registrazione con Email')
pdf.bullet_point('Clicca su "Registrati"')
pdf.bullet_point('Compila: Nome, Email, Password (min 8 caratteri, 1 maiuscola, 1 numero)')
pdf.bullet_point('Clicca "Registrati"')

pdf.body_text('OPZIONE C: Login con Email esistente')
pdf.bullet_point('Inserisci Email e Password')
pdf.bullet_point('Clicca "Accedi"')

pdf.section_title('2. GESTIONE VEICOLI')
pdf.body_text('Aggiungere un Nuovo Veicolo:')
pdf.bullet_point('Vai alla sezione "Veicoli" (icona auto nella barra in basso)')
pdf.bullet_point('Clicca "+ Aggiungi Veicolo"')
pdf.bullet_point('Compila: Marca, Modello, Targa, Anno (opzionale)')
pdf.bullet_point('Clicca "Salva"')

pdf.body_text('Visualizzare i Tuoi Veicoli:')
pdf.bullet_point('Tutti i tuoi veicoli sono elencati nella sezione "Veicoli"')
pdf.bullet_point('Ogni veicolo mostra: Marca, Modello, Targa e Anno')

pdf.body_text('Modificare/Eliminare un Veicolo:')
pdf.bullet_point('Clicca sul veicolo per aprire i dettagli')
pdf.bullet_point('Modifica i campi o clicca "Elimina"')

pdf.add_page()
pdf.section_title('3. PRENOTARE UN SERVIZIO')
pdf.body_text('Procedura di Prenotazione:')
pdf.bullet_point('PASSO 1: Clicca "Prenota" dalla barra in basso')
pdf.bullet_point('PASSO 2: Seleziona il veicolo che necessita del servizio')
pdf.bullet_point('PASSO 3: Scegli il tipo di intervento')
pdf.bullet_point('PASSO 4: Seleziona data e orario disponibile')
pdf.bullet_point('PASSO 5: Aggiungi note (opzionale)')
pdf.bullet_point('PASSO 6: Conferma la prenotazione')

pdf.body_text('Servizi Disponibili:')
pdf.bullet_point('Tagliando - Controllo completo e cambio olio (2-3 ore)')
pdf.bullet_point('Cambio Gomme - Sostituzione pneumatici (1 ora)')
pdf.bullet_point('Freni - Controllo/sostituzione freni (2-4 ore)')
pdf.bullet_point('Diagnosi - Controllo computerizzato (1 ora)')
pdf.bullet_point('Climatizzatore - Ricarica e controllo A/C (1-2 ore)')
pdf.bullet_point('Carrozzeria - Riparazioni carrozzeria (variabile)')

pdf.section_title('4. LE TUE PRENOTAZIONI')
pdf.body_text('Stati della Prenotazione:')
pdf.bullet_point('IN ATTESA (Giallo) - Prenotazione ricevuta, attesa conferma')
pdf.bullet_point('CONFERMATA (Blu) - Appuntamento confermato')
pdf.bullet_point('IN LAVORAZIONE (Arancione) - Veicolo in officina')
pdf.bullet_point('COMPLETATA (Verde) - Lavoro terminato, puoi ritirare')
pdf.bullet_point('CANCELLATA (Rosso) - Prenotazione annullata')

pdf.body_text('Cancellare una Prenotazione:')
pdf.bullet_point('Puoi cancellare solo prenotazioni "In Attesa" o "Confermate"')
pdf.bullet_point('Clicca sulla prenotazione > "Cancella" > Conferma')

pdf.section_title('5. TRACCIAMENTO VEICOLO')
pdf.body_text('Segui lo stato del lavoro:')
pdf.bullet_point('Clicca su una prenotazione attiva')
pdf.bullet_point('Vedrai lo storico degli aggiornamenti con data, ora e note')
pdf.bullet_point('Riceverai notifiche per ogni cambio di stato')

# PARTE 2: GUIDA ADMIN
pdf.add_page()
pdf.chapter_title('PARTE 2: GUIDA AMMINISTRATORE')

pdf.section_title('1. ACCESSO ADMIN')
pdf.body_text('Credenziali Amministratore:')
pdf.bullet_point('Email: baxadmin@autofficina.it')
pdf.bullet_point('Password: Bassinimerda1.')
pdf.body_text('Dopo il login, verrai automaticamente reindirizzato al Pannello Admin.')

pdf.section_title('2. PANNELLO AMMINISTRAZIONE')
pdf.body_text('Il pannello admin mostra:')
pdf.bullet_point('Tutte le prenotazioni di tutti i clienti')
pdf.bullet_point('Filtri per stato e data')
pdf.bullet_point('Azioni rapide per gestire ogni prenotazione')

pdf.body_text('Filtri Disponibili:')
pdf.bullet_point('Tutti - Mostra tutte le prenotazioni')
pdf.bullet_point('In Attesa - Solo prenotazioni da confermare')
pdf.bullet_point('Confermate - Appuntamenti confermati')
pdf.bullet_point('In Lavorazione - Veicoli in officina')
pdf.bullet_point('Completate - Lavori terminati')
pdf.bullet_point('Per Data - Filtra per giorno specifico')

pdf.section_title('3. GESTIONE PRENOTAZIONI')
pdf.body_text('Confermare una Prenotazione:')
pdf.bullet_point('Trova la prenotazione "In Attesa"')
pdf.bullet_point('Clicca per aprire i dettagli')
pdf.bullet_point('Clicca "Conferma" - il cliente ricevera notifica')

pdf.body_text('Avviare un Lavoro:')
pdf.bullet_point('Quando il cliente porta il veicolo')
pdf.bullet_point('Clicca "Inizia Lavorazione"')

pdf.body_text('Completare un Lavoro:')
pdf.bullet_point('Quando il lavoro e finito, clicca "Completa"')
pdf.bullet_point('Aggiungi note finali')
pdf.bullet_point('Il cliente verra notificato')

pdf.add_page()
pdf.section_title('4. AGGIORNAMENTI STATO VEICOLO')
pdf.body_text('Per tenere informato il cliente durante la lavorazione:')
pdf.bullet_point('Apri la prenotazione in lavorazione')
pdf.bullet_point('Clicca "Aggiungi Aggiornamento"')
pdf.bullet_point('Seleziona stato: Ricevuto, Diagnosi, In Riparazione, Controllo Qualita, Pronto')
pdf.bullet_point('Aggiungi note descrittive e salva')

pdf.section_title('5. BEST PRACTICES')
pdf.body_text('Routine Giornaliera Consigliata:')
pdf.bullet_point('MATTINA: Controlla prenotazioni "In Attesa", conferma appuntamenti')
pdf.bullet_point('DURANTE IL GIORNO: Aggiorna stato veicoli in lavorazione')
pdf.bullet_point('SERA: Completa lavori terminati, verifica prenotazioni domani')

# PARTE 3: RISOLUZIONE PROBLEMI
pdf.add_page()
pdf.chapter_title('PARTE 3: RISOLUZIONE PROBLEMI')

pdf.section_title('Problemi Comuni')
pdf.body_text('"Non riesco ad accedere"')
pdf.bullet_point('Verifica email e password corrette')
pdf.bullet_point('Controlla maiuscole/minuscole')
pdf.bullet_point('Prova a registrarti di nuovo')

pdf.body_text('"Non vedo i miei veicoli"')
pdf.bullet_point('Assicurati di essere loggato con l\'account corretto')
pdf.bullet_point('Ricarica la pagina')

pdf.body_text('"La prenotazione non si salva"')
pdf.bullet_point('Verifica tutti i campi obbligatori')
pdf.bullet_point('Controlla la connessione internet')

pdf.body_text('"L\'app e lenta"')
pdf.bullet_point('Verifica connessione internet')
pdf.bullet_point('Chiudi e riapri il browser')
pdf.bullet_point('Svuota la cache')

pdf.section_title('Contatti Supporto')
pdf.body_text('Autofficina Euganea')
pdf.bullet_point('Email: info@autofficinaeuganea.it')
pdf.bullet_point('Orari: Lun-Ven 8:00-18:00, Sab 8:00-12:00')

# Save PDF
pdf.output('/app/MANUALE_AUTOFFICINA_EUGANEA.pdf')
print("PDF creato con successo!")
