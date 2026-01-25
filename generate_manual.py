#!/usr/bin/env python3
"""
Genera il manuale PDF per l'app AUTOFFICINA EUGANEA
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, ListFlowable, ListItem
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

# Colori brand
PRIMARY_RED = HexColor('#E53935')
DARK_BG = HexColor('#121212')
SURFACE = HexColor('#1E1E1E')
TEXT_GRAY = HexColor('#757575')

def create_pdf():
    doc = SimpleDocTemplate(
        "/app/AUTOFFICINA_EUGANEA_Manuale_App.pdf",
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=PRIMARY_RED,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=PRIMARY_RED,
        spaceBefore=20,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    )
    
    heading2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=HexColor('#333333'),
        spaceBefore=15,
        spaceAfter=8,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        textColor=HexColor('#333333'),
        spaceAfter=8,
        alignment=TA_JUSTIFY,
        leading=14
    )
    
    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontSize=11,
        textColor=HexColor('#333333'),
        leftIndent=20,
        spaceAfter=5
    )
    
    info_style = ParagraphStyle(
        'InfoBox',
        parent=styles['Normal'],
        fontSize=10,
        textColor=HexColor('#666666'),
        backColor=HexColor('#F5F5F5'),
        borderPadding=10,
        spaceAfter=10
    )
    
    story = []
    
    # === COPERTINA ===
    story.append(Spacer(1, 3*cm))
    story.append(Paragraph("🔧 AUTOFFICINA EUGANEA", title_style))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("Manuale Utente App Mobile", ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=16,
        textColor=TEXT_GRAY,
        alignment=TA_CENTER
    )))
    story.append(Spacer(1, 2*cm))
    story.append(Paragraph("Versione 1.0", ParagraphStyle(
        'Version',
        parent=styles['Normal'],
        fontSize=12,
        textColor=TEXT_GRAY,
        alignment=TA_CENTER
    )))
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph("Gennaio 2025", ParagraphStyle(
        'Date',
        parent=styles['Normal'],
        fontSize=12,
        textColor=TEXT_GRAY,
        alignment=TA_CENTER
    )))
    
    story.append(PageBreak())
    
    # === INDICE ===
    story.append(Paragraph("INDICE", heading1_style))
    story.append(Spacer(1, 0.5*cm))
    
    indice = [
        "1. Introduzione",
        "2. Accesso all'App",
        "3. Schermata Home",
        "4. Gestione Veicoli",
        "5. Prenotazione Interventi",
        "6. Tracking Stato Veicolo",
        "7. Sezione Showcase",
        "8. Profilo e Impostazioni",
        "9. Pannello Admin (per l'officina)",
        "10. FAQ e Supporto"
    ]
    
    for item in indice:
        story.append(Paragraph(item, bullet_style))
    
    story.append(PageBreak())
    
    # === 1. INTRODUZIONE ===
    story.append(Paragraph("1. INTRODUZIONE", heading1_style))
    story.append(Paragraph(
        "L'app <b>AUTOFFICINA EUGANEA</b> è un'applicazione mobile progettata per semplificare "
        "la gestione degli appuntamenti tra l'officina e i clienti. Permette di prenotare interventi, "
        "monitorare lo stato del proprio veicolo in tempo reale e rimanere aggiornati sui lavori dell'officina.",
        body_style
    ))
    
    story.append(Paragraph("<b>Funzionalità principali:</b>", body_style))
    features = [
        "✅ Prenotazione appuntamenti online",
        "✅ Tracking in tempo reale dello stato del veicolo",
        "✅ Gestione multipla veicoli",
        "✅ Storico completo delle prenotazioni",
        "✅ Notifiche sullo stato delle lavorazioni",
        "✅ Showcase dei lavori dell'officina"
    ]
    for f in features:
        story.append(Paragraph(f, bullet_style))
    
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("<b>Link App:</b> https://autotrack-app-1.preview.emergentagent.com", info_style))
    
    # === 2. ACCESSO ===
    story.append(Paragraph("2. ACCESSO ALL'APP", heading1_style))
    story.append(Paragraph(
        "L'accesso all'app avviene tramite <b>Google Account</b>. Questo garantisce massima sicurezza "
        "e velocità nel login, senza dover ricordare password aggiuntive.",
        body_style
    ))
    
    story.append(Paragraph("<b>Come accedere:</b>", heading2_style))
    steps_login = [
        "1. Aprire l'app o il link web",
        "2. Cliccare sul pulsante rosso \"Accedi con Google\"",
        "3. Selezionare il proprio account Google",
        "4. Autorizzare l'accesso",
        "5. Verrai automaticamente reindirizzato alla Home"
    ]
    for step in steps_login:
        story.append(Paragraph(step, bullet_style))
    
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        "<b>Nota:</b> Al primo accesso, accetti automaticamente i Termini di Servizio e la Privacy Policy.",
        info_style
    ))
    
    # === 3. SCHERMATA HOME ===
    story.append(Paragraph("3. SCHERMATA HOME", heading1_style))
    story.append(Paragraph(
        "La Home è il punto centrale dell'app. Da qui puoi vedere lo stato del tuo veicolo "
        "(se hai una prenotazione attiva) e accedere rapidamente a tutte le funzioni.",
        body_style
    ))
    
    story.append(Paragraph("<b>Elementi della Home:</b>", heading2_style))
    home_elements = [
        "<b>Messaggio di benvenuto</b> - Mostra il tuo nome",
        "<b>Stato Veicolo</b> - Se hai una prenotazione attiva, mostra la barra di avanzamento",
        "<b>Azioni Rapide:</b>",
        "   • <b>Prenota</b> - Crea una nuova prenotazione",
        "   • <b>Storico</b> - Vedi tutte le prenotazioni passate",
        "   • <b>Veicoli</b> - Gestisci i tuoi veicoli",
        "   • <b>Lavori</b> - Vedi lo showcase dell'officina",
        "<b>Info Officina</b> - Indirizzo, orari e telefono"
    ]
    for elem in home_elements:
        story.append(Paragraph(elem, bullet_style))
    
    # === 4. GESTIONE VEICOLI ===
    story.append(PageBreak())
    story.append(Paragraph("4. GESTIONE VEICOLI", heading1_style))
    story.append(Paragraph(
        "Prima di prenotare un intervento, devi registrare almeno un veicolo. "
        "Puoi gestire più veicoli (auto, moto, furgoni) associati al tuo account.",
        body_style
    ))
    
    story.append(Paragraph("<b>Aggiungere un nuovo veicolo:</b>", heading2_style))
    add_vehicle = [
        "1. Vai nella tab \"Veicoli\" (icona auto in basso)",
        "2. Clicca il pulsante \"+\" rosso in basso a destra",
        "3. Compila i campi:",
        "   • <b>Marca</b> (es. Fiat, Volkswagen, BMW)",
        "   • <b>Modello</b> (es. Panda, Golf, Serie 3)",
        "   • <b>Targa</b> (es. AB123CD)",
        "   • <b>Anno</b> (opzionale)",
        "4. Clicca \"Aggiungi Veicolo\""
    ]
    for step in add_vehicle:
        story.append(Paragraph(step, bullet_style))
    
    story.append(Paragraph("<b>Modificare o eliminare un veicolo:</b>", heading2_style))
    story.append(Paragraph(
        "Nella lista veicoli, ogni scheda mostra le icone per modificare (matita) o eliminare (cestino) il veicolo.",
        body_style
    ))
    
    # === 5. PRENOTAZIONE ===
    story.append(Paragraph("5. PRENOTAZIONE INTERVENTI", heading1_style))
    story.append(Paragraph(
        "Il cuore dell'app è il sistema di prenotazione. Con pochi tap puoi fissare un appuntamento "
        "scegliendo veicolo, tipo di intervento, data e orario.",
        body_style
    ))
    
    story.append(Paragraph("<b>Come prenotare (4 passaggi):</b>", heading2_style))
    
    story.append(Paragraph("<b>STEP 1 - Seleziona Veicolo</b>", body_style))
    story.append(Paragraph("Scegli quale veicolo portare in officina tra quelli registrati.", bullet_style))
    
    story.append(Paragraph("<b>STEP 2 - Tipo di Intervento</b>", body_style))
    story.append(Paragraph("Scegli il servizio necessario:", bullet_style))
    
    services_table = [
        ["Servizio", "Descrizione", "Tempo stimato", "Prezzo da"],
        ["Tagliando", "Controllo completo, filtri e olio", "~2 ore", "€150"],
        ["Cambio Gomme", "Sostituzione pneumatici stagionali", "~1 ora", "€60"],
        ["Diagnosi Elettronica", "Scansione centralina", "~30 min", "€50"],
        ["Revisione Freni", "Pastiglie e dischi", "~2 ore", "€200"],
        ["Ricarica Clima", "Gas climatizzatore", "~1 ora", "€80"],
        ["Revisione Auto", "Revisione ministeriale", "~1 ora", "€80"],
    ]
    
    t = Table(services_table, colWidths=[3.5*cm, 5*cm, 2.5*cm, 2*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_RED),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), HexColor('#F9F9F9')),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CCCCCC')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(Spacer(1, 0.3*cm))
    story.append(t)
    story.append(Spacer(1, 0.3*cm))
    
    story.append(Paragraph("<b>STEP 3 - Data e Ora</b>", body_style))
    story.append(Paragraph(
        "Scorri le date disponibili (prossimi 14 giorni, esclusa domenica) e seleziona un orario libero. "
        "Gli slot vanno dalle 8:00 alle 18:00.",
        bullet_style
    ))
    
    story.append(Paragraph("<b>STEP 4 - Conferma</b>", body_style))
    story.append(Paragraph(
        "Rivedi il riepilogo della prenotazione. Puoi aggiungere note o richieste particolari. "
        "Clicca \"Conferma Prenotazione\" per inviare la richiesta.",
        bullet_style
    ))
    
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        "<b>Importante:</b> Dopo l'invio, la prenotazione sarà in stato \"In attesa\" fino alla conferma dell'officina.",
        info_style
    ))
    
    # === 6. TRACKING ===
    story.append(PageBreak())
    story.append(Paragraph("6. TRACKING STATO VEICOLO", heading1_style))
    story.append(Paragraph(
        "Una volta portato il veicolo in officina, puoi monitorare lo stato della lavorazione in tempo reale "
        "direttamente dall'app.",
        body_style
    ))
    
    story.append(Paragraph("<b>Stati possibili:</b>", heading2_style))
    stati = [
        ["🟠 In attesa", "Il veicolo non è ancora stato consegnato"],
        ["🔵 Check-in effettuato", "Il veicolo è stato consegnato all'officina"],
        ["🟣 In lavorazione", "I meccanici stanno lavorando sul veicolo"],
        ["🔵 In collaudo", "Il veicolo è in fase di test"],
        ["🟢 Pronto al ritiro", "La lavorazione è completa, puoi ritirare"],
        ["✅ Consegnato", "Il veicolo è stato ritirato"],
    ]
    
    t2 = Table(stati, colWidths=[4*cm, 9*cm])
    t2.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
    ]))
    story.append(t2)
    
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        "Nella Home vedrai una barra di avanzamento colorata che mostra lo stato attuale. "
        "Cliccando sulla prenotazione puoi vedere la cronologia completa di tutti gli aggiornamenti.",
        body_style
    ))
    
    # === 7. SHOWCASE ===
    story.append(Paragraph("7. SEZIONE SHOWCASE", heading1_style))
    story.append(Paragraph(
        "La sezione \"Showcase\" (tab con icona immagini) mostra i lavori migliori dell'officina: "
        "restauri, tuning, riparazioni complesse. È collegata al profilo Instagram dell'officina.",
        body_style
    ))
    story.append(Paragraph(
        "Segui @autofficina_euganea su Instagram per vedere tutti i contenuti!",
        info_style
    ))
    
    # === 8. PROFILO ===
    story.append(Paragraph("8. PROFILO E IMPOSTAZIONI", heading1_style))
    story.append(Paragraph(
        "Nella tab \"Profilo\" (icona persona) puoi gestire il tuo account:",
        body_style
    ))
    profile_items = [
        "<b>Informazioni utente</b> - Nome, email, avatar",
        "<b>I Miei Veicoli</b> - Accesso rapido alla gestione veicoli",
        "<b>Le Mie Prenotazioni</b> - Accesso rapido allo storico",
        "<b>Privacy Policy</b> - Link alla policy GDPR",
        "<b>Contattaci</b> - Chiama direttamente l'officina",
        "<b>Consensi GDPR</b> - Stato dei tuoi consensi",
        "<b>Esci</b> - Logout dall'app"
    ]
    for item in profile_items:
        story.append(Paragraph("• " + item, bullet_style))
    
    # === 9. PANNELLO ADMIN ===
    story.append(PageBreak())
    story.append(Paragraph("9. PANNELLO ADMIN (Per l'Officina)", heading1_style))
    story.append(Paragraph(
        "Il pannello admin è riservato al personale dell'officina per gestire le prenotazioni "
        "e aggiornare lo stato dei veicoli.",
        body_style
    ))
    
    story.append(Paragraph("<b>Accesso:</b> https://autotrack-app-1.preview.emergentagent.com/admin", info_style))
    
    story.append(Paragraph("<b>Funzioni Admin:</b>", heading2_style))
    admin_features = [
        "<b>Visualizza prenotazioni</b> - Filtra per: Oggi, In corso, Tutte",
        "<b>Conferma/Rifiuta</b> - Approva o rifiuta le richieste in attesa",
        "<b>Aggiorna stato veicolo</b> - Cambia lo stato della lavorazione con un click",
        "<b>Contatta cliente</b> - Vedi email del cliente per comunicazioni"
    ]
    for feat in admin_features:
        story.append(Paragraph("• " + feat, bullet_style))
    
    story.append(Paragraph("<b>Come aggiornare lo stato di un veicolo:</b>", heading2_style))
    admin_steps = [
        "1. Apri il pannello Admin",
        "2. Trova la prenotazione nella lista",
        "3. Clicca sulla scheda per espanderla",
        "4. Clicca sul nuovo stato (es. \"In lavorazione\")",
        "5. Lo stato viene aggiornato e il cliente riceve la notifica"
    ]
    for step in admin_steps:
        story.append(Paragraph(step, bullet_style))
    
    # === 10. FAQ ===
    story.append(Paragraph("10. FAQ E SUPPORTO", heading1_style))
    
    faqs = [
        ("Posso prenotare per più veicoli?", "Sì, puoi registrare più veicoli e prenotare per ciascuno."),
        ("Posso annullare una prenotazione?", "Sì, dalla scheda della prenotazione clicca \"Annulla Prenotazione\" (solo se non ancora in lavorazione)."),
        ("Riceverò notifiche?", "Sì, riceverai aggiornamenti quando lo stato del veicolo cambia."),
        ("L'app funziona su iPhone e Android?", "Sì, funziona su entrambi tramite browser o app Expo Go."),
        ("I miei dati sono al sicuro?", "Sì, usiamo autenticazione Google e rispettiamo il GDPR."),
    ]
    
    for q, a in faqs:
        story.append(Paragraph(f"<b>D: {q}</b>", body_style))
        story.append(Paragraph(f"R: {a}", bullet_style))
        story.append(Spacer(1, 0.2*cm))
    
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph("<b>Supporto Tecnico</b>", heading2_style))
    story.append(Paragraph("📞 Telefono: 049 123 4567", body_style))
    story.append(Paragraph("📧 Email: info@autofficina-euganea.it", body_style))
    story.append(Paragraph("📍 Indirizzo: Via Example 123, Padova", body_style))
    story.append(Paragraph("🕐 Orari: Lun-Ven 8:00-18:00 | Sab 8:00-12:00", body_style))
    
    # Build PDF
    doc.build(story)
    print("PDF generato con successo: /app/AUTOFFICINA_EUGANEA_Manuale_App.pdf")

if __name__ == "__main__":
    create_pdf()
