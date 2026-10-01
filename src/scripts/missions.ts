import { t2 } from './i18n';

// One concrete practice brief per mission (6 fields x 3). Every company here is fictional and the sheet says so.
// Shape: who (practice brief tag), brief (scenario + stakes), asset (the real material to work on),
// steps (3 actions), mins (time box), bar (what strong answers do), twist (optional bonus).
export type Asset = { title: string; body: string; mono: boolean };
export type MissionX = { who: string; brief: string; asset: Asset; steps: string[]; mins: number; bar: string[]; twist: string };

const tag = (en: string, it: string) => t2('Practice brief · ' + en, 'Brief di pratica · ' + it);

export const MX: Record<string, MissionX[]> = {
  Design: [
    {
      who: tag('Lumo, a habit app (fictional)', 'Lumo, app per abitudini (fittizia)'),
      brief: t2(
        "Lumo is a habit app. Most people quit while signing up. Make signing up shorter.",
        "Lumo è un'app per le abitudini. Molti smettono mentre si registrano. Rendi la registrazione più corta."),
      asset: {
        mono: true,
        title: t2('Current onboarding · 5 screens', 'Onboarding attuale · 5 schermate'),
        body: t2(
          '1 Create account\n  email, password, confirm password · 100% start\n2 Personal info\n  birthday, phone, city · 61% go on\n3 Pick habits\n  choose 8 from a list of 40 · 38% go on\n4 Set reminders\n  one for each habit · 21% go on\n5 Invite friends\n  required to finish · 9% finish',
          '1 Crea account\n  email, password, conferma password · 100% iniziano\n2 Dati personali\n  nascita, telefono, città · 61% proseguono\n3 Scegli le abitudini\n  8 su una lista di 40 · 38% proseguono\n4 Imposta i promemoria\n  uno per ogni abitudine · 21% proseguono\n5 Invita gli amici\n  obbligatorio per finire · 9% finiscono'),
      },
      steps: [
        t2('Decide what to cut or delay. Name one thing you remove completely.', 'Decidi cosa tagliare o rimandare. Indica una cosa che togli del tutto.'),
        t2('Write your new flow in 3 screens or fewer: one line per screen.', 'Scrivi il nuovo flusso in 3 schermate o meno: una riga per schermata.'),
        t2('Write the exact button text for screen 1.', 'Scrivi il testo esatto del pulsante della schermata 1.'),
      ],
      mins: 6,
      bar: [
        t2('You cut at least two things', 'Hai tagliato almeno due cose'),
        t2('Screen 1 asks for just one thing', 'La schermata 1 chiede una cosa sola'),
        t2('The button says what happens next', 'Il pulsante dice cosa succede dopo'),
      ],
      twist: t2('Add a quick first win (under 30 seconds).', 'Aggiungi una prima vittoria veloce (sotto i 30 secondi).'),
    },
    {
      who: tag('Fjord Yoga, a studio (fictional)', 'Fjord Yoga, uno studio (fittizio)'),
      brief: t2(
        "Fjord Yoga's booking form asks too much, so people give up. Make it quick and friendly.",
        "Il modulo di prenotazione di Fjord Yoga chiede troppo e la gente rinuncia. Rendilo veloce e amichevole."),
      asset: {
        mono: true,
        title: t2('Booking form · 14 fields, one page', 'Modulo di prenotazione · 14 campi, una pagina'),
        body: t2(
          'Full name · Email · Phone\nDate of birth · Address · City · ZIP\nEmergency contact\nMedical conditions · Experience level\nHow did you hear about us?\nPreferred class · Promo code\n[ Submit ]',
          'Nome completo · Email · Telefono\nData di nascita · Indirizzo · Città · CAP\nContatto di emergenza\nCondizioni mediche · Livello di esperienza\nCome ci hai conosciuto?\nLezione preferita · Codice promo\n[ Invia ]'),
      },
      steps: [
        t2('Keep only what is needed to confirm a spot. List the fields you keep.', 'Tieni solo ciò che serve per confermare un posto. Elenca i campi che tieni.'),
        t2('Put them in the order you would ask a friend.', 'Mettili nell’ordine in cui li chiederesti a un amico.'),
        t2('Rewrite the button and one label so they sound human.', 'Riscrivi il pulsante e un’etichetta in modo che suonino umani.'),
      ],
      mins: 6,
      bar: [
        t2('The first step has 5 fields or fewer', 'Il primo passo ha al massimo 5 campi'),
        t2('Private questions come after booking', 'Le domande private vengono dopo la prenotazione'),
        t2('The button says the benefit (“Save my spot”)', 'Il pulsante dice il vantaggio (“Salva il mio posto”)'),
      ],
      twist: t2('Add one calming line under the email field.', 'Aggiungi una riga rassicurante sotto il campo email.'),
    },
    {
      who: tag('Pocket, an expenses app (fictional)', 'Pocket, app per le spese (fittizia)'),
      brief: t2(
        "Open Pocket for the first time and you see an empty screen, so people leave. Design a better first screen. Pair up, or do both parts.",
        "Aprendo Pocket per la prima volta si vede una schermata vuota e la gente se ne va. Progetta una prima schermata migliore. In coppia, o fai entrambe le parti."),
      asset: {
        mono: true,
        title: t2('What users see today', 'Cosa vedono oggi gli utenti'),
        body: t2('[ Pocket ]\n\n      No expenses\n\n            [ + ]', '[ Pocket ]\n\n     Nessuna spesa\n\n            [ + ]'),
      },
      steps: [
        t2('Describe the layout: what sits at the top, middle and bottom.', 'Descrivi il layout: cosa sta in alto, al centro e in basso.'),
        t2('Write the headline (max 7 words) and the one button.', 'Scrivi il titolo (massimo 7 parole) e l’unico pulsante.'),
        t2('Say what happens the moment they tap it.', 'Di’ cosa succede nel momento in cui lo toccano.'),
      ],
      mins: 7,
      bar: [
        t2('One clear action, not three', 'Una sola azione chiara, non tre'),
        t2('The title says what the user gets', 'Il titolo dice cosa ottiene l’utente'),
        t2('The user sees a result in 10 seconds', 'L’utente vede un risultato in 10 secondi'),
      ],
      twist: t2('Add a sample so the screen is never empty.', 'Aggiungi un esempio così lo schermo non è mai vuoto.'),
    },
  ],

  Writing: [
    {
      who: tag('The Weekly Wallet, a newsletter (fictional)', 'The Weekly Wallet, una newsletter (fittizia)'),
      brief: t2(
        "Readers say they can't follow this paragraph. Rewrite it so a 15-year-old gets it.",
        "I lettori dicono di non capire questo paragrafo. Riscrivilo in modo che lo capisca un quindicenne."),
      asset: {
        mono: false,
        title: t2('Paragraph from issue #48', 'Paragrafo dal numero 48'),
        body: t2(
          'When households expect prices to keep rising, they demand higher wages now, and firms raise prices to cover those wages. The expectation pushes inflation up, which confirms the expectation. Central banks therefore treat inflation expectations as a variable they must anchor.',
          'Quando le famiglie si aspettano che i prezzi continuino a salire, chiedono subito salari più alti, e le imprese alzano i prezzi per coprirli. L’aspettativa spinge l’inflazione in alto, il che conferma l’aspettativa. Le banche centrali trattano perciò le aspettative di inflazione come una variabile da ancorare.'),
      },
      steps: [
        t2('Write the idea in one sentence a friend would say out loud.', 'Scrivi l’idea in una frase che un amico direbbe a voce.'),
        t2('Rewrite the paragraph in 60 words or fewer.', 'Riscrivi il paragrafo in 60 parole o meno.'),
        t2('Add a headline that makes someone want to read it.', 'Aggiungi un titolo che faccia venire voglia di leggere.'),
      ],
      mins: 7,
      bar: [
        t2('No word a 15-year-old has to look up', 'Nessuna parola che un quindicenne deve cercare'),
        t2('One everyday example (a price, a bus ticket)', 'Un esempio di tutti i giorni (un prezzo, un biglietto)'),
        t2('The title promises something', 'Il titolo promette qualcosa'),
      ],
      twist: t2('Say it in exactly 20 words.', 'Dillo in esattamente 20 parole.'),
    },
    {
      who: tag('an office team (fictional)', 'un team d’ufficio (fittizio)'),
      brief: t2(
        "Nobody acted on this email. Rewrite it so people do the task today.",
        "Nessuno ha fatto nulla dopo questa email. Riscrivila così che le persone agiscano oggi."),
      asset: {
        mono: false,
        title: t2('Email · Subject: Important update re: expenses', 'Email · Oggetto: Aggiornamento importante su spese'),
        body: t2(
          'Hi all, following on from the last finance sync and in line with the updated policy, please note that going forward expense submissions may need to be reviewed more carefully, so it would be great if everyone could try to be mindful of the new process, which will be rolled out at some point in the next few weeks, details TBC. The deadline for September claims is the 28th, but if you’ve already sent them that’s fine. Thanks!',
          'Ciao a tutti, facendo seguito all’ultimo incontro con la finanza e in linea con la policy aggiornata, si segnala che d’ora in poi le note spese potrebbero dover essere riviste con più attenzione, quindi sarebbe ottimo se tutti cercassero di tenere presente il nuovo processo, che sarà introdotto in qualche momento nelle prossime settimane, dettagli da definire. La scadenza per le richieste di settembre è il 28, ma se le avete già inviate va bene. Grazie!'),
      },
      steps: [
        t2('Find the one thing people must do, and the date.', 'Trova l’unica cosa che le persone devono fare, e la data.'),
        t2('Rewrite the email in 50 words or fewer.', 'Riscrivi l’email in 50 parole o meno.'),
        t2('Write a subject line that says what to do.', 'Scrivi un oggetto che dica cosa fare.'),
      ],
      mins: 6,
      bar: [
        t2('The task and the date are in the first two lines', 'Il compito e la data sono nelle prime due righe'),
        t2('No vague words like “be mindful”', 'Niente parole vaghe come “tenere presente”'),
        t2('The subject line works alone in a notification', 'L’oggetto funziona da solo in una notifica'),
      ],
      twist: t2('Cut it to 25 words.', 'Riducila a 25 parole.'),
    },
    {
      who: tag('The Platform 9 zine (fictional)', 'La zine Platform 9 (fittizia)'),
      brief: t2(
        "A zine starts a story with this line. Finish it in 5 sentences. Take turns with a friend, or do it alone.",
        "Una zine inizia un racconto con questa riga. Finiscilo in 5 frasi. A turno con un amico, o da solo."),
      asset: {
        mono: false,
        title: t2('First line', 'Prima riga'),
        body: t2('The vending machine on platform 9 had been taking requests for a week before anyone noticed.', 'Il distributore automatico al binario 9 accettava richieste da una settimana prima che qualcuno se ne accorgesse.'),
      },
      steps: [
        t2('Write sentence 2: add something strange but specific.', 'Scrivi la frase 2: aggiungi qualcosa di strano ma preciso.'),
        t2('Write sentences 3 and 4, taking turns or both yourself.', 'Scrivi le frasi 3 e 4, a turno o tutte e due tu.'),
        t2('Write the last sentence in exactly 5 words.', 'Scrivi l’ultima frase in esattamente 5 parole.'),
      ],
      mins: 7,
      bar: [
        t2('Every sentence adds something new', 'Ogni frase aggiunge qualcosa di nuovo'),
        t2('You can picture the scene', 'Si riesce a vedere la scena'),
        t2('The last line surprises or closes the story', 'L’ultima riga sorprende o chiude la storia'),
      ],
      twist: t2('Give it a title of 3 words.', 'Dagli un titolo di 3 parole.'),
    },
  ],

  Code: [
    {
      who: tag('Linkly, a link tool (fictional)', 'Linkly, uno strumento per link (fittizio)'),
      brief: t2(
        "The “Copy link” button on Linkly does nothing. Find the mistake and fix it.",
        "Il pulsante “Copia link” di Linkly non fa nulla. Trova l'errore e correggilo."),
      asset: {
        mono: true,
        title: t2('share.html + share.js', 'share.html + share.js'),
        body: t2(
          '<button id="copy-btn">Copy link</button>\n<span id="msg"></span>\n\nconst btn = document.getElementById(\'copyBtn\');\nbtn.addEventListener(\'click\', copyLink());\n\nfunction copyLink() {\n  navigator.clipboard.writeText(window.location.href);\n  document.getElementById(\'msg\').textContent = \'Copied!\';\n}',
          '<button id="copy-btn">Copia link</button>\n<span id="msg"></span>\n\nconst btn = document.getElementById(\'copyBtn\');\nbtn.addEventListener(\'click\', copyLink());\n\nfunction copyLink() {\n  navigator.clipboard.writeText(window.location.href);\n  document.getElementById(\'msg\').textContent = \'Copiato!\';\n}'),
      },
      steps: [
        t2('Read it top to bottom. Find every line that could stop the click.', 'Leggilo dall’alto in basso. Trova ogni riga che può bloccare il click.'),
        t2('Write the corrected lines.', 'Scrivi le righe corrette.'),
        t2('Explain in one sentence why it failed, as if to a teammate.', 'Spiega in una frase perché non funzionava, come a un collega.'),
      ],
      mins: 8,
      bar: [
        t2('You found the wrong name and the early call', 'Hai trovato il nome sbagliato e la chiamata anticipata'),
        t2('Your fix passes the function without calling it', 'La tua correzione passa la funzione senza chiamarla'),
        t2('You explain why, not only what', 'Spieghi perché, non solo cosa'),
      ],
      twist: t2('Show “Copy failed” if copying fails.', 'Mostra “Copia fallita” se la copia non riesce.'),
    },
    {
      who: tag('a restaurant app (fictional)', 'un’app per ristoranti (fittizia)'),
      brief: t2(
        "Write a small function that splits a restaurant bill between friends, tip included.",
        "Scrivi una piccola funzione che divide il conto del ristorante tra amici, mancia inclusa."),
      asset: {
        mono: true,
        title: t2('Tests your function must pass', 'Test che la tua funzione deve superare'),
        body: t2(
          'split(80, 4, 10)    -> 22.00\nsplit(45.5, 3, 0)   -> 15.17\nsplit(100, 2, 15)   -> 57.50\nsplit(60, 0, 10)    -> ??? (you decide)\n\nsplit(total, people, tipPercent)',
          'split(80, 4, 10)    -> 22.00\nsplit(45.5, 3, 0)   -> 15.17\nsplit(100, 2, 15)   -> 57.50\nsplit(60, 0, 10)    -> ??? (decidi tu)\n\nsplit(totale, persone, manciaPercento)'),
      },
      steps: [
        t2('Write the function so the first three tests pass.', 'Scrivi la funzione in modo che i primi tre test passino.'),
        t2('Decide what happens with 0 people and write that rule in a comment.', 'Decidi cosa succede con 0 persone e scrivi la regola in un commento.'),
        t2('Say how you would test it, in one line.', 'Di’ come la testeresti, in una riga.'),
      ],
      mins: 8,
      bar: [
        t2('The tip is added before dividing', 'La mancia è aggiunta prima di dividere'),
        t2('Results have 2 decimals', 'I risultati hanno 2 decimali'),
        t2('You handled 0 people on purpose', 'Hai gestito 0 persone di proposito'),
      ],
      twist: t2('Round each share up to the next euro.', 'Arrotonda ogni quota all’euro successivo.'),
    },
    {
      who: tag('Noctis, a notes app (fictional)', 'Noctis, app per appunti (fittizia)'),
      brief: t2(
        "Build a dark mode button that remembers your choice. With a friend: one does the look, one does the code.",
        "Crea un pulsante per la modalità scura che ricordi la scelta. Con un amico: uno fa l'aspetto, uno il codice."),
      asset: {
        mono: true,
        title: t2('The spec', 'Le specifiche'),
        body: t2(
          '1  A button, top right: “Dark”\n2  Click: the page switches between light and dark colors\n3  Refresh: the choice is still there\n4  If the user never chose: follow the phone’s setting',
          '1  Un pulsante in alto a destra: “Scuro”\n2  Click: la pagina passa tra colori chiari e scuri\n3  Aggiornamento: la scelta resta\n4  Se l’utente non ha mai scelto: segui l’impostazione del telefono'),
      },
      steps: [
        t2('List the CSS variables you will change (at least 3).', 'Elenca le variabili CSS che cambi (almeno 3).'),
        t2('Write the JS that switches the theme and saves the choice.', 'Scrivi il JS che cambia tema e salva la scelta.'),
        t2('Write the line that reads the saved choice when the page loads.', 'Scrivi la riga che legge la scelta salvata quando la pagina si carica.'),
      ],
      mins: 9,
      bar: [
        t2('Colours live in variables', 'I colori stanno in variabili'),
        t2('The choice is saved and read back', 'La scelta è salvata e riletta'),
        t2('With nothing saved, it follows the phone', 'Se non c’è nulla di salvato, segue il telefono'),
      ],
      twist: t2('Stop the white flash when it loads in dark mode.', 'Evita il lampo bianco al caricamento in modalità scura.'),
    },
  ],

  Video: [
    {
      who: tag('Forno Rossi, a bakery (fictional)', 'Forno Rossi, un forno (fittizio)'),
      brief: t2(
        "A bakery filmed 12 clips. Pick the best ones for a 20-second video that grabs attention fast.",
        "Un forno ha girato 12 clip. Scegli le migliori per un video di 20 secondi che catturi subito l'attenzione."),
      asset: {
        mono: true,
        title: t2('Footage log · 12 clips', 'Registro del girato · 12 clip'),
        body: t2(
          '01 · 4s  Sign flips to OPEN\n02 · 6s  Wide shot, shop empty\n03 · 3s  Flour cloud in window light\n04 · 5s  Owner laughing at a burnt tray\n05 · 8s  Hands shaping dough\n06 · 4s  Price board\n07 · 5s  Croissant tearing open, steam\n08 · 6s  Line of customers outside\n09 · 3s  Cash register close-up\n10 · 4s  Kid pointing at the glass\n11 · 7s  Oven door opens, glow\n12 · 5s  Owner bows: “Buongiorno”',
          '01 · 4s  Il cartello passa a APERTO\n02 · 6s  Campo largo, negozio vuoto\n03 · 3s  Nuvola di farina nella luce\n04 · 5s  Il titolare ride di una teglia bruciata\n05 · 8s  Mani che modellano l’impasto\n06 · 4s  Lavagna dei prezzi\n07 · 5s  Un cornetto si apre, vapore\n08 · 6s  Coda di clienti fuori\n09 · 3s  Primo piano della cassa\n10 · 4s  Un bimbo indica la vetrina\n11 · 7s  Si apre il forno, bagliore\n12 · 5s  Il titolare si inchina: “Buongiorno”'),
      },
      steps: [
        t2('Pick 5 or 6 clips, in order. Total under 20 seconds.', 'Scegli 5 o 6 clip, in ordine. Totale sotto i 20 secondi.'),
        t2('Name the opening clip and say why it stops the scroll.', 'Indica la clip di apertura e di’ perché ferma lo scroll.'),
        t2('Write the 6-word caption.', 'Scrivi la didascalia di 6 parole.'),
      ],
      mins: 7,
      bar: [
        t2('It opens on an action or a surprise', 'Apre su un’azione o una sorpresa'),
        t2('Every clip moves the story forward', 'Ogni clip fa avanzare la storia'),
        t2('The caption adds something new', 'La didascalia aggiunge qualcosa di nuovo'),
      ],
      twist: t2('Name the clip you cut even though you love it.', 'Indica la clip che tagli anche se ti piace.'),
    },
    {
      who: tag('a 30-second explainer', 'una spiegazione di 30 secondi'),
      brief: t2(
        "Pick something you know well. Plan a 30-second video that teaches it. You only write, nobody sees your face.",
        "Scegli qualcosa che conosci bene. Pianifica un video di 30 secondi che lo insegni. Scrivi soltanto, nessuno vede la tua faccia."),
      asset: {
        mono: true,
        title: t2('A structure that works', 'Una struttura che funziona'),
        body: t2(
          '0-3s    Hook   a question or a surprise\n3-10s   Claim  the one thing to remember\n10-25s  Show   one example, on screen\n25-30s  Close  a line people repeat',
          '0-3s    Aggancio   una domanda o una sorpresa\n3-10s   Tesi       l’unica cosa da ricordare\n10-25s  Mostra     un esempio, sullo schermo\n25-30s  Chiusa     una frase che la gente ripete'),
      },
      steps: [
        t2('Write the topic and the hook line (max 10 words).', 'Scrivi l’argomento e la riga di aggancio (massimo 10 parole).'),
        t2('Write 6 lines of script, each with what is on screen.', 'Scrivi 6 righe di copione, ciascuna con ciò che si vede.'),
        t2('Write the closing line.', 'Scrivi la riga di chiusura.'),
      ],
      mins: 8,
      bar: [
        t2('The first line is a question or a surprise', 'La prima riga è una domanda o una sorpresa'),
        t2('There is only one idea', 'C’è una sola idea'),
        t2('Every line has a matching shot', 'Ogni riga ha la sua inquadratura'),
      ],
      twist: t2('Do it with no talking, only text and cuts.', 'Fallo senza parlare, solo testo e stacchi.'),
    },
    {
      who: tag('Vale water bottles (fictional)', 'Vale, borracce (fittizie)'),
      brief: t2(
        "A bottle brand needs a 15-second video. Pick the shots and the sound. Pair up, or do both parts.",
        "Un marchio di borracce vuole un video di 15 secondi. Scegli inquadrature e suono. In coppia, o fai entrambe le parti."),
      asset: {
        mono: true,
        title: t2('Shots you can use', 'Inquadrature disponibili'),
        body: t2(
          'A  Bottle on a desk, morning light\nB  Hand twisting the cap\nC  Water pouring, slow motion\nD  Bottle in a backpack side pocket\nE  Drop test on concrete\nF  Logo close-up',
          'A  Borraccia su una scrivania, luce del mattino\nB  Mano che gira il tappo\nC  Acqua che scorre, rallentatore\nD  Borraccia nella tasca laterale dello zaino\nE  Prova di caduta sul cemento\nF  Primo piano del logo'),
      },
      steps: [
        t2('Pick 4 shots and put them in order.', 'Scegli 4 inquadrature e mettile in ordine.'),
        t2('Choose the hero shot, the one people will remember.', 'Scegli l’inquadratura protagonista, quella che la gente ricorderà.'),
        t2('Describe the sound: music, silence or effects.', 'Descrivi il suono: musica, silenzio o effetti.'),
      ],
      mins: 7,
      bar: [
        t2('You open on the star shot or just before it', 'Apri sull’inquadratura protagonista o poco prima'),
        t2('The order tells a mini story', 'L’ordine racconta una mini storia'),
        t2('The logo shows once, at the end', 'Il logo compare una volta, alla fine'),
      ],
      twist: t2('Write the on-screen slogan in 4 words.', 'Scrivi lo slogan sullo schermo in 4 parole.'),
    },
  ],

  Selling: [
    {
      who: tag('Forno Rossi, a bakery (fictional)', 'Forno Rossi, un forno (fittizio)'),
      brief: t2(
        "A bakery sells a €12 box of pastries. Convince Marta, who runs a coworking, to buy one.",
        "Un forno vende una box di pasticcini da 12 €. Convinci Marta, che gestisce un coworking, a comprarne una."),
      asset: {
        mono: false,
        title: t2('Who you are pitching', 'A chi stai parlando'),
        body: t2(
          'Marta runs a coworking. She offers coffee but nothing sweet. Budget: small. Her objection: “We already have a café next door.”',
          'Marta gestisce un coworking. Offre caffè ma niente di dolce. Budget: piccolo. La sua obiezione: “Abbiamo già un bar qui accanto.”'),
      },
      steps: [
        t2('Open with her problem, not with the box (one sentence).', 'Apri con il suo problema, non con la box (una frase).'),
        t2('Write the pitch in 4 lines, with the price.', 'Scrivi la proposta in 4 righe, con il prezzo.'),
        t2('Write the closing question and your answer to the café.', 'Scrivi la domanda di chiusura e la tua risposta sul bar.'),
      ],
      mins: 7,
      bar: [
        t2('The first line is about Marta', 'La prima riga parla di Marta'),
        t2('The offer is clear: what, when, how much', 'L’offerta è chiara: cosa, quando, quanto'),
        t2('You end with an easy question', 'Chiudi con una domanda facile'),
      ],
      twist: t2('Add a promise: “If nobody eats them, we take them back.”', 'Aggiungi una promessa: “Se nessuno li mangia, li riprendiamo.”'),
    },
    {
      who: tag('a cold message', 'un messaggio a freddo'),
      brief: t2(
        "Dana gets 30 messages a week and ignores most. Write one she will answer.",
        "Dana riceve 30 messaggi a settimana e ne ignora quasi tutti. Scrivine uno a cui risponde."),
      asset: {
        mono: false,
        title: t2('Three messages Dana ignored', 'Tre messaggi che Dana ha ignorato'),
        body: t2(
          '1  “Hi! I’d love to connect and pick your brain.”\n2  “We help studios like yours scale with innovative solutions.”\n3  “Can we hop on a call this week? Here’s my calendar.”',
          '1  “Ciao! Mi piacerebbe connetterci e chiederti un consiglio.”\n2  “Aiutiamo studi come il tuo a crescere con soluzioni innovative.”\n3  “Facciamo una call questa settimana? Ecco il mio calendario.”'),
      },
      steps: [
        t2('Find what made all three fail, in one line.', 'Trova cosa li ha fatti fallire tutti, in una riga.'),
        t2('Write your message in 50 words or fewer.', 'Scrivi il tuo messaggio in 50 parole o meno.'),
        t2('Write a subject line of 6 words or fewer.', 'Scrivi un oggetto di 6 parole o meno.'),
      ],
      mins: 6,
      bar: [
        t2('A detail shows you saw her work', 'Un dettaglio mostra che hai visto il suo lavoro'),
        t2('You ask for something tiny', 'Chiedi una cosa minuscola'),
        t2('It reads well on a phone', 'Si legge bene su un telefono'),
      ],
      twist: t2('Write a 20-word follow-up for 3 days later.', 'Scrivi un promemoria di 20 parole per 3 giorni dopo.'),
    },
    {
      who: tag('Orbit headphones (fictional)', 'Orbit, cuffie (fittizie)'),
      brief: t2(
        "You sell headphones and the buyer pushes back. Answer 3 objections. Alone? Play both roles.",
        "Vendi cuffie e l'acquirente si oppone. Rispondi a 3 obiezioni. Da solo? Fai entrambi i ruoli."),
      asset: {
        mono: false,
        title: t2('Objection cards', 'Carte delle obiezioni'),
        body: t2(
          '1  “It’s too expensive.”\n2  “I already have headphones.”\n3  “I’ll think about it.”',
          '1  “Costa troppo.”\n2  “Ho già delle cuffie.”\n3  “Ci penso.”'),
      },
      steps: [
        t2('Answer objection 1 with a question, not a defense.', 'Rispondi all’obiezione 1 con una domanda, non con una difesa.'),
        t2('Answer objection 2 by finding what their headphones don’t do.', 'Rispondi all’obiezione 2 trovando cosa non fanno le loro cuffie.'),
        t2('Answer objection 3 and ask for one concrete next step.', 'Rispondi all’obiezione 3 e chiedi un prossimo passo concreto.'),
      ],
      mins: 7,
      bar: [
        t2('Each answer starts by agreeing or asking', 'Ogni risposta inizia accordandosi o chiedendo'),
        t2('You never drop the price first', 'Non abbassi mai il prezzo per primo'),
        t2('The last answer ends with a small next step', 'L’ultima risposta finisce con un piccolo passo'),
      ],
      twist: t2('Write one line that makes the buyer smile.', 'Scrivi una riga che faccia sorridere l’acquirente.'),
    },
  ],

  Music: [
    {
      who: tag('Nero Coffee Roasters (fictional)', 'Nero Coffee Roasters (fittizia)'),
      brief: t2(
        "A coffee brand wants a 6-second sound for when the coffee is ready: warm, slow, like Sunday.",
        "Un marchio di caffè vuole un suono di 6 secondi per quando il caffè è pronto: caldo, lento, come la domenica."),
      asset: {
        mono: true,
        title: t2('Brief', 'Brief'),
        body: t2(
          'Words   warm · slow · Sunday\nLength  6 seconds\nNotes   3 or 4 notes, one instrument\nAvoid   anything that sounds like a phone alert',
          'Parole  caldo · lento · domenica\nDurata  6 secondi\nNote    3 o 4 note, uno strumento\nEvita   tutto ciò che suona come un avviso del telefono'),
      },
      steps: [
        t2('Choose the instrument and the tempo.', 'Scegli lo strumento e il tempo.'),
        t2('Write the notes (letters like C E G, or up and down arrows).', 'Scrivi le note (lettere come DO MI SOL, o frecce su e giù).'),
        t2('Describe how it starts and how it ends.', 'Descrivi come inizia e come finisce.'),
      ],
      mins: 7,
      bar: [
        t2('Your notes fit the three words', 'Le tue note rispettano le tre parole'),
        t2('It ends on a note that feels finished', 'Finisce su una nota che sembra conclusa'),
        t2('It does not sound like a phone alert', 'Non suona come un avviso del telefono'),
      ],
      twist: t2('Name the sound in two words.', 'Dai un nome al suono in due parole.'),
    },
    {
      who: tag('your remix card', 'la tua carta del remix'),
      brief: t2(
        "Pick a song you love and plan a remix on one card: keep one thing, change two, add one, drop one.",
        "Scegli una canzone che ami e pianifica un remix su una carta: tieni una cosa, cambiane due, aggiungine una, togline una."),
      asset: {
        mono: true,
        title: t2('Remix card · example with “Happy Birthday”', 'Carta del remix · esempio con “Tanti auguri a te”'),
        body: t2(
          'Keep    the melody\nChange  slow it to 70 bpm · minor key\nAdd     a low, warm piano\nDrop    the clapping and the singing\nResult  a quiet, 30-second lullaby',
          'Tieni     la melodia\nCambia    rallenta a 70 bpm · tonalità minore\nAggiungi  un pianoforte caldo e grave\nTogli     battiti di mani e voce\nRisultato una ninna nanna di 30 secondi'),
      },
      steps: [
        t2('Name the song and the feeling you want the remix to give.', 'Scrivi la canzone e la sensazione che vuoi dare al remix.'),
        t2('Fill your own card: keep, change (two things), add, drop.', 'Compila la tua carta: tieni, cambia (due cose), aggiungi, togli.'),
        t2('Write the result in one sentence, like the example.', 'Scrivi il risultato in una frase, come nell’esempio.'),
      ],
      mins: 7,
      bar: [
        t2('You keep one thing people recognise', 'Tieni una cosa che la gente riconosce'),
        t2('All your changes point to one feeling', 'Tutte le modifiche puntano a una sensazione'),
        t2('The result makes someone want to listen', 'Il risultato fa venire voglia di ascoltare'),
      ],
      twist: t2('Give the remix a title that promises the feeling.', 'Dai al remix un titolo che prometta la sensazione.'),
    },
    {
      who: tag('Kite sneakers (fictional)', 'Kite, sneaker (fittizie)'),
      brief: t2(
        "A sneaker brand needs a catchy 15-second tune. Write the melody and a few words. Pair up, or do both.",
        "Un marchio di sneaker vuole un motivo orecchiabile di 15 secondi. Scrivi melodia e poche parole. In coppia, o fai entrambe."),
      asset: {
        mono: true,
        title: t2('Chords (loop) and brief', 'Accordi (in loop) e brief'),
        body: t2(
          'Chords  C  G  Am  F   (repeat)\nMood    fast, light, sunny\nWords   6 at most, one idea: “move”',
          'Accordi  DO  SOL  LAm  FA   (ripeti)\nClima    veloce, leggero, solare\nParole   al massimo 6, un’idea: “muoviti”'),
      },
      steps: [
        t2('Write the melody over the first two chords (notes or ups and downs).', 'Scrivi la melodia sui primi due accordi (note o salite e discese).'),
        t2('Write the lyric: 6 words or fewer.', 'Scrivi il testo: 6 parole o meno.'),
        t2('Say which word lands on the loudest beat.', 'Di’ quale parola cade sul battito più forte.'),
      ],
      mins: 8,
      bar: [
        t2('The melody repeats enough to remember', 'La melodia si ripete abbastanza da ricordarla'),
        t2('Each word has a note you can feel', 'Ogni parola ha una nota che si sente'),
        t2('The loudest beat lands on the key word', 'Il battito più forte cade sulla parola chiave'),
      ],
      twist: t2('Write a slower, sadder version.', 'Scrivi una versione più lenta e triste.'),
    },
  ],
};
