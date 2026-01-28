from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 11)
        self.cell(0, 10, 'Autofficina Euganea - Manuale App', 0, 1, 'C')
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Pagina ' + str(self.page_no()), 0, 0, 'C')

pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=15)

# COPERTINA
pdf.add_page()
pdf.set_font('Arial', 'B', 28)
pdf.ln(40)
pdf.cell(0, 15, 'MANUALE COMPLETO', 0, 1, 'C')
pdf.set_font('Arial', 'B', 24)
pdf.cell(0, 15, 'Autofficina Euganea', 0, 1, 'C')
pdf.set_font('Arial', '', 14)
pdf.cell(0, 10, 'App Web per la Gestione Officina', 0, 1, 'C')
pdf.ln(20)
pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 10, 'URL APP:', 0, 1, 'C')
pdf.set_font('Arial', '', 12)
pdf.set_text_color(0, 102, 204)
pdf.cell(0, 8, 'https://autofficina-euganea-app.vercel.app', 0, 1, 'C')
pdf.set_text_color(0, 0, 0)
pdf.ln(30)
pdf.set_font('Arial', 'I', 10)
pdf.cell(0, 10, 'Aggiornato: 28 Gennaio 2026', 0, 1, 'C')

# CREDENZIALI
pdf.add_page()
pdf.set_font('Arial', 'B', 18)
pdf.set_fill_color(220, 53, 69)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 12, ' CREDENZIALI DI ACCESSO ', 0, 1, 'C', True)
pdf.set_text_color(0, 0, 0)
pdf.ln(10)

pdf.set_font('Arial', 'B', 14)
pdf.cell(0, 10, 'ACCOUNT AMMINISTRATORE', 0, 1, 'L')
pdf.set_font('Arial', '', 12)
pdf.set_fill_color(245, 245, 245)
pdf.cell(0, 8, 'Email: baxadmin@autofficina.it', 0, 1, 'L', True)
pdf.cell(0, 8, 'Password: Bassinimerda1.', 0, 1, 'L', True)
pdf.ln(5)
pdf.set_font('Arial', 'I', 10)
pdf.multi_cell(0, 6, 'L\'admin accede direttamente al Pannello di Gestione per vedere e gestire tutte le prenotazioni dei clienti.')

pdf.ln(10)
pdf.set_font('Arial', 'B', 14)
pdf.cell(0, 10, 'ACCOUNT UTENTE DI PROVA', 0, 1, 'L')
pdf.set_font('Arial', '', 12)
pdf.set_fill_color(245, 245, 245)
pdf.cell(0, 8, 'Email: demo@autofficina.it', 0, 1, 'L', True)
pdf.cell(0, 8, 'Password: Demo1234', 0, 1, 'L', True)
pdf.ln(5)
pdf.set_font('Arial', 'I', 10)
pdf.multi_cell(0, 6, 'Utente normale per testare le funzioni cliente: aggiungere veicoli, prenotare servizi, vedere lo stato delle prenotazioni.')

# PARTE 1: GUIDA UTENTE
pdf.add_page()
pdf.set_font('Arial', 'B', 16)
pdf.set_fill_color(41, 128, 185)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, ' PARTE 1: GUIDA UTENTE ', 0, 1, 'C', True)
pdf.set_text_color(0, 0, 0)
pdf.ln(5)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '1. COME ACCEDERE', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''Apri il browser e vai su: https://autofficina-euganea-app.vercel.app

Hai 3 modi per accedere:

A) GOOGLE: Clicca "Accedi con Google" e seleziona il tuo account.

B) REGISTRAZIONE: Clicca "Registrati", inserisci Nome, Email e Password (minimo 6 caratteri), poi clicca "Registrati".

C) LOGIN: Se hai gia un account, inserisci Email e Password, poi clicca "Accedi".

Dopo il login verrai portato automaticamente alla Home.''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '2. AGGIUNGERE UN VEICOLO', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''1. Dalla Home, clicca su "Veicoli" nella barra in basso
2. Clicca "+ Aggiungi Veicolo"
3. Inserisci:
   - Marca (es: Fiat, BMW, Volkswagen)
   - Modello (es: Panda, Serie 3, Golf)
   - Targa (formato: AB123CD)
   - Anno (opzionale)
4. Clicca "Aggiungi Veicolo"
5. Verrai portato automaticamente alla lista veicoli''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '3. PRENOTARE UN SERVIZIO', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''1. Dalla Home, clicca "Prenota" nella barra in basso
2. Seleziona il veicolo da portare in officina
3. Scegli il tipo di intervento:
   - Tagliando
   - Cambio Gomme
   - Freni
   - Diagnosi
   - Climatizzatore
   - Carrozzeria
