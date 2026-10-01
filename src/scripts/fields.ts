import { t2 } from './i18n';

const small = t2('What is the smallest version you could finish today?', 'Qual è la versione più piccola che potresti finire oggi?');
const avoid = t2('Which part are you avoiding, and why?', 'Quale parte stai evitando, e perché?');
const m = (n: string, it: string, title: [string, string], blurb: [string, string]) => [t2(n, it), t2(title[0], title[1]), t2(blurb[0], blurb[1])];
// Concrete briefs for each mission live in missions.ts (MX), same field and index.
// Null prototype (set below) so FIELDS[key] is a safe check for keys from URLs or storage, even "__proto__".
export const FIELDS: Record<string, { m: string[][]; idea: string; qs: string[] }> = {
  Design: { m: [
    m('Mission 002 · startup partner', 'Missione 002 · partner startup', ['Save a sign-up flow', 'Salva un flusso di registrazione'], ['Only 9% of Lumo users finish sign-up. Cut 5 screens down to 3.', 'Solo il 9% degli utenti di Lumo finisce la registrazione. Riduci 5 schermate a 3.']),
    m('Mission 003 · KERN', 'Missione 003 · KERN', ['Rescue a booking form', 'Salva un modulo di prenotazione'], ['14 fields, half the bookings lost. Make it feel like a chat.', '14 campi, metà delle prenotazioni perse. Fallo sembrare una chiacchierata.']),
    m('Mission 004 · studio client', 'Missione 004 · cliente studio', ['Design an empty screen', 'Progetta una schermata vuota'], ['7 in 10 new users leave at a blank screen. Give them a reason to stay.', '7 nuovi utenti su 10 se ne vanno davanti a una schermata vuota. Dai loro un motivo per restare.']),
  ], idea: t2('Your idea: a 3-step onboarding with one clear choice at the start.', 'La tua idea: un onboarding in 3 passi con una scelta chiara all’inizio.'), qs: [t2('What would make the first step easier for someone brand new?', 'Cosa renderebbe il primo passo più facile per chi è completamente nuovo?'), avoid, small] },
  Writing: { m: [
    m('Mission 002 · newsletter partner', 'Missione 002 · partner newsletter', ['Make a hard idea easy', 'Rendi facile un’idea difficile'], ['A newsletter’s readers can’t follow one paragraph. Rewrite it for a 15-year-old.', 'I lettori di una newsletter non seguono un paragrafo. Riscrivilo per un quindicenne.']),
    m('Mission 003 · KERN', 'Missione 003 · KERN', ['Rewrite an email nobody acts on', 'Riscrivi un’email a cui nessuno risponde'], ['Monday’s email, Wednesday’s silence. Make people act today.', 'Email di lunedì, silenzio di mercoledì. Fai agire le persone oggi.']),
    m('Mission 004 · studio client', 'Missione 004 · cliente studio', ['Write with a partner', 'Scrivi con un partner'], ['A zine gives you one first line. Build the story in five sentences, taking turns.', 'Una zine ti dà una prima riga. Costruisci il racconto in cinque frasi, a turno.']),
  ], idea: t2('Your idea: a first line that makes a stranger keep reading.', 'La tua idea: una prima riga che fa continuare a leggere uno sconosciuto.'), qs: [t2('Who is this for, exactly?', 'Per chi è, esattamente?'), t2('Which sentence would you cut first?', 'Quale frase taglieresti per prima?'), small] },
  Code: { m: [
    m('Mission 002 · startup partner', 'Missione 002 · partner startup', ['Fix a dead button', 'Correggi un pulsante morto'], ['Linkly’s “Copy link” does nothing. Find why, fix it, explain it.', 'Il “Copia link” di Linkly non fa nulla. Scopri perché, correggilo, spiegalo.']),
    m('Mission 003 · KERN', 'Missione 003 · KERN', ['Build a bill splitter', 'Costruisci un dividi-conto'], ['Write the function that splits a bill with tip. Three tests must pass.', 'Scrivi la funzione che divide un conto con la mancia. Tre test devono passare.']),
    m('Mission 004 · studio client', 'Missione 004 · cliente studio', ['Build with a partner', 'Costruisci con un partner'], ['A dark mode toggle that remembers the choice. One does the look, one the logic.', 'Un interruttore per la modalità scura che ricorda la scelta. Uno fa l’aspetto, uno la logica.']),
  ], idea: t2('Your idea: a tool that removes one repeated step from your day.', 'La tua idea: uno strumento che elimina un passaggio ripetuto della tua giornata.'), qs: [t2('What is the one thing it must do?', 'Qual è l’unica cosa che deve fare?'), avoid, small] },
  Video: { m: [
    m('Mission 002 · brand partner', 'Missione 002 · brand partner', ['Cut one clear story', 'Monta una storia chiara'], ['12 raw clips from a bakery. Pick the shots for a 20-second reel.', '12 clip grezze di un forno. Scegli le inquadrature per un reel di 20 secondi.']),
    m('Mission 003 · KERN', 'Missione 003 · KERN', ['Plan a 30-second explainer', 'Pianifica una spiegazione di 30 secondi'], ['Teach one thing you know. Hook, claim, show, close.', 'Insegna una cosa che sai. Aggancio, tesi, esempio, chiusa.']),
    m('Mission 004 · studio client', 'Missione 004 · cliente studio', ['Make it with a partner', 'Fallo con un partner'], ['A 15-second clip for a steel bottle. One picks the shots, one the order and sound.', 'Un video di 15 secondi per una borraccia. Uno sceglie le inquadrature, uno ordine e suono.']),
  ], idea: t2('Your idea: open on the surprise, not on the logo.', 'La tua idea: apri con la sorpresa, non con il logo.'), qs: [t2('What should someone feel in the first second?', 'Cosa dovrebbe sentire qualcuno nel primo secondo?'), avoid, small] },
  Selling: { m: [
    m('Mission 002 · small business partner', 'Missione 002 · piccola impresa partner', ['Get a stranger to say yes', 'Fatti dire di sì da uno sconosciuto'], ['Pitch a €12 pastry box to Marta, who already has a café next door.', 'Proponi una box di pasticcini da 12 € a Marta, che ha già un bar accanto.']),
    m('Mission 003 · KERN', 'Missione 003 · KERN', ['Write a message that gets a reply', 'Scrivi un messaggio che riceve risposta'], ['Dana ignored three messages. Write the fourth, in 50 words.', 'Dana ha ignorato tre messaggi. Scrivi il quarto, in 50 parole.']),
    m('Mission 004 · studio client', 'Missione 004 · cliente studio', ['Sell with a partner', 'Vendi con un partner'], ['One sells headphones, one pushes back. Handle three objections.', 'Uno vende cuffie, uno si oppone. Gestisci tre obiezioni.']),
  ], idea: t2('Your idea: lead with the problem, not the product.', 'La tua idea: parti dal problema, non dal prodotto.'), qs: [t2('Who needs this most, by name?', 'Chi ne ha più bisogno, con nome e cognome?'), t2('What would make them say no?', 'Cosa li farebbe dire di no?'), small] },
  Music: { m: [
    m('Mission 002 · brand partner', 'Missione 002 · brand partner', ['Give a small brand a sound', 'Dai un suono a un piccolo brand'], ['A coffee roaster wants a 6-second sound: warm, slow, Sunday.', 'Una torrefazione vuole un suono di 6 secondi: caldo, lento, domenicale.']),
    m('Mission 003 · KERN', 'Missione 003 · KERN', ['Remix something you love', 'Remixa qualcosa che ami'], ['Plan a remix on one card: keep, change, add, drop.', 'Pianifica un remix su una carta: tieni, cambia, aggiungi, togli.']),
    m('Mission 004 · studio client', 'Missione 004 · cliente studio', ['Make it with a partner', 'Fallo con un partner'], ['A 15-second sneaker ad over C G Am F. One writes the melody, one the words.', 'Una pubblicità di 15 secondi di sneaker su DO SOL LAm FA. Uno scrive la melodia, uno le parole.']),
  ], idea: t2('Your idea: one repeating sound people remember.', 'La tua idea: un suono che si ripete e che le persone ricordano.'), qs: [t2('What should it feel like in the first two seconds?', 'Che effetto dovrebbe fare nei primi due secondi?'), avoid, small] },
};
Object.setPrototypeOf(FIELDS, null);
