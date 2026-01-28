from fpdf import FPDF

pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)

# Pagina Titolo
pdf.add_page()
pdf.set_font('Helvetica', 'B', 28)
pdf.ln(50)
pdf.cell(0, 15, 'MANUALE COMPLETO', new_x='LMARGIN', new_y='NEXT', align='C')
pdf.set_font('Helvetica', 'B', 22)
pdf.cell(0, 15, 'Autofficina Euganea', new_x='LMARGIN', new_y='NEXT', align='C')
pdf.set_font('Helvetica', '', 14)
pdf.cell(0, 10, 'App Web per la Gestione Officina', new_x='LMARGIN', new_y='NEXT', align='C')
pdf.ln(40)
pdf.set_font('Helvetica', 'I', 10)
pdf.cell(0, 10, 'Versione 1.0 - Gennaio 2026', new_x='LMARGIN', new_y='NEXT', align='C')

def add_title(text):
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_fill_color(41, 128, 185)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 10, text, new_x='LMARGIN', new_y='NEXT', fill=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)

def add_section(text):
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(41, 128, 185)
    pdf.cell(0, 8, text, new_x='LMARGIN', new_y='NEXT')
    pdf.set_text_color(0, 0, 0)
    pdf.ln(1)

def add_text(text):
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5, text)
    pdf.ln(2)

def add_bullet(text):
    pdf.set_font('Helvetica', '', 10)
    bullet_text = "  - " + text
    pdf.multi_cell(0, 5, bullet_text)

# PARTE 1
pdf.add_page()
add_title('PARTE 1: GUIDA UTENTE')

add_section('1. ACCESSO ALL\'APP')
add_text('URL: https://autofficina-euganea-app.vercel.app')
add_text('Accedi da qualsiasi browser (PC, tablet, smartphone)')

add_section('Metodi di Accesso')
add_text('OPZIONE A - Accesso con Google:')
add_bullet('Clicca "Accedi con Google"')
add_bullet('Seleziona il tuo account')
add_bullet('Accesso automatico completato')

add_text('OPZIONE B - Registrazione con Email:')
add_bullet('Clicca "Registrati"')
add_bullet('Inserisci Nome, Email, Password')
add_bullet('Password: min 8 caratteri, 1 maiuscola, 1 numero')
add_bullet('Clicca "Registrati"')

add_text('OPZIONE C - Login con Email:')
add_bullet('Inserisci Email e Password')
add_bullet('Clicca "Accedi"')

add_section('2. GESTIONE VEICOLI')
add_text('Aggiungere un Veicolo:')
add_bullet('Vai a "Veicoli" nella barra in basso')
add_bullet('Clicca "+ Aggiungi Veicolo"')
add_bullet('Compila: Marca, Modello, Targa, Anno')
add_bullet('Clicca "Salva"')

add_text('Modificare/Eliminare:')
add_bullet('Clicca sul veicolo > Modifica o Elimina')

add_section('3. PRENOTARE UN SERVIZIO')
add_text('Procedura:')
add_bullet('1. Clicca "Prenota" nella barra')
add_bullet('2. Seleziona il veicolo')
add_bullet('3. Scegli il servizio')
add_bullet('4. Seleziona data e orario')
add_bullet('5. Aggiungi note (opzionale)')
add_bullet('6. Conferma')

add_text('Servizi disponibili:')
add_bullet('Tagliando (2-3 ore)')
add_bullet('Cambio Gomme (1 ora)')
add_bullet('Freni (2-4 ore)')
add_bullet('Diagnosi (1 ora)')
add_bullet('Climatizzatore (1-2 ore)')
add_bullet('Carrozzeria (variabile)')

pdf.add_page()
add_section('4. STATI PRENOTAZIONE')
add_bullet('IN ATTESA - Attesa conferma officina')
add_bullet('CONFERMATA - Appuntamento confermato')
add_bullet('IN LAVORAZIONE - Veicolo in officina')
add_bullet('COMPLETATA - Lavoro finito, ritira')
add_bullet('CANCELLATA - Prenotazione annullata')

add_section('5. TRACCIAMENTO')
add_text('Clicca su una prenotazione per vedere:')
add_bullet('Storico aggiornamenti')
add_bullet('Note dell\'officina')
add_bullet('Stato attuale')

# PARTE 2
pdf.add_page()
add_title('PARTE 2: GUIDA AMMINISTRATORE')

add_section('1. CREDENZIALI ADMIN')
add_text('Email: baxadmin@autofficina.it')
add_text('Password: Bassinimerda1.')
add_text('Dopo il login vai automaticamente al Pannello Admin.')

add_section('2. PANNELLO ADMIN')
add_text('Visualizzi:')
add_bullet('Tutte le prenotazioni di tutti i clienti')
add_bullet('Filtri per stato e data')
add_bullet('Dettagli cliente e veicolo')

add_section('3. GESTIRE PRENOTAZIONI')
add_text('Confermare:')
add_bullet('Trova prenotazione "In Attesa"')
add_bullet('Clicca > "Conferma"')
add_bullet('Il cliente riceve notifica')

add_text('Avviare Lavorazione:')
add_bullet('Clicca "Inizia Lavorazione"')
add_bullet('Stato cambia in "In Lavorazione"')

add_text('Completare:')
add_bullet('Clicca "Completa"')
add_bullet('Aggiungi note finali')
add_bullet('Cliente notificato')

add_section('4. AGGIORNAMENTI STATO')
add_text('Durante la lavorazione:')
add_bullet('Apri prenotazione')
add_bullet('Clicca "Aggiungi Aggiornamento"')
add_bullet('Stati: Ricevuto, Diagnosi, Riparazione, Pronto')
add_bullet('Il cliente vede tutto in tempo reale')

add_section('5. ROUTINE CONSIGLIATA')
add_bullet('MATTINA: Conferma prenotazioni')
add_bullet('GIORNATA: Aggiorna stati veicoli')
add_bullet('SERA: Completa lavori, verifica domani')

# PARTE 3
pdf.add_page()
add_title('PARTE 3: RISOLUZIONE PROBLEMI')

add_section('Problemi Comuni')
add_text('"Non riesco ad accedere"')
add_bullet('Verifica email/password corretti')
add_bullet('Controlla maiuscole/minuscole')

add_text('"Non vedo i veicoli"')
add_bullet('Sei loggato con l\'account giusto?')
add_bullet('Ricarica la pagina')

add_text('"App lenta"')
add_bullet('Controlla connessione internet')
add_bullet('Svuota cache browser')

add_section('Contatti')
add_text('Autofficina Euganea')
add_text('Email: info@autofficinaeuganea.it')
add_text('Orari: Lun-Ven 8-18, Sab 8-12')

pdf.output('/app/MANUALE_AUTOFFICINA_EUGANEA.pdf')
print('PDF creato con successo!')