4. Seleziona data e orario disponibile
5. Aggiungi note se necessario (es: "rumore strano ai freni")
6. Clicca "Conferma Prenotazione"
7. Verrai portato alla lista prenotazioni''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '4. CONTROLLARE LE PRENOTAZIONI', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''Vai su "Prenotazioni" nella barra in basso per vedere tutte le tue prenotazioni.

STATI POSSIBILI:
- IN ATTESA: L'officina deve ancora confermare
- CONFERMATA: Appuntamento confermato
- IN LAVORAZIONE: Il veicolo e in officina
- COMPLETATA: Lavoro finito, puoi ritirare
- CANCELLATA: Prenotazione annullata

Clicca su una prenotazione per vedere i dettagli e lo storico degli aggiornamenti.''')

# PARTE 2: GUIDA ADMIN
pdf.add_page()
pdf.set_font('Arial', 'B', 16)
pdf.set_fill_color(40, 167, 69)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, ' PARTE 2: GUIDA AMMINISTRATORE ', 0, 1, 'C', True)
pdf.set_text_color(0, 0, 0)
pdf.ln(5)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '1. ACCESSO ADMIN', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''Vai su https://autofficina-euganea-app.vercel.app
Inserisci le credenziali admin:
- Email: baxadmin@autofficina.it
- Password: Bassinimerda1.

Dopo il login verrai portato AUTOMATICAMENTE al Pannello Admin.''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '2. PANNELLO ADMIN', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''Nel pannello admin puoi vedere:
- TUTTE le prenotazioni di TUTTI i clienti
- Nome e contatto del cliente
- Veicolo e tipo di intervento
- Data e ora dell'appuntamento
- Stato attuale della prenotazione

Usa i FILTRI in alto per:
- Vedere solo prenotazioni "In Attesa"
- Vedere solo quelle "In Lavorazione"
- Filtrare per data specifica''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '3. GESTIRE UNA PRENOTAZIONE', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''CONFERMARE:
1. Trova la prenotazione "In Attesa"
2. Clicca per aprire i dettagli
3. Clicca "Conferma"

INIZIARE LAVORAZIONE:
1. Quando il cliente porta l'auto
2. Clicca "Inizia Lavorazione"

COMPLETARE:
1. Quando il lavoro e finito
2. Clicca "Completa"
3. Aggiungi note finali se necessario''')
pdf.ln(3)

pdf.set_font('Arial', 'B', 13)
pdf.cell(0, 8, '4. ROUTINE GIORNALIERA', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''MATTINA:
- Controlla nuove prenotazioni "In Attesa"
- Conferma gli appuntamenti del giorno

DURANTE IL GIORNO:
- Aggiorna lo stato quando inizi a lavorare su un veicolo
- Aggiungi note per tenere informato il cliente

SERA:
- Completa i lavori finiti
- Controlla gli appuntamenti di domani''')

# CONTATTI
pdf.add_page()
pdf.set_font('Arial', 'B', 16)
pdf.set_fill_color(255, 193, 7)
pdf.set_text_color(0, 0, 0)
pdf.cell(0, 10, ' CONTATTI E SUPPORTO ', 0, 1, 'C', True)
pdf.ln(10)

pdf.set_font('Arial', 'B', 14)
pdf.cell(0, 8, 'Autofficina Euganea', 0, 1)
pdf.set_font('Arial', '', 12)
pdf.multi_cell(0, 7, '''
Indirizzo: Via Galzignanese 14/A, Battaglia Terme (PD)

Telefono: +39 320 314 5049

Email: autofficinaeuganea@libero.it

WhatsApp: +39 320 314 5049

Orari:
- Lunedi - Venerdi: 8:00 - 19:00
- Sabato: 8:00 - 12:00
- Domenica: Chiuso
''')

pdf.ln(10)
pdf.set_font('Arial', 'B', 12)
pdf.cell(0, 8, 'PROBLEMI CON L\'APP?', 0, 1)
pdf.set_font('Arial', '', 11)
pdf.multi_cell(0, 6, '''- "Non riesco ad accedere": Verifica email e password, controlla maiuscole
- "Non vedo i veicoli": Ricarica la pagina o esci e rientra
- "L\'app e lenta": Controlla la connessione internet

Per altri problemi contatta l'officina tramite WhatsApp.''')

# Salva
pdf.output('/app/frontend/assets/MANUALE_AUTOFFICINA_2026.pdf', 'F')
print('PDF creato con successo!')
