import { t2 } from './i18n';

// One concrete practice brief per mission (6 fields x 6, in rounds of 3). Every company here is fictional and the sheet says so.
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
    {
      who: tag('Cairn, a hiking app (fictional)', 'Cairn, app per escursioni (fittizia)'),
      brief: t2(
        "Cairn is a hiking app. When the signal drops, hikers see this screen and panic. Rewrite it so it calms them and tells them what to do.",
        "Cairn è un’app per escursioni. Quando cade il segnale, gli escursionisti vedono questa schermata e vanno in ansia. Riscrivila in modo che li calmi e dica cosa fare."),
      asset: {
        mono: true,
        title: t2('Error screen today + what is true', 'Schermata di errore oggi + cosa è vero'),
        body: t2(
          '[!] ERROR 0x80072EE7\nNETWORK_UNREACHABLE\nYou have been disconnected. The request could not be completed. Please try again later.\n[ OK ]\n\nWhat is true right now\n- Saved maps still work\n- Your track keeps recording\n- Weather and trail reports need signal\n- Cairn retries by itself every 30 seconds',
          '[!] ERRORE 0x80072EE7\nNETWORK_UNREACHABLE\nLa tua connessione è stata interrotta. La richiesta non può essere completata. Riprova più tardi.\n[ OK ]\n\nCosa è vero in questo momento\n- Le mappe salvate funzionano\n- Il tuo percorso continua a registrarsi\n- Meteo e segnalazioni sentieri richiedono segnale\n- Cairn riprova da solo ogni 30 secondi'),
      },
      steps: [
        t2('Name 3 things that are wrong with this message.', 'Indica 3 cose che non vanno in questo messaggio.'),
        t2('Rewrite the screen: a title (max 6 words), one calm sentence, one button.', 'Riscrivi la schermata: un titolo (massimo 6 parole), una frase calma, un pulsante.'),
        t2('Add one line that tells hikers what still works.', 'Aggiungi una riga che dica a chi cammina cosa funziona ancora.'),
      ],
      mins: 6,
      bar: [
        t2('No code or jargon in what the hiker reads', 'Nessun codice o gergo in ciò che legge chi cammina'),
        t2('It says what still works, so nobody panics', 'Dice cosa funziona ancora, così nessuno va in ansia'),
        t2('The button says what it does, not “OK”', 'Il pulsante dice cosa fa, non “OK”'),
      ],
      twist: t2('Turn it into a small banner that does not cover the map.', 'Trasformala in un piccolo banner che non copra la mappa.'),
    },
    {
      who: tag('Topout, a climbing log (fictional)', 'Topout, diario di arrampicata (fittizio)'),
      brief: t2(
        "Topout is a climbing log. At the end of the month, climbers want a card to post. Design one from Sam’s numbers.",
        "Topout è un diario di arrampicata. A fine mese gli arrampicatori vogliono una card da pubblicare. Progettane una con i numeri di Sam."),
      asset: {
        mono: true,
        title: t2('Sam’s month + the card rules', 'Il mese di Sam + le regole della card'),
        body: t2(
          'Sessions       14\nClimbs sent    52\nHardest send   V5 (first time, on the 23rd)\nFalls          31\nBest day       Thursday\nStreak         3 weeks in a row\n\nRules\n- Square card, seen as a small thumbnail in a feed\n- One hero fact, at most 2 supporting facts\n- Brand name “Topout” once, small\n- One line of text, 6 words or fewer',
          'Sessioni       14\nVie chiuse     52\nPiù difficile  V5 (prima volta, il 23)\nCadute         31\nGiorno top     giovedì\nSerie          3 settimane di fila\n\nRegole\n- Card quadrata, vista come miniatura in un feed\n- Un dato protagonista, al massimo 2 di supporto\n- Nome “Topout” una volta, piccolo\n- Una riga di testo, 6 parole o meno'),
      },
      steps: [
        t2('Pick your hero fact and say why it beats the others.', 'Scegli il tuo dato protagonista e di’ perché batte gli altri.'),
        t2('Describe the card: where the hero sits, where the small facts go, and the 2 colours.', 'Descrivi la card: dove sta il dato protagonista, dove vanno i dati piccoli e i 2 colori.'),
        t2('Write the line on the card (6 words or fewer).', 'Scrivi la riga sulla card (6 parole o meno).'),
      ],
      mins: 7,
      bar: [
        t2('One thing is clearly the biggest', 'Una cosa è chiaramente la più grande'),
        t2('You left out at least three facts on purpose', 'Hai lasciato fuori almeno tre dati di proposito'),
        t2('The line adds feeling, it does not repeat a number', 'La riga aggiunge emozione, non ripete un numero'),
      ],
      twist: t2('Design a second card for a month with only 2 sessions that still feels proud.', 'Progetta una seconda card per un mese con solo 2 sessioni che sia comunque motivo di orgoglio.'),
    },
    {
      who: tag('Pine & Page, an online bookshop (fictional)', 'Pine & Page, libreria online (fittizia)'),
      brief: t2(
        "Pine & Page is an online bookshop. 6 in 10 shoppers quit at the shipping step. One person arranges the checkout screen, one writes its words. Pair up, or do both parts.",
        "Pine & Page è una libreria online. 6 acquirenti su 10 mollano alla fase della spedizione. Uno dispone la schermata di checkout, uno ne scrive le parole. In coppia, o fai entrambe le parti."),
      asset: {
        mono: true,
        title: t2('Checkout blocks (unordered) + what we know', 'Blocchi del checkout (in disordine) + cosa sappiamo'),
        body: t2(
          'A  Order summary: 3 books, €38.40\nB  Delivery address\nC  Shipping: Standard €4.90 · Express €9.90 · Pickup free\nD  Promo code box\nE  Payment: card or wallet\nF  Gift message (optional)\nG  [ Place order ] button\nH  Returns: free within 30 days\n\nKnown today\n- Shipping cost only appears on the last step\n- Shoppers say “the total jumped”\n- Most people have no promo code',
          'A  Riepilogo ordine: 3 libri, 38,40 €\nB  Indirizzo di consegna\nC  Spedizione: Standard 4,90 € · Express 9,90 € · Ritiro gratis\nD  Campo codice promo\nE  Pagamento: carta o wallet\nF  Messaggio regalo (facoltativo)\nG  Pulsante [ Conferma ordine ]\nH  Resi: gratis entro 30 giorni\n\nCosa sappiamo oggi\n- Il costo di spedizione compare solo all’ultimo passo\n- Gli acquirenti dicono “il totale è salito”\n- La maggior parte non ha un codice promo'),
      },
      steps: [
        t2('Layout: put the 8 blocks in order, top to bottom, and say which one you hide or shrink.', 'Layout: metti gli 8 blocchi in ordine, dall’alto in basso, e di’ quale nascondi o riduci.'),
        t2('Words: write the button text, one shipping line and one line that reassures.', 'Parole: scrivi il testo del pulsante, una riga sulla spedizione e una riga che rassicura.'),
        t2('Read the screen out loud as a shopper. Fix the first thing that makes you hesitate.', 'Leggi la schermata ad alta voce come un acquirente. Correggi la prima cosa che ti fa esitare.'),
      ],
      mins: 8,
      bar: [
        t2('The total with shipping is visible before the button', 'Il totale con la spedizione si vede prima del pulsante'),
        t2('The promo box is small or hidden', 'Il campo promo è piccolo o nascosto'),
        t2('The button says the action and the amount', 'Il pulsante dice l’azione e l’importo'),
      ],
      twist: t2('Add one line that promises a delivery day.', 'Aggiungi una riga che prometta un giorno di consegna.'),
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
    {
      who: tag('Hearthwick, a candle shop (fictional)', 'Hearthwick, un negozio di candele (fittizio)'),
      brief: t2(
        "Hearthwick sells hand-poured candles. This page gets 400 visits a week and 2 sales. Rewrite it so a stranger wants one.",
        "Hearthwick vende candele fatte a mano. Questa pagina ha 400 visite a settimana e 2 vendite. Riscrivila in modo che uno sconosciuto ne voglia una."),
      asset: {
        mono: false,
        title: t2('Product page · “Cedar Night” candle', 'Scheda prodotto · candela “Cedar Night”'),
        body: t2(
          'CEDAR NIGHT · €24\nA premium, luxury, artisanal candle crafted with passion from the finest high-quality ingredients. Experience the ultimate in relaxation and ambiance. Perfect for any occasion! Our unique blend of scents will transform your space.\n\nMaker’s notes: smells of cedar, a little smoke, dry vanilla · burns 45 hours (about 3 weeks of evenings) · poured by hand in a 220 g glass jar · soy wax, cotton wick, no dye',
          'CEDAR NIGHT · 24 €\nUna candela artigianale premium e di lusso, creata con passione dai migliori ingredienti di alta qualità. Vivi il massimo del relax e dell’atmosfera. Perfetta per ogni occasione! La nostra esclusiva miscela di profumi trasformerà il tuo spazio.\n\nAppunti di chi la fa: profuma di cedro, un po’ di fumo, vaniglia secca · brucia 45 ore (circa 3 settimane di sere) · colata a mano in un vasetto di vetro da 220 g · cera di soia, stoppino di cotone, senza coloranti'),
      },
      steps: [
        t2('Cross out every empty word. List the 2 facts you will keep.', 'Cancella ogni parola vuota. Elenca i 2 fatti che terrai.'),
        t2('Write the new description in 40 words or fewer: show one moment, not a list.', 'Scrivi la nuova descrizione in 40 parole o meno: mostra un momento, non un elenco.'),
        t2('Write a headline of 6 words or fewer and the button text.', 'Scrivi un titolo di 6 parole o meno e il testo del pulsante.'),
      ],
      mins: 6,
      bar: [
        t2('No empty word is left (“premium”, “ultimate”, “perfect”)', 'Non resta nessuna parola vuota (“premium”, “massimo”, “perfetta”)'),
        t2('At least two facts from the notes, in plain words', 'Almeno due fatti dagli appunti, in parole semplici'),
        t2('A stranger can picture a moment with the candle', 'Uno sconosciuto riesce a immaginare un momento con la candela'),
      ],
      twist: t2('Add one honest line about who should not buy it.', 'Aggiungi una riga onesta su chi non dovrebbe comprarla.'),
    },
    {
      who: tag('Night Owl Talks, an evening event (fictional)', 'Night Owl Talks, una serata di interventi (fittizia)'),
      brief: t2(
        "At Night Owl Talks the host has 15 seconds to introduce each speaker. Write the intro they will say out loud, using only 3 of the 9 facts.",
        "Alle serate Night Owl Talks chi presenta ha 15 secondi per introdurre ogni ospite. Scrivi la presentazione che dirà a voce, usando solo 3 dei 9 fatti."),
      asset: {
        mono: true,
        title: t2('Speaker sheet · Ines Varga', 'Scheda dell’ospite · Ines Varga'),
        body: t2(
          'Talk   “What a city can learn from bees”\nRules  40 words max · said out loud · end on her name\n\nFacts\n1 keeps bees for 11 years\n2 40 hives, all on city rooftops\n3 started at 19, when a swarm landed on her balcony and stayed all night\n4 degree in accounting (never used)\n5 teaches a free class for kids every Saturday\n6 owns two cats\n7 one hive gave 60 kg of honey in a single summer\n8 favourite tool: a goose feather, to brush bees off the comb\n9 cycles 20 km a day between hives',
          'Titolo   “Cosa può imparare una città dalle api”\nRegole   40 parole al massimo · da dire a voce · chiudi con il suo nome\n\nFatti\n1 tiene api da 11 anni\n2 40 arnie, tutte sui tetti della città\n3 ha iniziato a 19 anni, quando uno sciame si è posato sul suo balcone ed è rimasto tutta la notte\n4 laurea in contabilità (mai usata)\n5 tiene ogni sabato un corso gratuito per bambini\n6 ha due gatti\n7 un’arnia ha dato 60 kg di miele in una sola estate\n8 attrezzo preferito: una piuma d’oca, per spazzolare via le api dal favo\n9 pedala 20 km al giorno tra un’arnia e l’altra'),
      },
      steps: [
        t2('Choose 3 facts and cross out the other 6. Write one line on why.', 'Scegli 3 fatti e cancella gli altri 6. Scrivi una riga sul perché.'),
        t2('Write the intro in 40 words or fewer, to be said out loud.', 'Scrivi la presentazione in 40 parole o meno, da dire a voce.'),
        t2('Read it aloud, fix every place you stumble, and end on her name.', 'Leggila ad alta voce, correggi ogni punto in cui inciampi e chiudi con il suo nome.'),
      ],
      mins: 7,
      bar: [
        t2('The first line is a number or a scene, not a job title', 'La prima riga è un numero o una scena, non un titolo professionale'),
        t2('Every sentence fits in one breath', 'Ogni frase sta in un solo respiro'),
        t2('Her name comes last, so the room knows when to clap', 'Il suo nome arriva per ultimo, così la sala sa quando applaudire'),
      ],
      twist: t2('Write a second intro for a room of 10-year-olds, in 25 words.', 'Scrivi una seconda presentazione per una sala di bambini di 10 anni, in 25 parole.'),
    },
    {
      who: tag('Paloma Plants, an online plant shop (fictional)', 'Paloma Plants, negozio di piante online (fittizio)'),
      brief: t2(
        "A fern bought as a gift arrived broken, three days before the party. One of you writes the customer, one writes support. Four messages, taking turns, ending in a deal. Pair up, or do both parts.",
        "Una felce comprata come regalo è arrivata rotta, tre giorni prima della festa. Uno scrive come cliente, uno come assistenza. Quattro messaggi, a turno, che finiscono con un accordo. In coppia, o fai entrambe le parti."),
      asset: {
        mono: false,
        title: t2('Two private cards', 'Due carte riservate'),
        body: t2(
          'CUSTOMER (in a pair, read only your card)\nYou bought a fern as a gift for Saturday’s party. It arrived with brown leaves and a cracked pot. Today is Wednesday. You want a healthy plant before the party. You are tired of “we apologise for any inconvenience”.\n\nSUPPORT (in a pair, read only your card)\nPaloma Plants. You can send a new plant today (it arrives Friday), or refund in full. A free sturdy pot is allowed if asked. You cannot ship faster. You need a photo of the damage first.\n\nRULES\nEach message 35 words or fewer. Support says sorry once, in the first line. End with a deal both accept.',
          'CLIENTE (in coppia, leggi solo la tua carta)\nHai comprato una felce come regalo per la festa di sabato. È arrivata con le foglie marroni e il vaso crepato. Oggi è mercoledì. Vuoi una pianta sana prima della festa. Ne hai abbastanza di “ci scusiamo per il disagio”.\n\nASSISTENZA (in coppia, leggi solo la tua carta)\nPaloma Plants. Puoi spedire una pianta nuova oggi (arriva venerdì), o rimborsare tutto. Un vaso robusto in omaggio è consentito, se richiesto. Non puoi spedire più in fretta. Prima ti serve una foto del danno.\n\nREGOLE\nOgni messaggio al massimo 35 parole. L’assistenza dice “mi dispiace” una sola volta, nella prima riga. Finite con un accordo che va bene a entrambi.'),
      },
      steps: [
        t2('Write the customer’s first message: what went wrong, what you need, by when.', 'Scrivi il primo messaggio di chi ha comprato: cosa è andato storto, cosa ti serve, entro quando.'),
        t2('Write support’s reply: say sorry once, ask for the photo, offer a clear fix.', 'Scrivi la risposta dell’assistenza: di’ “mi dispiace” una volta, chiedi la foto, offri una soluzione chiara.'),
        t2('Write the last two messages, customer then support, and end on a deal both accept.', 'Scrivi gli ultimi due messaggi, prima chi ha comprato poi l’assistenza, e chiudi con un accordo che va bene a entrambi.'),
      ],
      mins: 8,
      bar: [
        t2('The customer’s first message says what they need and by when', 'Il primo messaggio di chi ha comprato dice cosa serve ed entro quando'),
        t2('Support owns the problem in the first line (one “sorry”, no “inconvenience”)', 'L’assistenza riconosce il problema nella prima riga (un “mi dispiace”, niente “disagio”)'),
        t2('The last message says what happens, and when', 'L’ultimo messaggio dice cosa succede, e quando'),
      ],
      twist: t2('Add the 10-word review the customer posts a week later.', 'Aggiungi la recensione di 10 parole che chi ha comprato pubblica una settimana dopo.'),
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
    {
      who: tag('Shelfie, a book app (fictional)', 'Shelfie, un’app di libri (fittizia)'),
      brief: t2(
        'Shelfie lists books 10 per page, but the page count is off and page 1 starts on the wrong book. Find both mistakes and fix them.',
        'Shelfie elenca i libri 10 per pagina, ma il numero di pagine non torna e la pagina 1 parte dal libro sbagliato. Trova entrambi gli errori e correggili.'),
      asset: {
        mono: true,
        title: t2('shelf.js · 4 checks', 'shelf.js · 4 controlli'),
        body: t2(
          '// Shelfie: 10 books per page, pages start at 1\nfunction pageCount(total, perPage) {\n  return Math.floor(total / perPage);\n}\n\nfunction firstOnPage(page, perPage) {\n  return page * perPage; // position in the list, from 0\n}\n\npageCount(23, 10)   // want 3\npageCount(20, 10)   // want 2\nfirstOnPage(1, 10)  // want 0\nfirstOnPage(3, 10)  // want 20',
          '// Shelfie: 10 libri per pagina, le pagine partono da 1\nfunction pageCount(total, perPage) {\n  return Math.floor(total / perPage);\n}\n\nfunction firstOnPage(page, perPage) {\n  return page * perPage; // posizione nella lista, da 0\n}\n\npageCount(23, 10)   // atteso 3\npageCount(20, 10)   // atteso 2\nfirstOnPage(1, 10)  // atteso 0\nfirstOnPage(3, 10)  // atteso 20'),
      },
      steps: [
        t2('Trace the 4 checks by hand: write what the code returns for each.', 'Segui i 4 controlli a mano: scrivi cosa restituisce il codice per ciascuno.'),
        t2('Fix both functions without breaking the check that already passes.', 'Correggi entrambe le funzioni senza rompere il controllo che già passa.'),
        t2('Add one new check on an edge case, with the value you want.', 'Aggiungi un nuovo controllo su un caso limite, con il valore che ti aspetti.'),
      ],
      mins: 6,
      bar: [
        t2('You wrote down what the code really returns for all 4 checks', 'Hai scritto cosa restituisce davvero il codice per tutti e 4 i controlli'),
        t2('pageCount(20, 10) still gives 2 after your fix', 'pageCount(20, 10) dà ancora 2 dopo la tua correzione'),
        t2('Your new check sits on an edge, like 21 books', 'Il tuo nuovo controllo sta su un caso limite, come 21 libri'),
      ],
      twist: t2('Make pageCount safe if perPage is 0 or less.', 'Rendi pageCount sicura se perPage è 0 o negativo.'),
    },
    {
      who: tag('Stepwell, a walking app (fictional)', 'Stepwell, un’app per camminare (fittizia)'),
      brief: t2(
        'Stepwell shows “3 days in a row” to people who have walked three days running. Write the function that counts the streak, then three examples that prove it works.',
        'Stepwell mostra “3 giorni di fila” a chi ha camminato tre giorni di seguito. Scrivi la funzione che conta la serie, poi tre esempi che dimostrino che funziona.'),
      asset: {
        mono: true,
        title: t2('The streak rules', 'Le regole della serie'),
        body: t2(
          'currentStreak(days)  ->  a number\n\ndays = list of true / false\n       oldest first, today last\n       true = walked that day\n\nThe streak = trues in a row,\ncounting back from today.\nA false ends it. Empty list = 0.\n\nExample: [false, true, true]  ->  2',
          'currentStreak(days)  ->  un numero\n\ndays = lista di true / false\n       dal più vecchio, oggi per ultimo\n       true = ha camminato quel giorno\n\nLa serie = i true di fila,\ncontando a ritroso da oggi.\nUn false la interrompe. Lista vuota = 0.\n\nEsempio: [false, true, true]  ->  2'),
      },
      steps: [
        t2('Write currentStreak(days) in plain JavaScript.', 'Scrivi currentStreak(days) in JavaScript semplice.'),
        t2('Write 3 example calls with the result you expect, one of them tricky.', 'Scrivi 3 chiamate di esempio con il risultato che ti aspetti, una delle quali insidiosa.'),
        t2('Walk your tricky example through the code, line by line.', 'Segui il tuo esempio insidioso nel codice, riga per riga.'),
      ],
      mins: 7,
      bar: [
        t2('It counts back from today, not from the start of the list', 'Conta a ritroso da oggi, non dall’inizio della lista'),
        t2('It stops at the first false', 'Si ferma al primo false'),
        t2('Your examples include an empty list or a false today', 'I tuoi esempi includono una lista vuota o un oggi false'),
      ],
      twist: t2('If today is false but yesterday was true, keep yesterday’s streak: the day is not over yet.', 'Se oggi è false ma ieri era true, tieni la serie di ieri: la giornata non è ancora finita.'),
    },
    {
      who: tag('Penmark, a blog editor (fictional)', 'Penmark, un editor per blog (fittizio)'),
      brief: t2(
        'Penmark needs a word counter under its text box. One person writes the tests, the other writes the function. Pair up, or do both parts: tests first.',
        'Penmark ha bisogno di un contatore di parole sotto la casella di testo. Una persona scrive i test, l’altra la funzione. In coppia, o fai entrambe le parti: prima i test.'),
      asset: {
        mono: true,
        title: t2('The rules and the signature', 'Le regole e la firma'),
        body: t2(
          'countWords(text)  ->  a number\n\n1  Words are separated by spaces or new lines\n2  Extra spaces (start, end, middle) are ignored\n3  Empty text, or only spaces: 0 words\n4  “well-known” counts as one word',
          'countWords(text)  ->  un numero\n\n1  Le parole sono separate da spazi o a capo\n2  Gli spazi in più (inizio, fine, mezzo) si ignorano\n3  Testo vuoto, o solo spazi: 0 parole\n4  “well-known” conta come una parola'),
      },
      steps: [
        t2('Tests: write 4 as countWords(input) -> result, at least 2 awkward ones.', 'Test: scrivine 4 nella forma countWords(input) -> risultato, almeno 2 insidiosi.'),
        t2('Function: write countWords from the rules alone.', 'Funzione: scrivi countWords solo dalle regole.'),
        t2('Together: run each test through the function by hand, fix what fails.', 'Insieme: fai passare ogni test nella funzione a mano, correggi ciò che fallisce.'),
      ],
      mins: 8,
      bar: [
        t2('At least one test uses extra spaces or an empty text', 'Almeno un test usa spazi in più o un testo vuoto'),
        t2('The function follows the rules, not only your tests', 'La funzione segue le regole, non solo i tuoi test'),
        t2('Every test was traced by hand through the function', 'Ogni test è stato seguito a mano nella funzione'),
      ],
      twist: t2('Add readMinutes(text): 200 words per minute, rounded up.', 'Aggiungi readMinutes(text): 200 parole al minuto, arrotondato per eccesso.'),
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
    {
      who: tag('Wheelhouse Bikes, a repair shop (fictional)', 'Wheelhouse Bikes, un’officina per bici (fittizia)'),
      brief: t2(
        "Wheelhouse Bikes filmed a tyre repair, but the video runs 41 seconds and people leave after a few. Cut it to 25 seconds or less and make it open on the action.",
        "Wheelhouse Bikes ha filmato la riparazione di una gomma, ma il video dura 41 secondi e la gente se ne va dopo pochi secondi. Portalo a 25 secondi o meno e fallo aprire sull’azione."),
      asset: {
        mono: true,
        title: t2('Shot list · 41 seconds, in filming order', 'Elenco inquadrature · 41 secondi, nell’ordine di ripresa'),
        body: t2(
          '1 · 4s  Logo animation on white\n2 · 8s  Owner explains who they are, standing still\n3 · 3s  Bike leaning on the wall\n4 · 5s  Hand pulls a nail out of a tyre\n5 · 3s  Same bike, other angle\n6 · 4s  Inner tube dips in a bucket, bubbles show the leak\n7 · 5s  Tyre inflates, thumbs up\n8 · 3s  Rider leaves, bell rings\n9 · 6s  Empty shop, closing sign',
          '1 · 4s  Logo animato su fondo bianco\n2 · 8s  Il titolare spiega chi è, fermo in piedi\n3 · 3s  Bici appoggiata al muro\n4 · 5s  Una mano toglie un chiodo da una gomma\n5 · 3s  Stessa bici, altra angolazione\n6 · 4s  La camera d’aria nel secchio, le bolle mostrano il foro\n7 · 5s  La gomma si gonfia, pollice in su\n8 · 3s  Il ciclista parte, suona il campanello\n9 · 6s  Negozio vuoto, cartello di chiusura'),
      },
      steps: [
        t2('Cross out shots until 25 seconds or less remain. Name each one you drop.', 'Cancella inquadrature finché restano 25 secondi o meno. Indica ognuna che togli.'),
        t2('Write the shots you keep, in order, with the new total. Open on the moment that makes people stop.', 'Scrivi le inquadrature che tieni, in ordine, con il nuovo totale. Apri sul momento che fa fermare la gente.'),
        t2('Name the payoff shot and the second where it lands.', 'Indica l’inquadratura clou e il secondo in cui arriva.'),
      ],
      mins: 6,
      bar: [
        t2('It opens on action, not on the logo or someone talking', 'Apre su un’azione, non sul logo né su qualcuno che parla'),
        t2('The total is 25 seconds or less and no shot repeats', 'Il totale è di 25 secondi o meno e nessuna inquadratura si ripete'),
        t2('It ends on the result, not on an empty shop', 'Finisce sul risultato, non su un negozio vuoto'),
      ],
      twist: t2('Keep the logo, but show it for 1 second at the very end.', 'Tieni il logo, ma mostralo per 1 secondo proprio alla fine.'),
    },
    {
      who: tag('Balcony Basil, a herb channel (fictional)', 'Balcony Basil, un canale sulle erbe aromatiche (fittizio)'),
      brief: t2(
        "Balcony Basil is a new channel about growing herbs in tiny spaces. Plan its intro, 15 to 20 seconds, frame by frame, so a stranger stays and follows.",
        "Balcony Basil è un nuovo canale su come coltivare erbe aromatiche in spazi minuscoli. Pianifica la sua intro, 15-20 secondi, inquadratura per inquadratura, così che uno sconosciuto resti e lo segua."),
      asset: {
        mono: true,
        title: t2('Constraint sheet', 'Scheda dei vincoli'),
        body: t2(
          'Viewer     city renter, one sunny window, has killed every plant\nPromise    “Fresh herbs in a space the size of a doormat”\nFormat     vertical, 15-20 seconds, must work without a voice-over\nMust have  the channel name once, one real plant, one hand in shot\nMust not   open with “Hi guys”, or show a logo before second 3\nOn hand    3 pots (empty, seedling, full-grown basil), a watering can, scissors, a pan, a sunny railing',
          'Spettatore  chi vive in affitto in città, una finestra soleggiata, ha ucciso ogni pianta\nPromessa    “Erbe fresche in uno spazio grande come uno zerbino”\nFormato     verticale, 15-20 secondi, deve funzionare senza voce fuori campo\nDeve avere  il nome del canale una volta, una pianta vera, una mano in quadro\nNon deve    aprire con “Ciao ragazzi”, né mostrare un logo prima del secondo 3\nA portata   3 vasi (vuoto, piantina, basilico adulto), un annaffiatoio, forbici, una padella, una ringhiera al sole'),
      },
      steps: [
        t2('Write the first 2 seconds: what we see and the words on screen.', 'Scrivi i primi 2 secondi: cosa si vede e le parole sullo schermo.'),
        t2('Plan 4 or 5 blocks in all. For each one write the seconds, the picture and any text.', 'Pianifica 4 o 5 blocchi in tutto. Per ognuno scrivi i secondi, l’immagine e l’eventuale testo.'),
        t2('Write the last frame: the line that makes people follow.', 'Scrivi l’ultima inquadratura: la frase che fa seguire il canale.'),
      ],
      mins: 7,
      bar: [
        t2('The first 2 seconds show something happening, not a greeting', 'I primi 2 secondi mostrano qualcosa che succede, non un saluto'),
        t2('Every frame can be filmed with the props on the sheet', 'Ogni inquadratura si può girare con gli oggetti della scheda'),
        t2('A new viewer could say what the channel is about', 'Chi guarda per la prima volta saprebbe dire di cosa parla il canale'),
      ],
      twist: t2('Make it work with the sound off, using only action and on-screen text.', 'Falla funzionare senza audio, solo con azione e testo sullo schermo.'),
    },
    {
      who: tag('Ember Arcade, a game room (fictional)', 'Ember Arcade, una sala giochi (fittizia)'),
      brief: t2(
        "Ember Arcade is holding a retro night on Friday and wants a 20-second teaser. One person writes the words, one plans the shots. Pair up, or do both parts.",
        "Ember Arcade organizza una serata retro venerdì e vuole un teaser di 20 secondi. Uno scrive le parole, uno pianifica le inquadrature. In coppia, o fai entrambe le parti."),
      asset: {
        mono: true,
        title: t2('Facts and footage', 'Fatti e girato'),
        body: t2(
          'When   Friday, 8 pm. Free entry before 9\nWhat   30 old games, pizza by the slice\nPrize  a year of free tokens for the top score\nCrowd  friends in their 20s, scrolling at lunch\n\nShots you can film\nA  Neon sign flickers on\nB  Hand slams a joystick\nC  Pizza slice lifts, cheese stretches\nD  Scoreboard shows a new record\nE  Friends laughing at a cabinet\nF  Screen flashes GAME OVER',
          'Quando    venerdì, ore 20. Ingresso gratis prima delle 21\nCosa      30 giochi vintage, pizza al taglio\nPremio    un anno di gettoni gratis per il punteggio più alto\nPubblico  amici sui 20 anni, che scrollano a pranzo\n\nInquadrature che puoi girare\nA  L’insegna al neon si accende\nB  Una mano sbatte un joystick\nC  Un trancio di pizza si alza, il formaggio fila\nD  Il tabellone mostra un nuovo record\nE  Amici che ridono davanti a un cabinato\nF  Lo schermo lampeggia GAME OVER'),
      },
      steps: [
        t2('Writer: write a hook of 6 words or fewer, and a caption with the day, the time and the deal.', 'Chi scrive: scrivi un aggancio di massimo 6 parole e una didascalia con giorno, ora e offerta.'),
        t2('Planner: pick 4 or 5 shots, put them in order and give each its seconds (20 in all, or less).', 'Chi pianifica: scegli 4 o 5 inquadrature, mettile in ordine e dai a ognuna i suoi secondi (20 in tutto, o meno).'),
        t2('Read both parts side by side. Change one line or one shot so the words and the pictures don’t repeat each other.', 'Leggi le due parti affiancate. Cambia una riga o un’inquadratura così che parole e immagini non si ripetano.'),
      ],
      mins: 8,
      bar: [
        t2('The caption holds the day, the time and the free-entry deal', 'La didascalia contiene giorno, ora e ingresso gratis'),
        t2('The words and the first shot add to each other, not repeat', 'Le parole e la prima inquadratura si completano, non si ripetono'),
        t2('The shots add up to 20 seconds or less', 'Le inquadrature fanno 20 secondi o meno in totale'),
      ],
      twist: t2('Write a second hook for people who have never played an arcade game.', 'Scrivi un secondo aggancio per chi non ha mai giocato in una sala giochi.'),
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
    {
      who: tag('Pier Nine, a gym (fictional)', 'Pier Nine, una palestra (fittizia)'),
      brief: t2(
        'A gym texted Luca, who had tried a free session. The text was pushy and got no answer. Rewrite it so it helps instead of pressures.',
        'Una palestra ha scritto a Luca, che aveva provato una lezione gratuita. Il messaggio era insistente e non ha avuto risposta. Riscrivilo perché aiuti invece di fare pressione.'),
      asset: {
        mono: false,
        title: t2('The pushy text, and what is really true', 'Il messaggio insistente, e cosa è vero davvero'),
        body: t2(
          'SENT TODAY\n“Hi Luca!!! Don’t miss out! Only 3 memberships left at €39/month! Offer ends TONIGHT! Everybody who waits regrets it. Sign up NOW or lose your spot!”\n\nWHAT IS TRUE\n– Luca tried a free session on Tuesday. He works night shifts and wants to train twice a week.\n– He told you: “I hate crowds.”\n– The gym is quiet from 10:00 to 12:00 and after 21:00.\n– €39/month, cancel any time. The first month is €29 until Sunday.\n– There is no limit on memberships.',
          'INVIATO OGGI\n“Ciao Luca!!! Non perdere l’occasione! Solo 3 abbonamenti rimasti a 39 €/mese! Offerta solo STASERA! Chi aspetta se ne pente. Iscriviti ORA o perdi il posto!”\n\nCOSA È VERO\n– Luca ha provato una lezione gratuita martedì. Lavora di notte e vuole allenarsi due volte a settimana.\n– Ti ha detto: “Odio la folla.”\n– La palestra è tranquilla dalle 10:00 alle 12:00 e dopo le 21:00.\n– 39 €/mese, disdici quando vuoi. Il primo mese costa 29 € fino a domenica.\n– Non c’è nessun limite agli abbonamenti.'),
      },
      steps: [
        t2('Find the 2 worst phrases and say what is false or pushy about each.', 'Trova le 2 frasi peggiori e di’ cosa c’è di falso o insistente in ciascuna.'),
        t2('Rewrite the message in 60 words or fewer, using what Luca told you.', 'Riscrivi il messaggio in 60 parole o meno, usando ciò che Luca ti ha detto.'),
        t2('Keep only the real deadline and end with one easy question.', 'Tieni solo la scadenza vera e chiudi con una domanda facile.'),
      ],
      mins: 6,
      bar: [
        t2('Every claim you make is true', 'Ogni cosa che affermi è vera'),
        t2('It uses something Luca actually said', 'Usa qualcosa che Luca ha detto davvero'),
        t2('It ends with an easy question, not “sign up now”', 'Finisce con una domanda facile, non “iscriviti ora”'),
      ],
      twist: t2('Add one line that makes it easy for Luca to say no.', 'Aggiungi una riga che renda facile a Luca dire di no.'),
    },
    {
      who: tag('Spoke & Sons, a bike repair stall (fictional)', 'Spoke & Sons, un banco riparazioni bici (fittizio)'),
      brief: t2(
        'A new bike repair stall has no customers yet. Write the flyer that brings the first students on Wednesday.',
        'Un nuovo banco di riparazioni bici non ha ancora clienti. Scrivi il volantino che porta i primi studenti mercoledì.'),
      asset: {
        mono: true,
        title: t2('Fact sheet · pick only 3', 'Scheda dei fatti · scegline solo 3'),
        body: t2(
          'For      students who cycle to class\nWhere    courtyard behind Block C\nWhen     Wednesdays 17:00–19:00\nFacts\n  1  Tune-up €15: brakes, gears, chain, ~45 min\n  2  Flat tyre only: €5, 10 minutes\n  3  Price told before any work starts\n  4  3-month guarantee on every repair\n  5  Spare inner tubes and brake pads in stock\n  6  Parts at cost, no markup\n  7  Run by two mechanics, one is a student here\n  8  Cash or card\nLimits   40 words max · no “best”, “amazing”, “unbeatable”',
          'Per      studenti che vanno a lezione in bici\nDove     cortile dietro il Blocco C\nQuando   mercoledì 17:00–19:00\nFatti\n  1  Messa a punto 15 €: freni, cambio, catena, ~45 min\n  2  Solo foratura: 5 €, 10 minuti\n  3  Prezzo detto prima di iniziare\n  4  3 mesi di garanzia su ogni riparazione\n  5  Camere d’aria e pastiglie dei freni sempre pronte\n  6  Ricambi al costo, senza ricarico\n  7  Gestito da due meccanici, uno è studente qui\n  8  Contanti o carta\nLimiti   max 40 parole · niente “il migliore”, “fantastico”, “imbattibile”'),
      },
      steps: [
        t2('Choose the 3 facts a student with a broken bike cares about most.', 'Scegli i 3 fatti che contano di più per uno studente con la bici rotta.'),
        t2('Write a headline of 6 words or fewer, then the flyer text.', 'Scrivi un titolo di 6 parole o meno, poi il testo del volantino.'),
        t2('Close with when, where and one easy next step.', 'Chiudi con quando, dove e un prossimo passo facile.'),
      ],
      mins: 7,
      bar: [
        t2('The headline speaks to the student’s problem, not to the shop', 'Il titolo parla del problema dello studente, non del negozio'),
        t2('You used 3 facts, not all eight', 'Hai usato 3 fatti, non tutti e otto'),
        t2('A stranger knows when, where and how much', 'Uno sconosciuto sa quando, dove e quanto'),
      ],
      twist: t2('Write the 10-word text a student could forward to a friend.', 'Scrivi il messaggio di 10 parole che uno studente potrebbe inoltrare a un amico.'),
    },
    {
      who: tag('Tern Print, a print shop (fictional)', 'Tern Print, una tipografia (fittizia)'),
      brief: t2(
        'A café needs 200 menus and a print shop wants a fair price. One plays each side. Pair up, or do both parts.',
        'Un bar ha bisogno di 200 menu e una tipografia vuole un prezzo giusto. Ognuno recita un ruolo. In coppia, o fai entrambe le parti.'),
      asset: {
        mono: true,
        title: t2('Two role cards · in a pair, each reads only their own; alone, read both', 'Due carte ruolo · in coppia ognuno legge solo la sua; da solo, leggile entrambe'),
        body: t2(
          'SELLER · Tern Print\nAsk       200 menus for €240\nCost      €150. Never go below €190\nYou like  payment up front · 7 days to print · a repeat customer\nCan’t     print in under 3 days\n\nBUYER · Café Lume\nNeed      200 menus by Friday (5 days)\nBudget    €210 at most\nYou like  paying after delivery · a free colour check (the last printer got the colours wrong)\nMaybe     promise to reprint every season',
          'VENDITORE · Tern Print\nChiede    200 menu a 240 €\nCosto     150 €. Mai sotto i 190 €\nTi piace  pagamento anticipato · 7 giorni per stampare · un cliente che torna\nNon puoi  stampare in meno di 3 giorni\n\nCOMPRATORE · Café Lume\nServe     200 menu entro venerdì (5 giorni)\nBudget    210 € al massimo\nTi piace  pagare alla consegna · una prova colore gratis (l’ultima tipografia ha sbagliato i colori)\nForse     promettere di ristampare ogni stagione'),
      },
      steps: [
        t2('Seller opens with the price and one reason. Buyer answers with a question, not a number.', 'Il venditore apre con il prezzo e un motivo. Il compratore risponde con una domanda, non con un numero.'),
        t2('Trade, don’t just cut the price: swap one thing for another at least twice.', 'Non limitarti ad abbassare il prezzo: scambia una cosa con un’altra almeno due volte.'),
        t2('Say the deal out loud and write it in one line: price, number, date.', 'Di’ l’accordo a voce e scrivilo in una riga: prezzo, quantità, data.'),
      ],
      mins: 8,
      bar: [
        t2('Nobody gives a discount without getting something back', 'Nessuno fa uno sconto senza ricevere qualcosa in cambio'),
        t2('The price is fair to both: above the floor, within the budget', 'Il prezzo è giusto per entrambi: sopra il minimo, dentro il budget'),
        t2('The deal fits in one clear line', 'L’accordo sta in una riga chiara'),
      ],
      twist: t2('Add one line that makes the other side want to work with you again.', 'Aggiungi una riga che faccia venire voglia all’altro di lavorare di nuovo con te.'),
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
    {
      who: tag('Lighthouse Drive, an indie band (fictional)', 'Lighthouse Drive, una band indie (fittizia)'),
      brief: t2(
        "Lighthouse Drive records on Friday, and every line of the chorus says “I miss you”. Rewrite it so every line adds something new.",
        "I Lighthouse Drive registrano venerdì e ogni riga del ritornello dice “mi manchi”. Riscrivilo in modo che ogni riga aggiunga qualcosa di nuovo."),
      asset: {
        mono: true,
        title: t2('Chorus draft · “Stay a Little” · one line per chord', 'Bozza del ritornello · “Resta un po’” · una riga per accordo'),
        body: t2(
          'Am   1  I miss you, I miss you so much\nF    2  I really, really miss you now\nC    3  Oh, I just miss you every day\nG    4  Yes, I miss you, I miss you, I miss you\n\nFeel  slow build, line 4 is the big one',
          'LAm  1  Mi manchi, mi manchi tantissimo\nFA   2  Mi manchi davvero, davvero adesso\nDO   3  Oh, mi manchi ogni giorno che passa\nSOL  4  Sì, mi manchi, mi manchi, mi manchi\n\nClima  crescendo lento, la riga 4 è la più forte'),
      },
      steps: [
        t2('Underline the one idea all four lines repeat, then pick three new things to show instead (an object, a place, a moment).', 'Sottolinea l’unica idea che le quattro righe ripetono, poi scegli tre cose nuove da mostrare al suo posto (un oggetto, un luogo, un momento).'),
        t2('Rewrite lines 1 to 3 with those things, about 8 syllables each. Tap them out on your fingers.', 'Riscrivi le righe da 1 a 3 con quelle cose, di circa 10-12 sillabe ciascuna. Contale battendo sulle dita.'),
        t2('Write line 4: the one line that says the feeling out loud, at the same length.', 'Scrivi la riga 4: l’unica che dice il sentimento a voce alta, della stessa lunghezza.'),
      ],
      mins: 6,
      bar: [
        t2('Each line shows something new, not the same feeling again', 'Ogni riga mostra qualcosa di nuovo, non lo stesso sentimento'),
        t2('The four lines are about the same length, so they sing in one rhythm', 'Le quattro righe hanno circa la stessa lunghezza, così si cantano nello stesso ritmo'),
        t2('The feeling is said plainly once, in the line people will sing back', 'Il sentimento è detto chiaramente una volta, nella riga che la gente canterà'),
      ],
      twist: t2('Make lines 2 and 4 rhyme without forcing it.', 'Fai rimare le righe 2 e 4 senza forzare.'),
    },
    {
      who: tag('Casa Cielo, a rooftop bar (fictional)', 'Casa Cielo, un rooftop bar (fittizio)'),
      brief: t2(
        "A rooftop bar needs a music plan for Friday night, 6 pm to 11 pm. You do not pick songs: you shape how the energy rises and falls.",
        "Un rooftop bar ha bisogno di un piano musicale per il venerdì sera, dalle 18 alle 23. Non scegli le canzoni: disegni come l’energia sale e scende."),
      asset: {
        mono: true,
        title: t2('Night sheet · five 1-hour slots', 'Scheda della serata · cinque fasce da 1 ora'),
        body: t2(
          'Night    Friday, 18:00 to 23:00\nCrowd    18:00 after work, talking over drinks\n         20:00 dinner at the tables\n         22:00 last round, tired and happy\nScale    energy 1 (whisper) to 5 (dance floor)\nRules    hours 1-2: level 1 or 2, so people can talk\n         change by 2 levels at most between hours\n         the peak is never the last hour\nWrite    hour · energy · tempo · sound in 3 words',
          'Serata   venerdì, dalle 18 alle 23\nPubblico 18:00 dopo il lavoro, si chiacchiera bevendo\n         20:00 cena ai tavoli\n         22:00 ultimo giro, stanchi e contenti\nScala    energia da 1 (sussurro) a 5 (pista da ballo)\nRegole   ore 1-2: livello 1 o 2, così si può parlare\n         cambia di 2 livelli al massimo tra un’ora e l’altra\n         il picco non è mai l’ultima ora\nScrivi   ora · energia · tempo · suono in 3 parole'),
      },
      steps: [
        t2('Write five energy numbers, one per hour, that follow all three rules.', 'Scrivi cinque numeri di energia, uno per ora, che rispettino tutte e tre le regole.'),
        t2('Next to each number, add a tempo (slow, medium or fast) and the sound in three words.', 'Accanto a ogni numero aggiungi un tempo (lento, medio o veloce) e il suono in tre parole.'),
        t2('Write one instruction for whoever presses play: what to do if the room goes quiet.', 'Scrivi un’istruzione per chi preme play: cosa fare se la sala si spegne.'),
      ],
      mins: 7,
      bar: [
        t2('Your five numbers follow all three rules', 'I tuoi cinque numeri rispettano tutte e tre le regole'),
        t2('Each hour has a sound you can hear in your head, not just “chill”', 'Ogni ora ha un suono che senti nella testa, non solo “relax”'),
        t2('Tempo and energy agree (nothing fast at level 1)', 'Tempo ed energia vanno d’accordo (niente di veloce al livello 1)'),
      ],
      twist: t2('Add one surprise: a sound or a pause you use only once.', 'Aggiungi una sorpresa: un suono o una pausa che usi una volta sola.'),
    },
    {
      who: tag('Tidewalk 5K, a charity run (fictional)', 'Tidewalk 5K, una corsa benefica (fittizia)'),
      brief: t2(
        "A charity run wants a short chant for the start line, so 200 runners join in. One writes the rhythm, one writes the call and answer. Pair up, or do both parts.",
        "Una corsa benefica vuole un breve coro per la partenza, così 200 corridori si uniscono. Uno scrive il ritmo, uno richiamo e risposta. In coppia, o fai entrambe le parti."),
      asset: {
        mono: true,
        title: t2('Chant grid · 8 steps', 'Griglia del coro · 8 passi'),
        body: t2(
          'Step    1  2  3  4  5  6  7  8\nCount   1  &  2  &  3  &  4  &\nStomp   X  .  .  .  X  .  .  .\nClap    _  _  _  _  _  _  _  _\nCall    steps 1-4, the leader, 4 syllables at most\nAnswer  steps 5-8, the crowd, 4 syllables at most\n\nX hit · . rest · _ yours to fill',
          'Passo    1  2  3  4  5  6  7  8\nConta    1  e  2  e  3  e  4  e\nPestata  X  .  .  .  X  .  .  .\nMani     _  _  _  _  _  _  _  _\nRichiamo passi 1-4, chi guida, al massimo 4 sillabe\nRisposta passi 5-8, la folla, al massimo 4 sillabe\n\nX colpo · . pausa · _ da riempire'),
      },
      steps: [
        t2('Rhythm: fill the clap row with X and . (at least 2 hits and 3 rests).', 'Ritmo: riempi la riga delle mani con X e . (almeno 2 colpi e 3 pause).'),
        t2('Words: write the call and the answer, one syllable per step, and underline the strongest syllable of each.', 'Parole: scrivi richiamo e risposta, una sillaba per passo, e sottolinea la sillaba più forte di ciascuno.'),
        t2('Together: read it aloud while you tap the grid, then fix one clash so the key syllable lands on a hit.', 'Insieme: leggilo ad alta voce battendo la griglia, poi correggi un punto che stona, così la sillaba chiave cade su un colpo.'),
      ],
      mins: 8,
      bar: [
        t2('Call and answer each fit in their 4 steps, nothing spills over', 'Richiamo e risposta stanno nei loro 4 passi, niente sborda'),
        t2('The key syllable of the answer lands on a stomp or a clap', 'La sillaba chiave della risposta cade su una pestata o su un battito di mani'),
        t2('The answer is short enough to shout after hearing it once', 'La risposta è abbastanza corta da gridarla dopo averla sentita una volta'),
      ],
      twist: t2('Write a second answer for the finish line, in the same rhythm.', 'Scrivi una seconda risposta per il traguardo, con lo stesso ritmo.'),
    },
  ],
};
