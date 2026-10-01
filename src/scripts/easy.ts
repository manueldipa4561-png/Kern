import { t2 } from './i18n';
import type { Asset } from './missions';

// "Make it easier": the same 18 missions in plain words, for people with no experience in the field.
// No tools, no jargon, doable on paper. Rewards are identical, so the easy path is never second class.
// A missing asset or hints list falls back to the full version's (missions.ts, helps.ts).
export type Easy = { brief: string; steps: string[]; ex: string; asset?: Asset; hints?: string[] };
type P = [string, string];
const e = (brief: P, steps: P[], ex: P, asset?: { title: P; body: P }, hints?: P[]): Easy => ({
  brief: t2(...brief),
  steps: steps.map((s) => t2(...s)),
  ex: t2(...ex),
  asset: asset ? { mono: false, title: t2(...asset.title), body: t2(...asset.body) } : undefined,
  hints: hints?.map((h) => t2(...h)),
});

export const EASY: Record<string, Easy[]> = {
  Design: [
    e(['An app asks for 5 things before you can start, so most people quit. Which things would you remove?', 'Un’app chiede 5 cose prima di iniziare e quasi tutti rinunciano. Quali toglieresti?'],
      [['Which step would you remove first?', 'Quale passo toglieresti per primo?'], ['Write the 2 or 3 steps you would keep.', 'Scrivi i 2 o 3 passi che terresti.'], ['Write what the first button should say.', 'Scrivi cosa deve dire il primo pulsante.']],
      ['Remove: phone, birthday, inviting friends. Keep: email, pick a habit, set a reminder. First button: “Start my first habit”.', 'Tolgo: telefono, compleanno, invito agli amici. Tengo: email, scegli un’abitudine, imposta un promemoria. Primo pulsante: “Inizia la mia prima abitudine”.']),
    e(['A yoga studio’s booking form has 14 questions, so people give up. Which questions would you keep?', 'Il modulo di un centro yoga ha 14 domande e la gente rinuncia. Quali terresti?'],
      [['Pick the 4 questions you cannot skip.', 'Scegli le 4 domande che non puoi saltare.'], ['Which questions can wait until after booking?', 'Quali domande possono aspettare dopo la prenotazione?'], ['Write a friendly text for the button.', 'Scrivi un testo amichevole per il pulsante.']],
      ['Keep: name, email, class, date. Later: health notes, address, promo code. Button: “Save my spot”.', 'Tengo: nome, email, lezione, data. Dopo: note di salute, indirizzo, codice promo. Pulsante: “Salva il mio posto”.']),
    e(['You open a money app for the first time and the screen is empty. What should it show?', 'Apri per la prima volta un’app di spese e lo schermo è vuoto. Cosa dovrebbe mostrare?'],
      [['Describe what you would put on the screen.', 'Descrivi cosa metteresti sullo schermo.'], ['Write a short title.', 'Scrivi un titolo breve.'], ['What happens when the person taps the button?', 'Cosa succede quando la persona tocca il pulsante?']],
      ['A grey sample “Coffee €2.50”, the title “Log your first coffee” and a button “Add it”. After the tap it shows “Today: €2.50”.', 'Un esempio grigio “Caffè 2,50 €”, il titolo “Registra il tuo primo caffè” e un pulsante “Aggiungilo”. Dopo il tocco mostra “Oggi: 2,50 €”.']),
  ],
  Writing: [
    e(['Explain this in two friendly sentences, as if you were talking to a 10-year-old.', 'Spiegalo in due frasi semplici, come se parlassi a un bambino di 10 anni.'],
      [['Say it out loud first.', 'Dillo prima a voce.'], ['Write it in 2 sentences.', 'Scrivilo in 2 frasi.'], ['Give it a catchy title.', 'Dagli un titolo che incuriosisca.']],
      ['Plants make their own food from sunlight, air and water. What is left over is the oxygen we breathe. Title: How plants cook with light.', 'Le piante producono il loro cibo da luce, aria e acqua. Quello che avanza è l’ossigeno che respiriamo. Titolo: Come cucinano le piante con la luce.'],
      { title: ['Something to explain', 'Qualcosa da spiegare'], body: ['Photosynthesis is how plants use sunlight to turn carbon dioxide and water into sugar and oxygen.', 'La fotosintesi è il modo in cui le piante usano la luce del sole per trasformare anidride carbonica e acqua in zucchero e ossigeno.'] }),
    e(['Nobody did anything after this email. Rewrite it so people know what to do and by when.', 'Nessuno ha fatto nulla dopo questa email. Riscrivila così che si capisca cosa fare e entro quando.'],
      [['What is the one thing people must do?', 'Qual è l’unica cosa che le persone devono fare?'], ['Write the email in 3 short sentences.', 'Scrivi l’email in 3 frasi brevi.'], ['Write a subject line that says what to do.', 'Scrivi un oggetto che dica cosa fare.']],
      ['Subject: Send your expenses by Friday. Hi all, please send September expenses by Friday 28. Questions? Reply here.', 'Oggetto: Invia le spese entro venerdì. Ciao a tutti, inviate le spese di settembre entro venerdì 28. Domande? Rispondete qui.']),
    e(['A magazine starts a story with this line. Add two more sentences.', 'Una rivista inizia un racconto con questa riga. Aggiungi altre due frasi.'],
      [['Write sentence 2: something strange.', 'Scrivi la frase 2: qualcosa di strano.'], ['Write sentence 3: what happens next.', 'Scrivi la frase 3: cosa succede dopo.'], ['Give the story a title.', 'Dai un titolo al racconto.']],
      ['2) Nobody had told the machine it could. 3) It printed a ticket that said “Ask me again tomorrow.” Title: The Machine on Platform 9.', '2) Nessuno aveva detto alla macchina che poteva. 3) Stampò un biglietto: “Chiedimelo ancora domani.” Titolo: La macchina del binario 9.']),
  ],
  Code: [
    e(['A website’s “Copy link” button does nothing. You do not need to code. Think like a detective.', 'Il pulsante “Copia link” di un sito non fa nulla. Non serve programmare. Ragiona da detective.'],
      [['List 3 things that could stop a button from working.', 'Elenca 3 cose che possono bloccare un pulsante.'], ['Which one would you check first, and why?', 'Quale controlleresti per prima, e perché?'], ['How would you know it is fixed?', 'Come capiresti che è risolto?']],
      ['1) The button is not connected to its action. 2) The names do not match. 3) The action runs too early. I would check the connection first, because the button does nothing at all. It is fixed when I tap it and the page address is copied.', '1) Il pulsante non è collegato alla sua azione. 2) I nomi non corrispondono. 3) L’azione parte troppo presto. Controllerei prima il collegamento, perché il pulsante non fa proprio nulla. È risolto quando lo tocco e l’indirizzo della pagina viene copiato.'],
      { title: ['What is happening', 'Cosa succede'], body: ['A website has a button called “Copy link”. It should copy the page address when you tap it. But when you tap it, nothing happens.', 'Un sito ha un pulsante “Copia link”. Dovrebbe copiare l’indirizzo della pagina quando lo tocchi. Ma toccandolo non succede nulla.'] },
      [['What should happen when you tap it?', 'Cosa dovrebbe succedere quando lo tocchi?'], ['What could be missing between the tap and the result?', 'Cosa potrebbe mancare tra il tocco e il risultato?'], ['How would you test it after a fix?', 'Come lo proveresti dopo la correzione?']]),
    e(['Four friends share an €80 dinner and add a 10% tip. How much does each person pay? Show your steps.', 'Quattro amici dividono una cena da 80 € e aggiungono il 10% di mancia. Quanto paga ciascuno? Mostra i passaggi.'],
      [['Work out the tip.', 'Calcola la mancia.'], ['Work out the total with the tip.', 'Calcola il totale con la mancia.'], ['Divide it between the friends.', 'Dividilo tra gli amici.']],
      ['Tip: 80 × 10% = 8. Total: 80 + 8 = 88. Each person pays 88 ÷ 4 = €22.', 'Mancia: 80 × 10% = 8. Totale: 80 + 8 = 88. Ognuno paga 88 ÷ 4 = 22 €.'],
      { title: ['The dinner', 'La cena'], body: ['Bill: €80\nFriends: 4\nTip: 10%', 'Conto: 80 €\nAmici: 4\nMancia: 10%'] },
      [['What is 10% of 80?', 'Quanto è il 10% di 80?'], ['What is the total with the tip?', 'Qual è il totale con la mancia?'], ['How do you share it equally?', 'Come lo dividi in parti uguali?']]),
    e(['A notes app wants a dark mode button that remembers your choice. Say how it should work, in plain words.', 'Un’app per appunti vuole un pulsante per la modalità scura che ricordi la scelta. Di’ come dovrebbe funzionare, a parole.'],
      [['What happens when someone taps the button?', 'Cosa succede quando qualcuno tocca il pulsante?'], ['How should the app remember the choice?', 'Come deve ricordare la scelta l’app?'], ['What if the person never chose?', 'E se la persona non ha mai scelto?']],
      ['Tap: the colours switch between light and dark. Remember: save the choice on the phone. Never chose: follow the phone’s own setting.', 'Tocco: i colori passano da chiaro a scuro. Ricordare: salvare la scelta sul telefono. Mai scelto: seguire l’impostazione del telefono.'],
      undefined,
      [['What should change on the screen?', 'Cosa deve cambiare sullo schermo?'], ['Where can an app keep a small note for next time?', 'Dove può un’app tenere un piccolo appunto per la volta dopo?'], ['What would be a fair starting choice?', 'Quale sarebbe una scelta di partenza giusta?']]),
  ],
  Video: [
    e(['A bakery filmed 12 clips. Pick the 5 best ones for a short video that catches attention fast.', 'Un forno ha girato 12 clip. Scegli le 5 migliori per un breve video che catturi subito l’attenzione.'],
      [['Pick 5 clips that look good together.', 'Scegli 5 clip che stanno bene insieme.'], ['Which clip opens the video, and why?', 'Quale clip apre il video, e perché?'], ['Write a short caption.', 'Scrivi una breve didascalia.']],
      ['Croissant tearing open, flour cloud, oven glow, kid pointing, customers in line. It opens on the steam because that is more surprising than the shop sign. Caption: “Fresh and still warm.”', 'Cornetto che si apre, nuvola di farina, bagliore del forno, bimbo che indica, clienti in coda. Apre sul vapore perché sorprende più dell’insegna. Didascalia: “Fresco e ancora caldo.”']),
    e(['Pick something you can explain in three sentences. Write what the video would say.', 'Scegli qualcosa che puoi spiegare in tre frasi. Scrivi cosa direbbe il video.'],
      [['Name your topic.', 'Dai un nome al tuo argomento.'], ['Write 3 sentences that explain it.', 'Scrivi 3 frasi che lo spiegano.'], ['Write a last line people will remember.', 'Scrivi una frase finale da ricordare.']],
      ['Topic: boiling an egg. Start the egg in cold water. Bring it to a boil, then switch it off for 10 minutes. Cool it in cold water so it peels easily. Last line: Easy eggs, every time.', 'Argomento: sodare un uovo. Metti l’uovo in acqua fredda. Porta a ebollizione, poi spegni per 10 minuti. Raffreddalo in acqua fredda così si sbuccia facilmente. Frase finale: Uova sode facili, ogni volta.'],
      { title: ['A simple shape', 'Una struttura semplice'], body: ['Start with a question or a surprise. Say the one thing to remember. Show an example. End with a line people repeat.', 'Inizia con una domanda o una sorpresa. Di’ l’unica cosa da ricordare. Mostra un esempio. Chiudi con una frase che la gente ripete.'] }),
    e(['A bottle brand wants a short video. Pick 4 shots and put them in order.', 'Un marchio di borracce vuole un breve video. Scegli 4 inquadrature e mettile in ordine.'],
      [['Pick 4 shots and put them in order.', 'Scegli 4 inquadrature e mettile in ordine.'], ['Which one is your favourite, and why?', 'Quale preferisci, e perché?'], ['Write a slogan of 4 words.', 'Scrivi uno slogan di 4 parole.']],
      ['Bottle on the desk, hand twists the cap, water pours, drop test. Favourite: the drop test, because it shows the bottle is tough. Slogan: “Built to be dropped.”', 'Borraccia sulla scrivania, mano che gira il tappo, acqua che scorre, prova di caduta. Preferita: la caduta, perché mostra che è resistente. Slogan: “Fatta per cadere.”']),
  ],
  Selling: [
    e(['A bakery sells a €12 box of pastries. Write a short note to convince Marta, who runs a coworking space, to try one.', 'Un forno vende una box di pasticcini da 12 €. Scrivi un breve messaggio per convincere Marta, che gestisce un coworking, a provarne una.'],
      [['What does Marta not have right now?', 'Cosa non ha Marta in questo momento?'], ['Write 3 sentences offering the box.', 'Scrivi 3 frasi che propongono la box.'], ['End with a small question that is easy to say yes to.', 'Chiudi con una piccola domanda a cui è facile dire di sì.']],
      ['Marta, your coworking has coffee but nothing sweet. Our €12 box has 8 fresh pastries, delivered at 9. Can I drop one off on Friday to try?', 'Marta, nel tuo coworking c’è il caffè ma niente di dolce. La nostra box da 12 € ha 8 pasticcini freschi, consegnata alle 9. Posso lasciartene una venerdì da provare?']),
    e(['Dana ignores most messages she gets. Write a short one that she will answer.', 'Dana ignora quasi tutti i messaggi che riceve. Scrivine uno breve a cui risponde.'],
      [['Why would she ignore the first three messages?', 'Perché ignorerebbe i primi tre messaggi?'], ['Write a short message that mentions something about her work.', 'Scrivi un breve messaggio che cita qualcosa del suo lavoro.'], ['Ask a tiny yes or no question.', 'Fai una piccola domanda sì o no.']],
      ['Dana, I loved how the Lisbon rebrand used just one colour. Can I ask you one quick question about how you price projects? Just reply “yes”.', 'Dana, mi è piaciuto come il rebrand di Lisbona usa un solo colore. Posso farti una domanda veloce su come prezzi i progetti? Rispondi solo “sì”.']),
    e(['You sell headphones and the buyer pushes back. Answer three objections kindly.', 'Vendi cuffie e l’acquirente si oppone. Rispondi con gentilezza a tre obiezioni.'],
      [['Answer “too expensive” with a question.', 'Rispondi a “costa troppo” con una domanda.'], ['Answer “I already have headphones”.', 'Rispondi a “ho già delle cuffie”.'], ['Answer “I’ll think about it” with a small next step.', 'Rispondi a “ci penso” con un piccolo passo successivo.']],
      ['1) “What would great sound be worth to you?” 2) “What do yours not do on a loud train?” 3) “Fair. Want to try mine on tomorrow’s trip?”', '1) “Quanto varrebbe per te un suono ottimo?” 2) “Cosa non fanno le tue su un treno rumoroso?” 3) “Giusto. Vuoi provare le mie nel viaggio di domani?”']),
  ],
  Music: [
    e(['A coffee brand wants a short sound for when the coffee is ready. Describe it in words. You do not need to read music.', 'Un marchio di caffè vuole un breve suono per quando il caffè è pronto. Descrivilo a parole. Non serve saper leggere la musica.'],
      [['Which instrument would you choose?', 'Quale strumento sceglieresti?'], ['Is it high or low, slow or fast?', 'È acuto o grave, lento o veloce?'], ['How does it start, and how does it end?', 'Come inizia e come finisce?']],
      ['A soft piano, slow. Three or four gentle notes going up, then one low note to finish, like a sigh.', 'Un pianoforte morbido, lento. Tre o quattro note dolci che salgono, poi una nota grave per finire, come un sospiro.']),
    e(['Pick a song you love and say how you would remix it, in words.', 'Scegli una canzone che ami e di’ come la remixeresti, a parole.'],
      [['Name the song and the feeling you want.', 'Scrivi la canzone e la sensazione che vuoi.'], ['What stays the same, and what changes?', 'Cosa resta uguale e cosa cambia?'], ['Describe the result in one sentence.', 'Descrivi il risultato in una frase.']],
      ['Song: “Let It Be”. Feeling: calm. The melody stays. It gets slower and is played on one guitar, with soft rain and no drums. A sleepy rainy-day version.', 'Canzone: “Let It Be”. Sensazione: calma. La melodia resta. Diventa più lenta e suonata da una chitarra, con pioggia leggera e senza batteria. Una versione assonnata da giorno di pioggia.'],
      { title: ['An example card', 'Una carta di esempio'], body: ['Keep: the melody. Change: slower, one guitar. Add: soft rain. Drop: the drums.', 'Tieni: la melodia. Cambia: più lenta, una chitarra. Aggiungi: pioggia leggera. Togli: la batteria.'] }),
    e(['A sneaker brand wants a catchy short phrase for an ad. Write it and say how it should sound.', 'Un marchio di sneaker vuole una frase breve e orecchiabile per una pubblicità. Scrivila e di’ come deve suonare.'],
      [['Write a phrase of 4 words or fewer.', 'Scrivi una frase di 4 parole o meno.'], ['Fast or slow, loud or soft?', 'Veloce o lenta, forte o piano?'], ['Which word should be the loudest?', 'Quale parola deve essere la più forte?']],
      ['“Go on, move, move!” Fast and bright, with the first “move” the loudest.', '“Dai, muoviti, muoviti!” Veloce e luminosa, con il primo “muoviti” il più forte.']),
  ],
};
