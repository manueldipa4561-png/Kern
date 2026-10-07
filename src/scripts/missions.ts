import { t2 } from './i18n';

// One concrete practice brief per mission (6 fields x 6, in rounds of 3). Every company here is fictional and the sheet says so.
// Shape: who (practice brief tag), brief (scenario + stakes), asset (the real material to work on),
// steps (3 actions), mins (time box), bar (what strong answers do), twist (optional bonus).
// img: a picture of the asset (a photo, a story, a cover) shown above the text, imgIt the Italian version when the picture has words in it.
// only: the picture says it all, so the text is kept just as its description for a screen reader.
export type Asset = { title: string; body: string; mono: boolean; img?: string; imgIt?: string; only?: boolean };
export type MissionX = { who: string; brief: string; asset: Asset; steps: string[]; mins: number; bar: string[]; twist: string };

const tag = (en: string, it: string) => t2('Practice brief · ' + en, 'Brief di pratica · ' + it);

export const MX: Record<string, MissionX[]> = {
  Design: [
    {
      who: tag('Pomo Pizza (fictional)', 'Pomo Pizza (fittizia)'),
      brief: t2(
        'Pomo Pizza’s Saturday story shouts 7 things at once, so people swipe past. Pick the one that gets people to turn up and rebuild it around that.',
        'La storia di sabato di Pomo Pizza urla 7 cose insieme e la gente scorre via. Scegli la cosa che fa venire la gente e ricostruisci tutto attorno a quella.'),
      asset: {
        mono: false,
        img: '/img/m/story-en.webp', imgIt: '/img/m/story-it.webp', only: true,
        title: t2('The story today', 'La storia oggi'),
        body: t2(
          'PIZZA NIGHT SATURDAY!!! (huge, red, shouting letters)\n2 for 1 until 9pm (yellow sticker, tilted)\nLive DJ from 10 (blue, curly letters)\nNew menu · win a year of pizza · tag 3 friends\n12 Via Verdi (tiny, grey, on the photo)\nPhoto: a pizza, a crowd and a dog',
          'SERATA PIZZA SABATO!!! (enorme, rossa, lettere urlate)\n2x1 fino alle 21 (adesivo giallo, storto)\nDJ dal vivo dalle 22 (blu, lettere ricciolute)\nNuovo menu · vinci un anno di pizza · tagga 3 amici\nVia Verdi 12 (minuscolo, grigio, sulla foto)\nFoto: una pizza, una folla e un cane'),
      },
      steps: [
        t2('Pick the one message that makes people turn up.', 'Scegli il messaggio che fa venire la gente.'),
        t2('List what you cut. Be brave: at least four things.', 'Elenca cosa togli. Coraggio: almeno quattro cose.'),
        t2('Describe the new story: the words and the one colour.', 'Descrivi la nuova storia: le parole e l’unico colore.'),
      ],
      mins: 2,
      bar: [
        t2('Readable in two seconds', 'Si legge in due secondi'),
        t2('You cut at least four things', 'Hai tolto almeno quattro cose'),
        t2('One colour, one kind of letters', 'Un colore, un solo tipo di lettere'),
      ],
      twist: t2('Build it in your story editor for a real place you like. Post it, or send it to a friend.', 'Costruiscila nell’editor delle storie per un posto vero che ti piace. Pubblicala, o mandala a qualcuno.'),
    },
    {
      who: tag('Bar Ficus (fictional)', 'Bar Ficus (fittizio)'),
      brief: t2(
        'Bar Ficus wants a round sticker for its door. Can’t draw? Describe it in words so anyone could draw it: picture, 2 colours, name and one short line.',
        'Bar Ficus vuole un adesivo rotondo per la porta. Non sai disegnare? Descrivilo a parole perché chiunque possa disegnarlo: immagine, 2 colori, nome e una frase breve.'),
      asset: {
        mono: false,
        title: t2('What you know about the bar', 'Cosa sai del bar'),
        body: t2(
          'Open since 1987, 6:30am to 9pm\nEspresso €1.20 · Spritz €4\nRosa runs it and calls everyone “tesoro” (sweetheart)\nA giant plant by the cash register, older than Rosa’s kids\nLoud at 6pm, sleepy at 3pm\nThe sticker: round, 8 cm, on the glass door',
          'Aperto dal 1987, dalle 6:30 alle 21\nCaffè 1,20 € · Spritz 4 €\nRosa lo gestisce e chiama tutti “tesoro”\nUna pianta gigante vicino alla cassa, più vecchia dei figli di Rosa\nChiassoso alle 18, assonnato alle 15\nL’adesivo: rotondo, 8 cm, sulla porta a vetri'),
      },
      steps: [
        t2('Pick one thing from the list that makes this bar itself.', 'Scegli dall’elenco una cosa che rende questo bar unico.'),
        t2('Describe the picture, using just 2 colours.', 'Descrivi l’immagine, usando solo 2 colori.'),
        t2('Write the line under the name: 4 words max.', 'Scrivi la frase sotto il nome: 4 parole al massimo.'),
      ],
      mins: 3,
      bar: [
        t2('Clear from one step away', 'Si capisce da un passo di distanza'),
        t2('The line is 4 words or fewer', 'La frase ha 4 parole o meno'),
        t2('Only 2 colours, and you named them', 'Solo 2 colori, e li hai nominati'),
      ],
      twist: t2('Sketch it on paper, even badly. Post the photo, or send it to a friend.', 'Schizzalo su carta, anche male. Pubblica la foto, o mandala a qualcuno.'),
    },
    {
      who: tag('Elena’s bare room', 'La stanza vuota di Elena'),
      brief: t2(
        'A friend describes their dream room in one sentence. You plan its moodboard (a collage): 6 pictures, described in words. Pair up, or do both parts.',
        'Qualcuno descrive la sua stanza dei sogni in una frase. Pianifica il suo moodboard (un collage): 6 immagini, a parole. In coppia, o fai entrambe le parti.'),
      asset: {
        mono: false,
        img: '/img/m/room.webp',
        title: t2('Elena’s room (if you have no partner)', 'La stanza di Elena (se non hai un partner)'),
        body: t2(
          'Elena’s sentence: “A room that feels like a slow Sunday in a tiny flat by the sea.”\nThe room: 3 by 3 metres, one window facing a wall\nShe already has: a bed, a lamp, a sad plant\nBudget: very small\nYou choose: 6 pictures, no more',
          'La frase di Elena: “Una stanza che sembra una domenica lenta in una casetta sul mare.”\nLa stanza: 3 metri per 3, una finestra che dà su un muro\nHa già: un letto, una lampada, una pianta un po’ triste\nBudget: minuscolo\nTu scegli: 6 immagini, non una di più'),
      },
      steps: [
        t2('Read the sentence. Write its feeling in 2 words.', 'Leggi la frase. Scrivi la sua sensazione in 2 parole.'),
        t2('Describe 6 pictures that match it, one line each.', 'Descrivi 6 immagini che ci stanno bene, una riga ciascuna.'),
        t2('Name the 2 colours that tie the six together.', 'Scegli i 2 colori che tengono insieme le sei.'),
      ],
      mins: 3,
      bar: [
        t2('Every picture fits the feeling', 'Ogni immagine segue la sensazione'),
        t2('6 different things, not 6 lamps', '6 cose diverse, non 6 lampade'),
        t2('A stranger could guess the sentence', 'Chi non la conosce indovinerebbe la frase'),
      ],
      twist: t2('Copy the six lines and send them to your friend. Ask: “Is this it?” One word back is enough.', 'Copia le sei righe e mandale a chi ti ha dato la frase. Chiedi: “È questa?” Basta una parola di risposta.'),
    },
    {
      who: tag('Nonna Kicks (fictional)', 'Nonna Kicks (fittizia)'),
      brief: t2(
        'Nonna Kicks sells second-hand sneakers online. This photo got zero messages in 5 days. Say what to change so a stranger stops scrolling.',
        'Nonna Kicks vende sneaker di seconda mano online. Questa foto non ha avuto nessun messaggio in 5 giorni. Di’ cosa cambiare perché uno sconosciuto si fermi a guardarla.'),
      asset: {
        mono: false,
        img: '/img/m/sneakers.webp', only: true,
        title: t2('The photo today', 'La foto oggi'),
        body: t2(
          'Taken at 8pm under one dim ceiling light\nOn an unmade bed, a hoodie in the corner\nBoth sneakers slightly blurry\nLaces undone, toes cut off at the edge\nWhite sneakers look yellow\nYou can’t see the sole or the size',
          'Scattata alle 20 sotto una luce fioca sul soffitto\nSu un letto sfatto, con una felpa in un angolo\nEntrambe le sneaker un po’ sfocate\nLacci slacciati, punte tagliate sul bordo\nLe sneaker bianche sembrano gialle\nNon si vedono la suola né la taglia'),
      },
      steps: [
        t2('Name the 3 worst things about the photo.', 'Indica le 3 cose peggiori della foto.'),
        t2('Describe the reshoot: where, what light, what behind the shoes.', 'Descrivi lo scatto nuovo: dove, che luce, cosa dietro le scarpe.'),
        t2('Say what you trim off the edges and what stays.', 'Di’ cosa tagli ai bordi e cosa resta.'),
      ],
      mins: 4,
      bar: [
        t2('Light, background and trimming all covered', 'Luce, sfondo e ritaglio: tutti e tre'),
        t2('The shoes fill most of the frame', 'Le scarpe riempiono quasi tutta la foto'),
        t2('Nothing else competes with the shoes', 'Niente distrae dalle scarpe'),
      ],
      twist: t2('Reshoot a pair of your own tonight. Use it on Vinted or Subito, or send before and after to a friend.', 'Rifai la foto a un paio delle tue stasera. Usala su Vinted o Subito, oppure manda prima e dopo a qualcuno.'),
    },
    {
      who: tag('Fuorisede Diaries (fictional)', 'Fuorisede Diaries (fittizio)'),
      brief: t2(
        'Fuorisede Diaries is an account for students living away from home. Plan the first picture of its swipe-through post “5 things I wish I knew before my first flatmates”.',
        'Fuorisede Diaries è un account per chi vive fuorisede. Pianifica la prima immagine del suo carosello “5 cose che avrei voluto sapere prima dei miei primi coinquilini”.'),
      asset: {
        mono: false,
        title: t2('The 5 tips inside + the rules', 'I 5 consigli dentro + le regole'),
        body: t2(
          'Tip 1: label your food, always\nTip 2: buy your own pan\nTip 3: talk about the bills in week 1\nTip 4: know who takes out the bin\nTip 5: if something bugs you, say it early, not at 2am\nRules: square, seen small in a feed, 6 words max, one bright colour',
          'Consiglio 1: etichetta sempre il tuo cibo\nConsiglio 2: compra una pentola tua\nConsiglio 3: parla delle bollette già nella settimana 1\nConsiglio 4: chiarisci chi porta giù la spazzatura\nConsiglio 5: se qualcosa ti dà fastidio, dillo subito, non alle 2 di notte\nRegole: quadrata, vista piccola nel feed, massimo 6 parole, un colore acceso'),
      },
      steps: [
        t2('Pick the tip that would make a stranger most curious.', 'Scegli il consiglio che incuriosirebbe di più uno sconosciuto.'),
        t2('Write the words on the cover: 6 words or fewer.', 'Scrivi le parole sulla copertina: 6 parole o meno.'),
        t2('Describe the picture, in one bright colour.', 'Descrivi l’immagine, in un solo colore acceso.'),
      ],
      mins: 4,
      bar: [
        t2('You want to see picture two', 'Ti viene voglia di vedere la seconda'),
        t2('Readable when the picture is tiny', 'Si legge anche quando l’immagine è piccola'),
        t2('It does not give away all 5 tips', 'Non svela tutti e 5 i consigli'),
      ],
      twist: t2('Copy the plan and send it to someone about to move in with flatmates. Would they keep swiping?', 'Copia il piano e mandalo a chi sta per andare a vivere con dei coinquilini. Andrebbe avanti a scorrere?'),
    },
    {
      who: tag('Noce Bites (fictional)', 'Noce Bites (fittizio)'),
      brief: t2(
        'Luca’s video: “I tried Noce Bites for 7 days”. Plan 2 very different thumbnails (the small picture people tap). A friend picks one. Pair up, or do both parts.',
        'Luca ha un video: “Ho provato Noce Bites per 7 giorni”. Pianifica 2 miniature molto diverse. Chi fa coppia con te ne sceglie una. In due, o fai entrambe le parti.'),
      asset: {
        mono: false,
        img: '/img/m/luca.webp',
        title: t2('Luca’s video + the rules', 'Il video di Luca + le regole'),
        body: t2(
          'Video: “I tried Noce Bites for 7 days”\nThe snack: oat and hazelnut bites, orange wrapper\nLuca on day 7: tired but happy\nOn a phone the thumbnail is about 3 cm wide\nRules: 3 words max, wrapper visible, one colour that pops',
          'Video: “Ho provato Noce Bites per 7 giorni”\nLo snack: bocconcini di avena e nocciola, confezione arancione\nLuca al giorno 7: stanco ma felice\nSul telefono la miniatura è larga circa 3 cm\nRegole: massimo 3 parole, confezione visibile, un colore che spicca'),
      },
      steps: [
        t2('Plan thumbnail A: a face, 3 words or fewer.', 'Pianifica la miniatura A: una faccia, 3 parole o meno.'),
        t2('Plan thumbnail B the same way, but really different.', 'Pianifica la miniatura B allo stesso modo, ma davvero diversa.'),
        t2('Pick the winner and say why in one line.', 'Scegli la vincente e di’ perché in una riga.'),
      ],
      mins: 5,
      bar: [
        t2('The two versions look really different', 'Le due versioni sono davvero diverse'),
        t2('Readable at 3 cm wide', 'Leggibile a 3 cm di larghezza'),
        t2('Your “why” is about the viewer, not you', 'Il “perché” riguarda chi guarda, non te'),
      ],
      twist: t2('Swap Noce for a snack you love. Make the winner for real and send it to a friend.', 'Sostituisci Noce con uno snack che ami. Fai davvero la vincente e mandala a qualcuno.'),
    },
  ],

  Writing: [
    {
      who: tag('Camilla’s mirror selfie', 'Il selfie allo specchio di Camilla'),
      brief: t2(
        'Camilla’s gym selfie got 3 likes and no comments. Rewrite her caption in 12 words or fewer so a friend wants to answer.',
        'Il selfie in palestra di Camilla ha 3 like e nessun commento. Riscrivi la sua caption in 12 parole al massimo, così che i suoi amici abbiano voglia di risponderle.'),
      asset: {
        mono: false,
        img: '/img/m/camilla.webp',
        title: t2('Camilla’s caption · 3 likes, 0 comments', 'La caption di Camilla · 3 like, 0 commenti'),
        body: t2(
          'Gym day 💪 Feeling good #gym #fitness\nWhat Camilla didn’t say:\n– she almost stayed home\n– her bag strap snapped on the bus\n– first time lifting 40 kg',
          'Giorno di palestra 💪 Mi sento bene #gym #fitness\nCosa Camilla non ha detto:\n– stava per restare a casa\n– le si è rotta la tracolla sul bus\n– prima volta con 40 kg'),
      },
      steps: [
        t2('Pick the details a friend would ask about.', 'Scegli i dettagli che farebbero fare domande agli amici.'),
        t2('Write the caption in 12 words or fewer. No hashtags.', 'Scrivi la caption in 12 parole al massimo. Niente hashtag.'),
        t2('Send it to a friend who lifts.', 'Mandala a chi viene in palestra con te.'),
      ],
      mins: 2,
      bar: [
        t2('Real details, not “feeling good”', 'Dettagli veri, non “mi sento bene”'),
        t2('No hashtags, 12 words or fewer', 'Niente hashtag, 12 parole al massimo'),
        t2('A friend would want to reply', 'Gli amici avrebbero voglia di rispondere'),
      ],
      twist: t2('Bonus: cut it to 6 words and keep the funny part.', 'Bonus: riducila a 6 parole e tieni la parte buffa.'),
    },
    {
      who: tag('Parlo, a language app (fictional)', 'Parlo, app di lingue (fittizia)'),
      brief: t2(
        'Parlo, a language app, wants Leo back after 3 quiet days. Write the push notification that pops up: 10 words max, no guilt.',
        'Parlo, un’app per le lingue, vuole che Leo torni dopo 3 giorni senza aprirla. Scrivi la notifica che compare sul telefono: 10 parole al massimo, niente sensi di colpa.'),
      asset: {
        mono: false,
        title: t2('Parlo · who you’re writing to', 'Parlo · a chi scrivi'),
        body: t2(
          'Leo, learning Spanish for a trip in June\nLast lesson: ordering a coffee, 3 days ago\nLeo is busy, not lazy\nBanned: guilt, threats, fake countdowns\nSpace: one notification line, 10 words max',
          'Leo studia spagnolo per un viaggio a giugno\nUltima lezione: ordinare un caffè, 3 giorni fa\nLeo è impegnato, non pigro\nVietato: sensi di colpa, minacce, conti alla rovescia finti\nSpazio: una riga di notifica, 10 parole al massimo'),
      },
      steps: [
        t2('Look for one real thing Leo already did.', 'Cerca una cosa che Leo ha già fatto davvero.'),
        t2('Write the message in 10 words or fewer.', 'Scrivi il messaggio in 10 parole al massimo.'),
        t2('Swap any nagging word for a kind one.', 'Sostituisci ogni parola da predica con una gentile.'),
      ],
      mins: 3,
      bar: [
        t2('Names something Leo really did', 'Nomina qualcosa che Leo ha fatto davvero'),
        t2('Kind: no guilt, no countdown', 'Gentile: niente colpe né conti alla rovescia'),
        t2('You would tap it yourself', 'Lo toccheresti anche tu'),
      ],
      twist: t2('Bonus: reword it for a friend who owes you a reply. Send it.', 'Bonus: riscrivilo per chi ti deve una risposta. Mandalo.'),
    },
    {
      who: tag('Elisa’s birthday', 'Il compleanno di Elisa'),
      brief: t2(
        'Elisa turns 28 tomorrow and you always send “Happy birthday! 🎉”. Write three versions: funny, warm, tiny. A friend picks the keeper. Pair up, or do both parts.',
        'Elisa compie 28 anni domani e tu le scrivi sempre “Buon compleanno! 🎉”. Scrivine tre versioni: divertente, calda, minuscola. Qualcuno sceglie la migliore. In due, o fai entrambe le parti.'),
      asset: {
        mono: false,
        title: t2('Elisa, 28 tomorrow', 'Elisa, 28 anni domani'),
        body: t2(
          'You always send: Happy birthday! 🎉\nShe loves: midnight pasta, being late, her dog Fritz\nShe hates: surprise parties\nYou shared a flat for 2 years\nNo “wishing you all the best”',
          'Di solito scrivi: Buon compleanno! 🎉\nLe piace: la pasta di mezzanotte, arrivare tardi, il suo cane Fritz\nOdia: le feste a sorpresa\nAvete diviso casa per 2 anni\nVietato “ti auguro il meglio”'),
      },
      steps: [
        t2('Write the funny version using a detail from the list.', 'Scrivi la versione divertente con un dettaglio della lista.'),
        t2('Write the warm version: say something you’d really say.', 'Scrivi la versione calda: di’ qualcosa che diresti davvero.'),
        t2('Write the tiny version in 8 words or fewer.', 'Scrivi la versione minuscola in 8 parole al massimo.'),
      ],
      mins: 3,
      bar: [
        t2('Each version sounds different', 'Ogni versione suona diversa'),
        t2('One detail only Elisa would get', 'Un dettaglio che capirebbe solo Elisa'),
        t2('The tiny version is 8 words or fewer', 'La versione minuscola ha 8 parole al massimo'),
      ],
      twist: t2('Copy the keeper. Send it to someone whose birthday is coming.', 'Copia quella da tenere. Mandala a chi compie gli anni presto.'),
    },
    {
      who: tag('Bolla Laundry (fictional)', 'Lavanderia Bolla (fittizia)'),
      brief: t2(
        'Bolla Laundry’s bio could be about any laundry. Rewrite it in 20 words or fewer so a student new in town finds it.',
        'La bio della Lavanderia Bolla vale per qualsiasi lavanderia. Riscrivila in 20 parole al massimo, così che chi studia ed è appena arrivato in città la trovi.'),
      asset: {
        mono: false,
        title: t2('Bolla Laundry · bio today', 'Lavanderia Bolla · la bio di oggi'),
        body: t2(
          'Welcome to Bolla! 🧺 Self-service laundry, best quality, best prices. Open most days. Visit us!\nTrue facts:\n– next to the university gate\n– wash €4, dry €3, soap included\n– free wifi and a shelf of books to swap\n– open every day, even Sunday',
          'Benvenuti da Bolla! 🧺 Lavanderia self-service, qualità migliore, prezzi migliori. Aperti quasi tutti i giorni. Venite a trovarci!\nFatti veri:\n– accanto al cancello dell’università\n– lavaggio 4 €, asciugatura 3 €, sapone incluso\n– wifi gratis e uno scaffale di libri da scambiare\n– aperti ogni giorno, anche la domenica'),
      },
      steps: [
        t2('Cross out the words any laundry could say.', 'Cancella le parole che direbbe qualsiasi lavanderia.'),
        t2('Choose the 3 facts a student needs most.', 'Scegli i 3 fatti più utili per chi studia.'),
        t2('Write the bio in 20 words or fewer.', 'Scrivi la bio in 20 parole al massimo.'),
      ],
      mins: 4,
      bar: [
        t2('A student knows where to go', 'Chi studia capisce dove andare'),
        t2('Real prices, no empty adjectives', 'Prezzi veri, niente aggettivi vuoti'),
        t2('Sounds like a person, not a catalogue', 'Suona come una persona, non come un catalogo'),
      ],
      twist: t2('Bonus: rewrite your own bio the same way, and post it tonight.', 'Bonus: riscrivi la tua bio allo stesso modo e pubblicala stasera.'),
    },
    {
      who: tag('Cinema Orsa (fictional)', 'Cinema Orsa (fittizio)'),
      brief: t2(
        'Cinema Orsa raised tickets by €1, and one comment is rude. Reply as the cinema in 25 words or fewer, calm and human.',
        'Cinema Orsa ha alzato il biglietto di 1 € e un commento è maleducato. Rispondi come il cinema in 25 parole al massimo, con calma e da persona vera.'),
      asset: {
        mono: false,
        title: t2('Under Orsa’s post · the rude comment', 'Sotto il post di Orsa · il commento maleducato'),
        body: t2(
          'Post: Tickets are now €8 (was €7).\nComment: €8 to sit in the dark?? I’ll watch it at home. Greedy 🙄\nTrue: heating and film rental cost 25% more\nAlso true: first rise in 4 years, Tuesdays stay €5\nRules: no sarcasm, no insults, no begging',
          'Post: Il biglietto ora costa 8 € (prima 7 €).\nCommento: 8 € per stare al buio?? Me lo guardo a casa. Che ladri 🙄\nVero: riscaldamento e noleggio dei film costano il 25% in più\nVero anche questo: primo aumento in 4 anni, il martedì resta 5 €\nRegole: niente sarcasmo, niente insulti, niente suppliche'),
      },
      steps: [
        t2('Find what the angry comment is really about.', 'Trova di cosa parla davvero il commento arrabbiato.'),
        t2('Write your reply in 25 words or fewer.', 'Scrivi la risposta in 25 parole al massimo.'),
        t2('Cut any word that sounds defensive.', 'Togli ogni parola che suona difensiva.'),
      ],
      mins: 4,
      bar: [
        t2('Names the €1, no hiding', 'Nomina l’aumento di 1 €, senza nascondersi'),
        t2('One true reason, no excuses', 'Un motivo vero, niente scuse'),
        t2('Ends warmly, with no sarcasm', 'Finisce con calore, senza sarcasmo'),
      ],
      twist: t2('Copy it. Send it to someone and ask: would you still come?', 'Copiala. Mandala a qualcuno e chiedi: ci verresti lo stesso?'),
    },
    {
      who: tag('Pigro Gelato (fictional)', 'Pigro Gelato (fittizio)'),
      brief: t2(
        'Pigro Gelato has a new flavour and no name. One writes three names, one picks and writes the counter sign. Pair up, or do both parts.',
        'Pigro Gelato ha un gusto nuovo e nessun nome. Uno scrive tre nomi, l’altro sceglie e scrive il cartello per il banco. In due, o fai entrambe le parti.'),
      asset: {
        mono: false,
        title: t2('Pigro Gelato · new flavour, no name', 'Pigro Gelato · gusto nuovo, senza nome'),
        body: t2(
          'What’s in it: roasted hazelnuts, sea salt, a dark chocolate ribbon\nTaste: sweet first, a little salt at the end\nArrives: Friday, in the case between pistachio and lemon\nThe shop’s voice: lazy, kind, a bit funny\nRule: names are 3 words or fewer',
          'Dentro: nocciole tostate, sale marino, un nastro di cioccolato fondente\nSapore: prima dolce, alla fine un po’ di sale\nArriva: venerdì, in vetrina tra pistacchio e limone\nLa voce del locale: pigra, gentile, un po’ buffa\nRegola: i nomi hanno 3 parole al massimo'),
      },
      steps: [
        t2('Write 3 names, each 3 words or fewer.', 'Scrivi 3 nomi, ognuno di 3 parole al massimo.'),
        t2('Pick the one you would say out loud at the counter.', 'Scegli quello che diresti ad alta voce al banco.'),
        t2('Write the sign under it: 12 words or fewer.', 'Scrivi il cartello sotto: 12 parole al massimo.'),
      ],
      mins: 5,
      bar: [
        t2('The name hints at the taste', 'Il nome fa intuire il gusto'),
        t2('The sign sounds like the shop’s voice', 'Il cartello suona come la voce del locale'),
        t2('The sign says facts, not adjectives', 'Il cartello dice fatti, non aggettivi'),
      ],
      twist: t2('Copy the name and sign. Post them, or send them to a gelato fan.', 'Copia nome e cartello. Pubblicali, o mandali a chi ama il gelato.'),
    },
  ],

  Code: [
    {
      who: tag('Moss Merch, a band’s hoodie drop (fictional)', 'Moss Merch, il drop di felpe di una band (fittizio)'),
      brief: t2(
        'The last Moss Merch hoodie is gone. The Buy button should turn red, but it stays green. One word is off. Find it.',
        'L’ultima felpa di Moss Merch è finita. Il pulsante Compra dovrebbe diventare rosso, ma resta verde. Una parola è sbagliata. Trovala.'),
      asset: {
        mono: true,
        title: t2('This code turns the Buy button red when no hoodies are left', 'Questo codice rende rosso il pulsante Compra quando le felpe sono finite'),
        body: t2(
          '// Moss Merch · Buy hoodie\nlet hoodiesLeft = 0;\nlet color = "green";\nif (hoodiesLeft === 0) colour = "red";\npaintButton(color);',
          '// Moss Merch · Compra felpa\nlet hoodiesLeft = 0;\nlet color = "green";\nif (hoodiesLeft === 0) colour = "red";\npaintButton(color);'),
      },
      steps: [
        t2('Read the code out loud, line by line.', 'Leggi il codice ad alta voce, riga per riga.'),
        t2('Find the line that should turn the button red.', 'Trova la riga che dovrebbe rendere rosso il pulsante.'),
        t2('Type that line again, fixed.', 'Riscrivi quella riga, corretta.'),
      ],
      mins: 2,
      bar: [
        t2('Your fixed line uses color, not colour', 'La tua riga corretta usa color, non colour'),
        t2('You changed only that one line', 'Hai cambiato solo quella riga'),
        t2('You can explain the mistake in a sentence', 'Sai spiegare l’errore in una frase'),
      ],
      twist: t2('Send the broken code to someone: “Why is my button still green?” Time them.', 'Manda il codice rotto a qualcuno: “Perché il mio pulsante è ancora verde?” Cronometra quanto ci mette.'),
    },
    {
      who: tag('Pizzeria Zeta (fictional)', 'Pizzeria Zeta (fittizia)'),
      brief: t2(
        'Pizzeria Zeta wants a “which pizza are you?” quiz for its stories. Write rules, “IF this THEN that”, so every answer lands on one pizza.',
        'Pizzeria Zeta vuole un quiz “che pizza sei?” per le storie. Scrivi regole “SE questo ALLORA quello”, così ogni risposta porta a una sola pizza.'),
      asset: {
        mono: true,
        title: t2('The quiz · what your rules must cover', 'Il quiz · cosa devono coprire le regole'),
        body: t2(
          'Q1  Saturday night: stay in / go out\nQ2  Spice: none / lots\nPizza 1  Margherita\nPizza 2  Diavola\nPizza 3  Quattro Formaggi\nShape  IF (answers) THEN (pizza)',
          'D1  Sabato sera: a casa / fuori\nD2  Piccante: niente / tanto\nPizza 1  Margherita\nPizza 2  Diavola\nPizza 3  Quattro Formaggi\nForma  SE (risposte) ALLORA (pizza)'),
      },
      steps: [
        t2('Write 3 rules, one line each, starting with IF.', 'Scrivi 3 regole, una per riga, che iniziano con SE.'),
        t2('Test all four kinds of people: does each land on one pizza?', 'Prova i quattro tipi di persona: ognuno ha una pizza?'),
        t2('Fix any rule that leaves someone with no pizza, or two.', 'Correggi ogni regola che lascia qualcuno senza pizza, o con due.'),
      ],
      mins: 3,
      bar: [
        t2('All four kinds of people get a pizza', 'Tutti e quattro i tipi ricevono una pizza'),
        t2('No one gets two different pizzas', 'Nessuno riceve due pizze diverse'),
        t2('Each rule fits on one line', 'Ogni regola sta su una riga'),
      ],
      twist: t2('Post the two questions as story polls. Reply to each person who votes with their pizza.', 'Pubblica le due domande come sondaggi nelle storie. Rispondi a chi vota con la sua pizza.'),
    },
    {
      who: tag('Flatmates’ group chat', 'Chat dei coinquilini'),
      brief: t2(
        'The last to reply to “cinema tonight?” pays for the tickets. One plays Ada and hunts for a trick, the other fixes the rule. Pair up, or do both parts.',
        'Chi risponde per ultimo a “cinema stasera?” paga i biglietti. Una persona è Ada e cerca un trucco, l’altra corregge la regola. In coppia, o fai entrambe le parti.'),
      asset: {
        mono: false,
        title: t2('The flat’s rule and tonight’s chat', 'La regola della casa e la chat di stasera'),
        body: t2(
          'Rule: IF you are the last to reply, THEN you pay.\n20:00 Omar: cinema tonight?\n20:01 Vera: yes!\n20:04 Pia: ok\nAda: (never answers)',
          'Regola: SE rispondi per ultimo, ALLORA paghi.\n20:00 Omar: cinema stasera?\n20:01 Vera: sì!\n20:04 Pia: ok\nAda: (non risponde mai)'),
      },
      steps: [
        t2('Play Ada: find a way to never pay.', 'Fai la parte di Ada: trova un modo per non pagare mai.'),
        t2('Rewrite the rule so that trick fails.', 'Riscrivi la regola in modo che quel trucco non funzioni.'),
        t2('Hunt for a second trick against your new rule.', 'Cerca un secondo trucco contro la tua nuova regola.'),
      ],
      mins: 3,
      bar: [
        t2('Ada’s trick no longer works', 'Il trucco di Ada non funziona più'),
        t2('Someone always ends up paying', 'Qualcuno finisce sempre per pagare'),
        t2('The rule still fits in two lines', 'La regola sta ancora in due righe'),
      ],
      twist: t2('Send your fixed rule to your real group chat. See how long it takes someone to beat it.', 'Manda la tua regola corretta alla tua vera chat di gruppo. Vedi quanto ci mette qualcuno a batterla.'),
    },
    {
      who: tag('Dado Games, a board-game shop (fictional)', 'Dado Games, un negozio di giochi da tavolo (fittizio)'),
      brief: t2(
        'Dado Games gave out the code DADO10, 10% off. But its sheet makes a 40 euro basket cost 44. Find the mistake in the formula and fix it.',
        'Dado Games ha dato il codice DADO10, 10% di sconto. Ma il suo foglio fa costare 44 euro un carrello da 40. Trova l’errore nella formula e correggilo.'),
      asset: {
        mono: true,
        title: t2('This sheet takes the code’s 10% off a basket', 'Questo foglio toglie il 10% del codice da un carrello'),
        body: t2(
          'A1 Basket  B1  40\nA2 Code    B2  10%\nA3 To pay  B3  =B1+B1*B2\n* means times\nThe sheet shows 44.',
          'A1 Carrello  B1  40\nA2 Codice    B2  10%\nA3 Da pagare B3  =B1+B1*B2\n* vuol dire per\nIl foglio mostra 44.'),
      },
      steps: [
        t2('Work out by hand what a 40 euro basket should cost.', 'Calcola a mano quanto dovrebbe costare un carrello da 40 euro.'),
        t2('Find the part of the formula that goes the wrong way.', 'Trova la parte della formula che va nel verso sbagliato.'),
        t2('Write the fixed formula.', 'Scrivi la formula corretta.'),
      ],
      mins: 3,
      bar: [
        t2('Your formula gives 36 for 40', 'La tua formula dà 36 per 40'),
        t2('A basket of 100 now costs 90', 'Un carrello da 100 ora costa 90'),
        t2('You can say why the price went up', 'Sai dire perché il prezzo saliva'),
      ],
      twist: t2('Write one line announcing the code to customers. Post it, or send it to a friend.', 'Scrivi una riga che annunci il codice ai clienti. Pubblicala, o mandala a qualcuno.'),
    },
    {
      who: tag('Sunny Plants, a plant shop (fictional)', 'Sunny Plants, un negozio di piante (fittizio)'),
      brief: t2(
        'Every photo Sunny Plants posts gets a DM that just says “price?”. Write the rules for an auto-reply that answers well and never guesses.',
        'Ogni foto che Sunny Plants pubblica riceve un DM che dice solo “prezzo?”. Scrivi le regole di una risposta automatica che risponde bene e non tira a indovinare.'),
      asset: {
        mono: true,
        title: t2('The price list and three real DMs', 'Il listino e tre DM veri'),
        body: t2(
          'Prices (euro): fern 35 · cactus 18 · monstera 42\nDM 1: price?\nDM 2: how much for the monstera\nDM 3: can u ship to Bologna',
          'Prezzi (euro): felce 35 · cactus 18 · monstera 42\nDM 1: prezzo?\nDM 2: quanto costa la monstera\nDM 3: spedite a Bologna?'),
      },
      steps: [
        t2('Write the rule and reply for DM 2: someone names a plant.', 'Scrivi regola e risposta per il DM 2: qualcuno nomina una pianta.'),
        t2('Write the rule and reply for DM 1: nobody names a plant.', 'Scrivi regola e risposta per il DM 1: nessuno nomina una pianta.'),
        t2('Write a last rule and reply: anything else goes to a person.', 'Scrivi un’ultima regola e risposta: il resto passa a una persona.'),
      ],
      mins: 4,
      bar: [
        t2('DM 1 gets a question, not a guess', 'Il DM 1 riceve una domanda, non un’ipotesi'),
        t2('DM 3 reaches a real person', 'Il DM 3 arriva a una persona vera'),
        t2('Replies sound like Sunny Plants, not a robot', 'Suonano come Sunny Plants, non come un robot'),
      ],
      twist: t2('Let someone play the customer. Ask them to DM three questions you did not plan for.', 'Fai fare il cliente a qualcuno: chiedi di mandarti tre DM che non avevi previsto.'),
    },
    {
      who: tag('Your neighbour and your basil', 'Chi ti innaffia il basilico'),
      brief: t2(
        'Your neighbour Nico waters your basil tomorrow. One person writes the steps with only DO, REPEAT UNTIL and IF, the other is the robot. Pair up, or do both parts.',
        'Domani Nico, il tuo vicino, innaffia il basilico. Una persona scrive passaggi con solo FAI, RIPETI FINCHÉ e SE, l’altra fa il robot. In coppia, o fai entrambe le parti.'),
      asset: {
        mono: true,
        title: t2('The robot only understands 3 kinds of line', 'Il robot capisce solo 3 tipi di riga'),
        body: t2(
          'DO      one small action\nREPEAT  an action UNTIL you can see a result\nIF      something is true THEN an action\nThe basil sits on the windowsill, in a pot with a saucer.\nThe watering can is under the sink.\nThe tap is in the kitchen.',
          'FAI     una piccola azione\nRIPETI  un’azione FINCHÉ vedi un risultato\nSE      qualcosa è vero ALLORA un’azione\nIl basilico sta sul davanzale, in un vaso con il sottovaso.\nL’annaffiatoio è sotto il lavandino.\nIl rubinetto è in cucina.'),
      },
      steps: [
        t2('Write the steps to water the basil, one DO per line.', 'Scrivi i passaggi per innaffiare il basilico, un FAI per riga.'),
        t2('Add one REPEAT line and one IF line the robot can check.', 'Aggiungi una riga RIPETI e una SE che il robot può controllare.'),
        t2('Follow the steps like the robot: never guess.', 'Segui i passaggi come il robot: mai tirare a indovinare.'),
      ],
      mins: 5,
      bar: [
        t2('The robot never has to guess', 'Il robot non deve mai tirare a indovinare'),
        t2('Your REPEAT stops on something visible', 'Il RIPETI si ferma su qualcosa di visibile'),
        t2('It handles a plant that is already wet', 'Gestisce una pianta già bagnata'),
      ],
      twist: t2('Send the steps to a friend. Ask which line was unclear.', 'Manda i passaggi a una persona amica. Chiedi quale riga era poco chiara.'),
    },
  ],

  Video: [
    {
      who: tag('Tosta, a toasted-sandwich van (fictional)', 'Tosta, un furgone di toast (fittizio)'),
      brief: t2(
        "Rocco’s 30-second clip of his first toastie at Tosta starts slowly. Type a cut list of 12 seconds or less that opens on the best moment.",
        "La clip di 30 secondi di Rocco, al suo primo toast da Tosta, parte piano. Scrivi una lista dei tagli di 12 secondi al massimo che apra sul momento migliore."),
      asset: {
        mono: true,
        title: t2('The clip, second by second', 'La clip, secondo per secondo'),
        body: t2(
          '0-6s    Rocco walks to the van\n6-16s   Reads the menu, waits, phone wobbles\n16-19s  The press closes, steam\n19-22s  Toastie lifts, cheese stretches an arm long\n22-26s  First bite: “OK. OK. OK.”\n26-30s  Walks off, says bye to nobody',
          '0-6s    Rocco cammina verso il furgone\n6-16s   Legge il menu, aspetta, il telefono traballa\n16-19s  La piastra si chiude, vapore\n19-22s  Il toast si alza, il formaggio fila lungo un braccio\n22-26s  Primo morso: “OK. OK. OK.”\n26-30s  Se ne va e saluta il vuoto'),
      },
      steps: [
        t2('Pick the best moment, the one you would replay.', 'Scegli il momento migliore, quello che riguarderesti.'),
        t2('Type your cut list: start-end seconds for each piece.', 'Scrivi la lista dei tagli: inizio-fine in secondi per ogni pezzo.'),
        t2('Add up the seconds. Keep it at 12 or less.', 'Somma i secondi. Devono essere 12 o meno.'),
      ],
      mins: 2,
      bar: [
        t2('It opens on the best moment', 'Apre sul momento migliore'),
        t2('The total is 12 seconds or less', 'Il totale è al massimo 12 secondi'),
        t2('No walking or waiting shots', 'Niente camminate né attese'),
      ],
      twist: t2('Do the same cut on one of your own clips and post it tonight.', 'Fai lo stesso taglio su una tua clip e pubblicala stasera.'),
    },
    {
      who: tag('Zumo, a pocket speaker (fictional)', 'Zumo, una cassa tascabile (fittizia)'),
      brief: t2(
        "POV means the phone is your eyes. Your Zumo speaker is gone and cousin Bea looks very innocent. Plan a 10-second skit: 3 shots, with seconds and text.",
        "POV: il telefono sono i tuoi occhi. La cassa Zumo è sparita e la cugina Bea sembra innocente. Pianifica una scenetta di 10 secondi: 3 inquadrature, con secondi e testo."),
      asset: {
        mono: false,
        title: t2('The rules of the skit', 'Le regole della scenetta'),
        body: t2(
          'Length: 10 seconds, one phone, one take\nWhere: the living room\nEvidence: an empty shelf, a loose cable, one innocent face\nShot 1 must show the empty shelf\nText on screen: 6 words or fewer per shot',
          'Durata: 10 secondi, un telefono, un’unica ripresa\nDove: il salotto\nProve: uno scaffale vuoto, un cavo penzoloni, una faccia innocente\nL’inquadratura 1 deve mostrare lo scaffale vuoto\nTesto a schermo: massimo 6 parole per inquadratura'),
      },
      steps: [
        t2('Write the 3 shots, one line each, with seconds.', 'Scrivi le 3 inquadrature, una riga ciascuna, con i secondi.'),
        t2('Check the seconds add up to 10.', 'Controlla che i secondi facciano 10.'),
        t2('Add the text for each shot, 6 words or fewer.', 'Aggiungi il testo di ogni inquadratura, massimo 6 parole.'),
      ],
      mins: 3,
      bar: [
        t2('Seconds add up to exactly 10', 'I secondi fanno esattamente 10'),
        t2('It opens on the empty shelf', 'Apre sullo scaffale vuoto'),
        t2('Every text is 6 words or fewer', 'Ogni testo ha al massimo 6 parole'),
      ],
      twist: t2('Copy it and send it to someone who will laugh. Or film it tonight and post it.', 'Copialo e mandalo a chi riderà. Oppure giralo stasera e pubblicalo.'),
    },
    {
      who: tag('Worst job ever, in two', 'Il peggior impiego di sempre, in due'),
      brief: t2(
        "Film a worst-job story in 20 seconds. One person tells it. The other directs from behind the phone with three spoken questions. Pair up, or do both parts.",
        "Filma la storia del peggior impiego in 20 secondi. Una persona la racconta. L’altra dirige da dietro il telefono con tre domande. In due, o fai entrambe le parti."),
      asset: {
        mono: false,
        title: t2('No worst job? Borrow Tino’s', 'Nessun impiego da incubo? Usa quello di Tino'),
        body: t2(
          'Tino handed out flyers for a gym, dressed as a banana.\nIt was 32 degrees and the costume had no air.\nNobody took a flyer. One kid asked: “Are you a lemon?”',
          'Tino distribuiva volantini di una palestra in costume da banana.\nC’erano 32 gradi e il costume non faceva passare aria.\nNessuno ha preso un volantino. Un bambino ha chiesto: “Sei un limone?”'),
      },
      steps: [
        t2('Pick the job: yours, or Tino’s.', 'Scegli l’impiego: il tuo o quello di Tino.'),
        t2('Director: write 3 questions to say at 0s, 7s and 14s.', 'Regia: scrivi 3 domande da dire a 0s, 7s e 14s.'),
        t2('Storyteller: answer each one in 12 words or fewer.', 'Chi racconta: rispondi a ognuna in 12 parole al massimo.'),
      ],
      mins: 3,
      bar: [
        t2('Questions land at 0s, 7s and 14s', 'Le domande cadono a 0s, 7s e 14s'),
        t2('Each is a question, never an order', 'Ognuna è una domanda, non un ordine'),
        t2('The last answer is the punchline', 'L’ultima risposta è la battuta finale'),
      ],
      twist: t2('Copy it. Film it tonight, 20 seconds, and post it or send it to the group chat.', 'Copialo. Giralo stasera, 20 secondi, e pubblicalo o mandalo nel gruppo.'),
    },
    {
      who: tag('Pedala, a bike workshop (fictional)', 'Pedala, una ciclofficina (fittizia)'),
      brief: t2(
        "Greta’s 12-second Pedala clip shows her words as one wall of tiny text. Rewrite it as on-screen captions, each 5 words or fewer and 1.5 seconds or more, no gaps.",
        "La clip di Greta per Pedala, 12 secondi, mostra le parole come un muro di testo minuscolo. Riscrivilo come sottotitoli di massimo 5 parole e almeno 1,5 secondi, senza buchi."),
      asset: {
        mono: true,
        title: t2('What Greta says, and what shows now', 'Cosa dice Greta, e cosa si vede ora'),
        body: t2(
          '0-4s   “Hi, welcome back. Today: flat tyre.”\n4-8s   “Ten minutes, one patch. Only five euros.”\n8-12s  “The culprit? One tiny nail.”\nNow: all 18 words in one block, 0-12s',
          '0-4s   “Ciao, bentornati. Oggi: una gomma a terra.”\n4-8s   “Dieci minuti, una toppa. Solo cinque euro.”\n8-12s  “Il colpevole? Un chiodino.”\nOra: tutte le 18 parole in un blocco, 0-12s'),
      },
      steps: [
        t2('Split Greta’s lines into captions of 5 words or fewer.', 'Dividi le frasi di Greta in sottotitoli di massimo 5 parole.'),
        t2('Add start-end seconds to each caption. Keep each 1.5 seconds or longer.', 'Aggiungi inizio-fine in secondi a ogni sottotitolo. Ciascuno 1,5 secondi o più.'),
        t2('Check the last caption ends at 12 seconds.', 'Controlla che l’ultimo sottotitolo finisca a 12 secondi.'),
      ],
      mins: 4,
      bar: [
        t2('5 words or fewer in every caption', 'Massimo 5 parole per sottotitolo'),
        t2('None on screen under 1.5 seconds', 'Nessuno a schermo meno di 1,5 secondi'),
        t2('No gaps from 0 to 12 seconds', 'Nessun buco da 0 a 12 secondi'),
      ],
      twist: t2('Copy your captions. Add them to a clip of your own and post it.', 'Copia i tuoi sottotitoli. Mettili su una tua clip e pubblicala.'),
    },
    {
      who: tag('Rotella, a skate shop (fictional)', 'Rotella, un negozio di skate (fittizio)'),
      brief: t2(
        "Rotella wants a 10-second skateboard clip: a push, then rolling away. Write what a sports commentator would say over it: one line per shot, about 2 words a second.",
        "Rotella vuole una clip di 10 secondi su uno skate: una spinta, poi via. Scrivi cosa direbbe un telecronista sportivo: una riga per inquadratura, circa 2 parole al secondo."),
      asset: {
        mono: true,
        title: t2('The 4 shots, and how many words fit', 'Le 4 inquadrature, e quante parole ci stanno'),
        body: t2(
          '0-3s   Board on the pavement, wheels still · up to 6 words\n3-6s   One foot on, one hard push · up to 6 words\n6-8s   The wheels start to roll · up to 4 words\n8-10s  Rolling away down the street · up to 4 words',
          '0-3s   Tavola sul marciapiede, ruote ferme · fino a 6 parole\n3-6s   Un piede sopra, una spinta forte · fino a 6 parole\n6-8s   Le ruote iniziano a girare · fino a 4 parole\n8-10s  Si allontana lungo la strada · fino a 4 parole'),
      },
      steps: [
        t2('Write one line for each shot, within its word limit.', 'Scrivi una riga per inquadratura, nel suo limite di parole.'),
        t2('Read it out loud in a stadium voice.', 'Leggila ad alta voce con voce da stadio.'),
        t2('Cut any word you had to rush through.', 'Taglia ogni parola che hai detto di corsa.'),
      ],
      mins: 4,
      bar: [
        t2('Every line fits its word limit', 'Ogni riga rispetta il suo limite'),
        t2('It sounds like a real commentator', 'Sembra una vera telecronaca'),
        t2('The last line makes someone smile', 'L’ultima riga fa sorridere'),
      ],
      twist: t2('Say “Rotella” once, in the last line, without sounding like an ad. Then send it as a voice note.', 'Di’ “Rotella” una volta, nell’ultima riga, senza sembrare una pubblicità. Poi mandalo come nota vocale.'),
    },
    {
      who: tag('Taglio Tondo, a barber shop (fictional)', 'Taglio Tondo, un barbiere (fittizio)'),
      brief: t2(
        "Ivo commented under Taglio Tondo’s video that a €15 haircut is too much. Plan a calm 12-second reply video. Pair up, or do both parts.",
        "Ivo scrive sotto un video di Taglio Tondo: 15 € per un taglio sono troppi. Pianifica una risposta video calma di 12 secondi. In due, o fai entrambe le parti."),
      asset: {
        mono: false,
        title: t2('The comment, and what is true', 'Il commento, e cosa è vero'),
        body: t2(
          'Ivo: “€15 for a haircut?! Mine costs €10.”\nTrue: every cut gets 30 full minutes\nTrue: a hot towel and a neck shave are included\nTone: friendly, no sarcasm, never tell Ivo off',
          'Ivo: “15 € per un taglio?! Il mio costa 10 €.”\nVero: ogni taglio dura 30 minuti pieni\nVero: asciugamano caldo e rasatura del collo inclusi\nTono: amichevole, niente sarcasmo, mai fare la morale a Ivo'),
      },
      steps: [
        t2('One writes 3 shots that add up to 12 seconds.', 'Una persona scrive 3 inquadrature che fanno 12 secondi.'),
        t2('The other writes one line per shot, 8 words or fewer.', 'L’altra scrive una frase per inquadratura, massimo 8 parole.'),
        t2('Read it out loud and cut anything defensive.', 'Leggilo a voce alta e togli tutto ciò che suona sulla difensiva.'),
      ],
      mins: 5,
      bar: [
        t2('Shot 1 shows the comment on screen', 'L’inquadratura 1 mostra il commento'),
        t2('Seconds add up to exactly 12', 'I secondi fanno esattamente 12'),
        t2('It answers Ivo without arguing', 'Risponde a Ivo senza discutere'),
      ],
      twist: t2('Copy it and send it to someone you know. Or film it for real.', 'Copialo e mandalo a qualcuno che conosci. Oppure giralo davvero.'),
    },
  ],

  Selling: [
    {
      who: tag('Giulia’s lamp on Subito', 'la lampada di Giulia su Subito'),
      brief: t2(
        'Giulia’s desk lamp has sat on Subito for three weeks. Zero messages. Rewrite the listing so a buyer wants to write. The price stays €10.',
        'La lampada da scrivania di Giulia è su Subito da tre settimane. Zero messaggi. Riscrivi l’annuncio così che chi compra abbia voglia di scrivere. Il prezzo resta 10 €.'),
      asset: {
        mono: false,
        img: '/img/m/lamp.webp',
        title: t2('Giulia’s listing, and what is true', 'L’annuncio di Giulia, e cosa è vero'),
        body: t2(
          'TITLE: used lamp\nPRICE: €10\nTEXT: “used lamp, 10 euro, write me”\n\nTRUE: black metal desk lamp, 40 cm tall, bulb included\nTRUE: works fine, small chip of paint on the base\nTRUE: pickup in Bologna, or she ships',
          'TITOLO: lampada usata\nPREZZO: 10 €\nTESTO: “lampada usata, 10 euro, scrivetemi”\n\nVERO: lampada da scrivania nera in metallo, alta 40 cm, lampadina inclusa\nVERO: funziona bene, piccola scheggiatura di vernice sulla base\nVERO: ritiro a Bologna, oppure spedisce'),
      },
      steps: [
        t2('Write a title a buyer would type into search.', 'Scrivi un titolo che chi compra digiterebbe nella ricerca.'),
        t2('Write 3 short lines of text, true facts only.', 'Scrivi 3 righe brevi di testo, solo fatti veri.'),
        t2('Name the chipped paint yourself, in plain words.', 'Parla tu della vernice scheggiata, con parole semplici.'),
      ],
      mins: 2,
      bar: [
        t2('The title says what, colour and size', 'Il titolo dice cosa, colore e altezza'),
        t2('Every line is true, flaw included', 'Ogni riga è vera, difetto compreso'),
        t2('It ends by saying how to pick it up', 'Finisce dicendo come ritirarla'),
      ],
      twist: t2('Copy it. Swap in something you really want to sell, or send it to a friend with a pile of stuff.', 'Copialo. Metti al suo posto una cosa che vuoi vendere davvero, o mandalo a chi ha una pila di roba da vendere.'),
    },
    {
      who: tag('Ardi, a hot sauce (fictional)', 'Ardi, una salsa piccante (fittizia)'),
      brief: t2(
        'Ardi, a hot sauce, wants a 15-second phone video from a real person. Type the script: a hook, one proof, one ask.',
        'Ardi, una salsa piccante, vuole un video di 15 secondi girato col telefono da una persona vera. Scrivi lo script: un hook, una prova, una richiesta.'),
      asset: {
        mono: false,
        title: t2('The sauce sheet', 'La scheda della salsa'),
        body: t2(
          'PRODUCT: Ardi hot sauce, 150 ml bottle, €6, sold at delis\nTRUE: made from red chilli, garlic and vinegar\nTRUE: medium heat, warm but not painful\nSHAPE: HOOK (3 seconds), PROOF (show it), ASK (one action)\nLENGTH: 15 seconds spoken, about 40 words\nNEVER: “best ever”, fake reviews, health promises',
          'PRODOTTO: salsa piccante Ardi, bottiglia da 150 ml, 6 €, in vendita in gastronomia\nVERO: fatta con peperoncino rosso, aglio e aceto\nVERO: piccantezza media, calda ma non dolorosa\nSTRUTTURA: HOOK (3 secondi), PROVA (falla vedere), RICHIESTA (una sola azione)\nDURATA: 15 secondi a voce, circa 40 parole\nMAI: “la migliore di sempre”, finte recensioni, promesse sulla salute'),
      },
      steps: [
        t2('Write the hook: one line that fits the first 3 seconds.', 'Scrivi l’hook: una riga che sta nei primi 3 secondi.'),
        t2('Write the proof: one thing the camera can show.', 'Scrivi la prova: una cosa che si può far vedere.'),
        t2('Write the ask: one small thing viewers can do.', 'Scrivi la richiesta: una piccola cosa che chi guarda può fare.'),
      ],
      mins: 3,
      bar: [
        t2('The hook starts mid-moment, not “hi guys”', 'L’hook parte nel vivo, non con “ciao a tutti”'),
        t2('The proof is something we can see or hear', 'La prova si può vedere o sentire'),
        t2('40 words or fewer, no false claims', 'Massimo 40 parole, niente promesse false'),
      ],
      twist: t2('Time it out loud. Swap in something you really like, then film it or send it to a friend.', 'Cronometralo a voce alta. Metti una cosa che ti piace davvero al suo posto, poi giralo o mandalo a qualcuno.'),
    },
    {
      who: tag('Quokka Vintage, a market stall (fictional)', 'Quokka Vintage, un banco al mercatino (fittizio)'),
      brief: t2(
        'Someone at Quokka Vintage’s market stall wants a denim jacket for less. One of you sells, one haggles. Don’t cave to €30, stay friendly. Pair up, or play both sides.',
        'Al banco di Quokka Vintage qualcuno vuole una giacca di jeans a meno. Uno vende, uno tratta. Non cedere ai 30 €, resta gentile. In due, o fai le due parti.'),
      asset: {
        mono: false,
        img: '/img/m/jacket.webp',
        title: t2('Seller card, buyer card', 'Carta di chi vende, carta di chi compra'),
        body: t2(
          'SELLER: denim jacket, size M, price €45\nSELLER ONLY: nothing under €38\nTRUE: faded blue, no stains, one button replaced\nBUYER: wants it for a festival, opens with “Can you do €30?”\nBUYER ONLY: can pay up to €40',
          'CHI VENDE: giacca di jeans, taglia M, prezzo 45 €\nSOLO CHI VENDE: niente sotto i 38 €\nVERO: blu scolorito, nessuna macchia, un bottone sostituito\nCHI COMPRA: la vuole per un festival, apre con “Mi fai 30 €?”\nSOLO CHI COMPRA: può arrivare a 40 €'),
      },
      steps: [
        t2('Seller: answer “€30?” with one true reason, no new price.', 'Chi vende: rispondi a “30 €?” con un motivo vero, senza un nuovo prezzo.'),
        t2('Buyer: answer with one small offer and a reason.', 'Chi compra: rispondi con una piccola offerta e un motivo.'),
        t2('Write the closing message, with the final price in it.', 'Scrivi il messaggio di chiusura, con il prezzo finale.'),
      ],
      mins: 3,
      bar: [
        t2('The seller gives a true reason first', 'Chi vende dà prima un motivo vero'),
        t2('The final price is between €38 and €40', 'Il prezzo finale sta tra 38 € e 40 €'),
        t2('No made-up rival buyer or deadline', 'Nessun altro interessato né scadenza inventati'),
      ],
      twist: t2('Copy your closing line. Send it to a friend who never haggles.', 'Copia la tua riga di chiusura. Mandala a qualcuno che non tratta mai.'),
    },
    {
      who: tag('Cera Cera, a candle shop (fictional)', 'Cera Cera, un negozio di candele (fittizio)'),
      brief: t2(
        'Cera Cera wants to send a candle to Sara, a small creator. Their first DM got no reply. Rewrite it so it sounds like a person, not an ad.',
        'Cera Cera vuole mandare una candela a Sara, piccola creator. Il primo DM è rimasto senza risposta. Riscrivilo: deve sembrare una persona, non una pubblicità.'),
      asset: {
        mono: false,
        title: t2('The DM Sara ignored, and what is true', 'Il DM che Sara ha ignorato, e cosa è vero'),
        body: t2(
          'SENT: “Hi dear!!! BEST candles in town 🔥 Collab alert, only TODAY, DM us NOW!!”\nTRUE: Sara posts study-desk videos for about 2,300 followers\nTRUE: her story: “my flat smells of nothing”\nTRUE: Cera Cera is 3 people pouring candles by hand in Turin\nTRUE: you can send her one free Fig Leaf candle (€18)\nTRUE: no post required; if she posts, she says it is a gift',
          'INVIATO: “Ciao cara!!! Le MIGLIORI candele della città 🔥 Collab alert, solo OGGI, scrivici ORA!!”\nVERO: Sara posta video dalla scrivania mentre studia, per circa 2.300 follower\nVERO: la sua storia: “casa mia non sa di niente”\nVERO: Cera Cera sono 3 persone che versano candele a mano a Torino\nVERO: puoi mandarle gratis una candela Fig Leaf (18 €)\nVERO: nessun post richiesto; se posta, dice che è un regalo'),
      },
      steps: [
        t2('Write the 2 phrases that sound most like spam.', 'Scrivi le 2 frasi che suonano più da spam.'),
        t2('Rewrite the DM in 45 words or fewer, using something Sara said.', 'Riscrivi il DM in 45 parole al massimo, usando qualcosa che ha detto Sara.'),
        t2('End with one easy question about the free candle.', 'Chiudi con una domanda facile sulla candela gratis.'),
      ],
      mins: 4,
      bar: [
        t2('Says who you are and that it’s free', 'Dice chi sei e che è gratis'),
        t2('Uses something real that Sara said', 'Usa qualcosa di vero che ha detto Sara'),
        t2('No pressure or countdown, easy to decline', 'Niente pressione né conto alla rovescia, facile dire di no'),
      ],
      twist: t2('Copy it. Send it to a friend with a tiny shop, or save it for yours.', 'Copialo. Mandalo a qualcuno con un piccolo negozio, o tienilo per il tuo.'),
    },
    {
      who: tag('Gnomo Prints, screen-printed goods (fictional)', 'Gnomo Prints, oggetti serigrafati (fittizio)'),
      brief: t2(
        'Gnomo Prints wants one new €8 product and has two ideas. Write the story poll that gives a first hint of which one people would pay for.',
        'Gnomo Prints vuole un nuovo prodotto da 8 € e ha due idee. Scrivi il sondaggio nelle storie che dà un primo indizio su quale pagherebbero.'),
      asset: {
        mono: false,
        title: t2('The two ideas and the rules', 'Le due idee e le regole'),
        body: t2(
          'IDEA A: a pack of 6 stickers\nIDEA B: a set of 4 postcards\nBOTH: €8, screen-printed by hand\nQUESTION: 12 words or fewer, with the real price\nOPTIONS: 4 words or fewer each\nNEVER: “only 10 left!”, fake rush, made-up numbers',
          'IDEA A: un pacchetto da 6 adesivi\nIDEA B: un set da 4 cartoline\nENTRAMBE: 8 €, serigrafate a mano\nDOMANDA: 12 parole al massimo, con il prezzo vero\nOPZIONI: 4 parole al massimo ciascuna\nMAI: “ultimi 10 rimasti!”, finta fretta, numeri inventati'),
      },
      steps: [
        t2('Write the poll question, with the real price.', 'Scrivi la domanda del sondaggio, con il prezzo vero.'),
        t2('Write the two options, 4 words or fewer each.', 'Scrivi le due opzioni, 4 parole al massimo ciascuna.'),
        t2('Add one honest line above it: why you are asking.', 'Aggiungi sopra una riga onesta: perché lo chiedi.'),
      ],
      mins: 4,
      bar: [
        t2('The question names the real price', 'La domanda dice il prezzo vero'),
        t2('Both options are easy to picture', 'Entrambe le opzioni si immaginano subito'),
        t2('No fake rush, no made-up numbers', 'Niente finta fretta, niente numeri inventati'),
      ],
      twist: t2('Copy it. Post it on your story with any two real choices, then count the votes.', 'Copialo. Pubblicalo nelle tue storie con due scelte vere, poi conta i voti.'),
    },
    {
      who: tag('a buyer who goes quiet', 'chi compra e poi sparisce'),
      brief: t2(
        'Someone asks “Is it still available?” about your guitar, then goes quiet. One writes the reply and a nudge, one plays the silent buyer. Pair up, or do both parts.',
        'Qualcuno scrive “È ancora disponibile?” per la tua chitarra, poi sparisce. Uno scrive la risposta e una spintarella, uno fa chi compra e tace. In due, o fai le due parti.'),
      asset: {
        mono: false,
        img: '/img/m/guitar.webp',
        title: t2('The listing and the chat', 'L’annuncio e la chat'),
        body: t2(
          'LISTING: acoustic guitar with soft case, €80, pickup in Padova\nTRUE: new tuning pegs in March, strings are old\nTRUE: small scratch on the back, no tuner\nBUYER SENT: “Is it still available?”\nYOUR REPLY: (you write it)\nTHEN: two days of silence',
          'ANNUNCIO: chitarra acustica con custodia morbida, 80 €, ritiro a Padova\nVERO: meccaniche nuove a marzo, corde vecchie\nVERO: piccolo graffio sul retro, accordatore non incluso\nCHI COMPRA HA SCRITTO: “È ancora disponibile?”\nLA TUA RISPOSTA: (la scrivi tu)\nPOI: due giorni di silenzio'),
      },
      steps: [
        t2('Reply to “Is it still available?” in 25 words or fewer.', 'Rispondi a “È ancora disponibile?” in 25 parole al massimo.'),
        t2('Play the silent buyer: write why you didn’t answer.', 'Fai chi compra e tace: scrivi perché non hai risposto.'),
        t2('Write one nudge for day two, with no pressure.', 'Scrivi una spintarella per il secondo giorno, senza pressione.'),
      ],
      mins: 4,
      bar: [
        t2('The reply says yes and adds one fact', 'La risposta dice sì e aggiunge un fatto'),
        t2('It ends with an easy question to answer', 'Finisce con una domanda facile'),
        t2('The nudge has no fake rival or deadline', 'Niente rivali o scadenze inventati nella spintarella'),
      ],
      twist: t2('Copy your reply. Next time someone asks about something you sell, send it.', 'Copia la tua risposta. La prossima volta che qualcuno ti chiede di una cosa che vendi, mandala.'),
    },
  ],

  Music: [
    {
      who: tag('Noa’s get-ready playlist', 'la playlist di Noa per prepararsi'),
      brief: t2(
        'Noa’s friends arrive at 9 tonight. The playlist should start calm and get louder, but one song kills the mood. Cut it, then fix the order.',
        'Gli amici di Noa arrivano stasera alle 21. La playlist deve partire calma e salire, ma una canzone rovina l’atmosfera. Toglila, poi sistema l’ordine.'),
      asset: {
        mono: true,
        title: t2('Noa’s playlist · energy 1 sleepy, 5 huge', 'La playlist di Noa · energia 1 sonnolenta, 5 esplosiva'),
        body: t2(
          'Mango Static · bright · 4\nSad Trombone Tuesday · gloomy · 1\nPocket Sunrise · warm · 2\nConfetti Cannon · huge · 5\nTile Floor Groove · swaying · 3\nLast Bus Home · dreamy · 2',
          'Mango Static · allegra · 4\nSad Trombone Tuesday · cupa · 1\nPocket Sunrise · calda · 2\nConfetti Cannon · esplosiva · 5\nTile Floor Groove · dondolante · 3\nLast Bus Home · sognante · 2'),
      },
      steps: [
        t2('Name the one song to cut.', 'Scrivi la canzone da togliere.'),
        t2('Type the other five, calmest first, loudest last.', 'Scrivi le altre cinque, dalla più calma alla più forte.'),
        t2('Add one line on why your order works.', 'Aggiungi una riga su perché questo ordine funziona.'),
      ],
      mins: 2,
      bar: [
        t2('The gloomy song is gone', 'La canzone cupa è fuori'),
        t2('Energy climbs and never dips', 'L’energia sale e non scende mai'),
        t2('Your why fits in one line', 'Il tuo perché sta in una riga'),
      ],
      twist: t2('Send the new order to the friend who is always late, with “it only gets louder”.', 'Manda il nuovo ordine a chi arriva sempre in ritardo, con “da qui si sale solo”.'),
    },
    {
      who: tag('Forno Gufo, a bakery opening its roller shutter at 6am (fictional)', 'Forno Gufo, un forno che alza la saracinesca alle 6 (fittizio)'),
      brief: t2(
        'Forno Gufo is posting a 10-second Monday reel. Describe its sound and pick the second the drop hits (the moment the music kicks in).',
        'Forno Gufo pubblica un reel di 10 secondi per il lunedì. Descrivi il suono e scegli il secondo in cui parte il drop (quando la musica entra).'),
      asset: {
        mono: true,
        title: t2('The reel: when each shot starts', 'Il reel: quando parte ogni scena'),
        body: t2(
          '0s  dark street, roller shutter down\n3s  the shutter rolls up\n5s  dough slaps down, flour flies\n8s  first loaf out of the oven\n9s  “Forno Gufo · open from 6”',
          '0s  strada buia, saracinesca giù\n3s  si alza la saracinesca\n5s  l’impasto sbatte sul banco, farina\n8s  la prima pagnotta dal forno\n9s  “Forno Gufo · aperto dalle 6”'),
      },
      steps: [
        t2('Write your sound in three words, like “sleepy, soft, hum”.', 'Scrivi il tuo suono in tre parole, tipo “assonnato, morbido, ronzio”.'),
        t2('Write the second the drop hits.', 'Scrivi il secondo in cui parte il drop.'),
        t2('Write what plays before the drop.', 'Scrivi cosa si sente prima del drop.'),
      ],
      mins: 3,
      bar: [
        t2('The drop starts exactly where a shot starts', 'Il drop parte dove inizia una scena'),
        t2('It is quieter before the drop than after', 'Prima del drop è più piano che dopo'),
        t2('Your three words fit a Monday morning', 'Le tre parole stanno bene a un lunedì mattina'),
      ],
      twist: t2('Write the caption, starting “Sound on.” Swap in a real shop you love, or send it to a friend who edits videos.', 'Scrivi la caption, che inizia con “Alza l’audio.” Metti al posto del forno un negozio che ami davvero, o mandala a chi monta video.'),
    },
    {
      who: tag('Ilaria’s rough day', 'la giornata storta di Ilaria'),
      brief: t2(
        'Ilaria texts you after a rough day. Write the 3 lines you’d say back in a voice message, plus the one song you’d send. Pair up, or do both parts.',
        'Ilaria ti scrive dopo una giornata storta. Scrivi le 3 righe che le diresti in un vocale, più la canzone che le manderesti. In due, o fai entrambe le parti.'),
      asset: {
        mono: false,
        title: t2('Ilaria’s text, as a model', 'Il messaggio di Ilaria, come modello'),
        body: t2(
          'worst day ever\nmissed the bus, coffee all over my notes\nthen the exam went badly\nsay something?? not “it’s fine”',
          'giornata peggiore di sempre\nho perso il bus, caffè su tutti gli appunti\npoi l’esame è andato male\ndimmi qualcosa?? ma non “tutto ok”'),
      },
      steps: [
        t2('Write a 2-line text about a bad day, like Ilaria’s.', 'Scrivi un messaggio di 2 righe su una giornata storta, come Ilaria.'),
        t2('Write 3 lines to say back out loud. Alone? Use Ilaria’s text.', 'Scrivi 3 righe da dire a voce. Senza partner? Usa il messaggio di Ilaria.'),
        t2('Name the one song you’d send, plus one line why.', 'Scrivi la canzone che manderesti, più una riga sul perché.'),
      ],
      mins: 3,
      bar: [
        t2('It sounds like you, not a greeting card', 'Suona come te, non come un biglietto d’auguri'),
        t2('You say something specific, not “it’s fine”', 'Dici qualcosa di preciso, non “tutto ok”'),
        t2('The song fits how they feel right now', 'La canzone rispecchia come si sente adesso'),
      ],
      twist: t2('Record the 3 lines as a voice note and send it with the song to someone who had a rough week.', 'Registra le 3 righe come vocale e mandalo con la canzone a chi ha avuto una settimana dura.'),
    },
    {
      who: tag('Libro Lento, a bookshop (fictional)', 'Libro Lento, una libreria (fittizia)'),
      brief: t2(
        'Libro Lento puts its shop playlist online, but “Shelf mix 3” has 12 followers and a grey cover. Rename it and describe a cover that makes anyone tap play.',
        'Libro Lento mette online la playlist della libreria, ma “Shelf mix 3” ha 12 follower e una cover grigia. Rinominala e descrivi una cover che faccia premere play a chiunque.'),
      asset: {
        mono: true,
        img: '/img/m/playlist-en.webp', imgIt: '/img/m/playlist-it.webp', only: true,
        title: t2('The playlist as it is now', 'La playlist com’è adesso'),
        body: t2(
          'Name       Shelf mix 3\nCover      grey default squares\nAbout      (empty)\nFollowers  12\nVibe       quiet piano, rainy days',
          'Nome       Shelf mix 3\nCover      quadrati grigi di default\nInfo       (vuota)\nFollower   12\nAtmosfera  pianoforte calmo, pioggia'),
      },
      steps: [
        t2('Write a new name, four words or fewer.', 'Scrivi un nuovo nome, quattro parole al massimo.'),
        t2('Describe the cover: one colour, one object, three words on it.', 'Descrivi la cover: un colore, un oggetto, tre parole scritte.'),
        t2('Write one line: when should a stranger press play?', 'Scrivi una riga: quando conviene premere play?'),
      ],
      mins: 3,
      bar: [
        t2('The name sounds like the mood', 'Il nome suona come l’atmosfera'),
        t2('The cover has one colour, one object', 'La cover ha un colore e un oggetto'),
        t2('The line says when to press play', 'La riga dice quando premere play'),
      ],
      twist: t2('Write a second name, as silly as you dare. Send both to a friend: which would they tap?', 'Scrivi un secondo nome, il più assurdo che ti viene. Mandali tutti e due a chi vuoi: quale aprirebbe?'),
    },
    {
      who: tag('Clank Gym (fictional)', 'Clank Gym (fittizia)'),
      brief: t2(
        'Clank Gym wants a beat for its workout reels: eight steps, repeated four times (that makes four bars). Tap it on a table, then type it as a grid.',
        'Clank Gym vuole un ritmo per i suoi reel di allenamento: otto passi, ripetuti quattro volte (fanno quattro battute). Battilo su un tavolo, poi scrivilo come griglia.'),
      asset: {
        mono: true,
        title: t2('Your empty grid', 'La tua griglia vuota'),
        body: t2(
          'Step   1 2 3 4 5 6 7 8\nKick   . . . . . . . .  fist\nSnare  . . . . . . . .  clap\nHat    . . . . . . . .  tap\nX = hit, . = rest · plays 4 times',
          'Passo     1 2 3 4 5 6 7 8\nCassa     . . . . . . . .  pugno\nRullante  . . . . . . . .  mani\nHi-hat    . . . . . . . .  dito\nX = colpo, . = pausa · ripeti 4 volte'),
      },
      steps: [
        t2('Tap a beat on a table: fist, clap, fingertip.', 'Batti un ritmo sul tavolo: pugno, mani, dito.'),
        t2('Type your grid: X for a hit, a dot for a rest.', 'Scrivi la griglia: X per un colpo, un punto per una pausa.'),
        t2('Check it: 2-3 kicks, 1-2 snares, never together on a step.', 'Controlla: 2-3 casse, 1-2 rullanti, mai insieme sullo stesso passo.'),
      ],
      mins: 4,
      bar: [
        t2('You could tap it back from the text', 'Si può battere leggendo il testo'),
        t2('The hat leaves at least one rest', 'L’hi-hat lascia almeno una pausa'),
        t2('It feels steady and strong, like lifting', 'Sembra stabile e forte, come sollevare pesi'),
      ],
      twist: t2('Type it out and send it to a friend. Can they tap it from the text?', 'Scrivila e mandala a chi vuoi. Riesce a batterla solo leggendo?'),
    },
    {
      who: tag('Tiny Pan, a cooking channel (fictional)', 'Tiny Pan, un canale di cucina (fittizio)'),
      brief: t2(
        'Tiny Pan films cooking in a student room with one hotplate. Write its hook, the 4 catchy lines people hum, two lines each. Pair up, or do both parts.',
        'Tiny Pan cucina in una stanza da studente con un fornello. Scrivi il suo hook, 4 righe da canticchiare, due a testa. In coppia, o fai tutte e due le parti.'),
      asset: {
        mono: false,
        title: t2('The hook sheet', 'La scheda dell’hook'),
        body: t2(
          'Line 1: sets the scene\nLine 2: a small disaster\nLine 3: a surprise\nLine 4: says “Tiny Pan”\nSeven words or fewer per line\nEnd lines 2 and 4 on a rhyme',
          'Riga 1: apre la scena\nRiga 2: un piccolo disastro\nRiga 3: una sorpresa\nRiga 4: dice “Tiny Pan”\nSette parole al massimo a riga\nLe righe 2 e 4 finiscono in rima'),
      },
      steps: [
        t2('Write lines 1 and 2: the scene, then a small disaster.', 'Scrivi le righe 1 e 2: la scena, poi un piccolo disastro.'),
        t2('Write lines 3 and 4: a surprise, then “Tiny Pan”.', 'Scrivi le righe 3 e 4: una sorpresa, poi “Tiny Pan”.'),
        t2('Read all four lines aloud, slowly.', 'Leggi tutte e quattro le righe ad alta voce, piano.'),
      ],
      mins: 5,
      bar: [
        t2('It rhymes without sounding forced', 'Fa rima senza forzature'),
        t2('Line 3 surprises instead of repeating', 'La riga 3 sorprende, non ripete'),
        t2('You can say it without tripping', 'Si dice senza inciampare'),
      ],
      twist: t2('Say it into a voice note and send it to a friend. Singing is optional.', 'Dilla in un vocale e mandala a chi vuoi. Cantare è facoltativo.'),
    },
  ],
};
