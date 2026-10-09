import type { Play } from './play';
import { t2 } from './i18n';

// Do it here for missions 2 to 6 of this field (keys '<Field>.1' to '<Field>.5'). Mission 1 is in play.ts.
export const PLAY_SELLING: Record<string, Play> = {
  'Selling.1': [
    { kind: 'sort', label: t2('Cut the lines that waste time or promise too much, then drag into hook, proof, ask', 'Togli le righe che perdono tempo o promettono troppo, poi trascina in ordine: hook, prova, richiesta'), out: t2('Script', 'Script'), cutOut: t2('Cut', 'Tolgo'), cut: 4,
      sum: { label: t2('Total', 'Totale'), max: 15 },
      items: [
        { t: t2('3s “Best hot sauce ever, 10 out of 10.”', '3s “La salsa migliore di sempre, 10 su 10.”'), n: 3 },
        { t: t2('6s Drip, bite, nod: “Spicy, no tears.”', '6s Una goccia, un morso, annuisco: “Piccante, senza lacrime.”'), n: 6 },
        { t: t2('3s “Hi guys, welcome back!”', '3s “Ciao a tutti, eccomi di nuovo!”'), n: 3 },
        { t: t2('3s “Grab one at a deli: €6.”', '3s “Prendila in gastronomia: 6 €.”'), n: 3 },
        { t: t2('5s Close-up of the label: chilli, garlic, vinegar', '5s Primo piano sull’etichetta: peperoncino, aglio, aceto'), n: 5 },
        { t: t2('4s “Like, share, follow and comment!”', '4s “Metti like, condividi, segui e commenta!”'), n: 4 },
        { t: t2('3s “Cold pizza from last night. Watch.”', '3s “Pizza fredda di ieri sera. Guarda.”'), n: 3 },
      ] },
  ],
  'Selling.2': [
    { kind: 'pick', label: t2('Seller, answer “€30?” with one true reason (pick 1)', 'Chi vende risponde a “30 €?” con un motivo vero (scegline 1)'), out: t2('Seller', 'Chi vende'), max: 1,
      items: [t2('Fine, €30', 'Va bene, 30 €'), t2('No stains, one new button: I’d rather not go that low', 'Niente macchie, un bottone nuovo: preferisco non scendere così'), t2('Someone offered €42 this morning', 'Stamattina me ne hanno offerti 42 €'), t2('This faded blue is hard to find', 'Un blu scolorito così non si trova facilmente'), t2('€44, last offer', '44 €, ultima offerta'), t2('It goes up after noon', 'Dopo mezzogiorno il prezzo sale')] },
    { kind: 'pick', label: t2('The closing line, with the final price (pick 1)', 'La chiusura, con il prezzo finale (scegline 1)'), out: t2('Closing line', 'Chiusura'), max: 1,
      items: [t2('€35 and it’s yours', '35 € ed è tua'), t2('€42, take it or leave it', '42 €, prendere o lasciare'), t2('€38, and I fold it in a paper bag', '38 €, e te la metto in un sacchetto di carta'), t2('€38, but hurry, someone else wants it', '38 €, ma sbrigati, la vuole anche un’altra persona'), t2('€40, and it’s ready for the festival', '40 €, ed è pronta per il festival'), t2('€30, you win', '30 €, hai vinto tu'), t2('€39, and you try it on first', '39 €, e prima la provi')] },
  ],
  'Selling.3': [
    { kind: 'pick', label: t2('Tap the 2 bits of the old DM that sound most like spam', 'Tocca i 2 pezzi del vecchio DM che suonano più da spam'), out: t2('Sounds like spam', 'Suona da spam'), max: 2,
      items: [t2('Hi dear!!!', 'Ciao cara!!!'), t2('BEST candles in town 🔥', 'Le MIGLIORI candele della città 🔥'), t2('Collab alert', 'Collab alert'), t2('only TODAY', 'solo OGGI'), t2('DM us NOW!!', 'scrivici ORA!!')] },
    { kind: 'pick', label: t2('The easy question to end the new DM (pick 1)', 'La domanda facile per chiudere il nuovo DM (scegline 1)'), out: t2('Last line', 'Ultima riga'), max: 1,
      items: [t2('Can you post it by Friday?', 'Puoi postarla entro venerdì?'), t2('Can I send you one for free?', 'Posso mandartene una gratis?'), t2('How many views do your videos get?', 'Quante visualizzazioni fanno i tuoi video?'), t2('Want one for your desk?', 'Ne vuoi una per la scrivania?'), t2('Collab? Reply TODAY!', 'Collab? Rispondi OGGI!'), t2('Where should I ship it?', 'Dove te la spedisco?')] },
  ],
  'Selling.4': [
    { kind: 'pick', label: t2('The poll question that makes people think of money (pick 1)', 'La domanda del sondaggio che fa pensare ai soldi (scegline 1)'), out: t2('Poll question', 'Domanda del sondaggio'), max: 1,
      items: [t2('Stickers or postcards?', 'Adesivi o cartoline?'), t2('Which €8 product would you buy?', 'Quale prodotto da 8 € compreresti?'), t2('Only 10 left! Which one?', 'Ultimi 10 rimasti! Quale?'), t2('Which one do you like more?', 'Quale ti piace di più?'), t2('For €8, which would you take home?', 'Per 8 €, quale ti porteresti a casa?'), t2('90% of you love stickers, right?', 'Al 90% di voi piacciono gli adesivi, vero?'), t2('Would you pay €12 for these?', 'Pagheresti 12 € per questi?')] },
    { kind: 'pick', label: t2('Two options, easy to picture (pick 2)', 'Due opzioni che si immaginano subito (scegline 2)'), out: t2('Options', 'Opzioni'), max: 2,
      items: [t2('Option A', 'Opzione A'), t2('Pack of 6 stickers', 'Pacchetto da 6 adesivi'), t2('The paper thing', 'La cosa di carta'), t2('Set of 4 postcards', 'Set da 4 cartoline'), t2('Hand screen-printed sticker pack of six', 'Pacchetto di sei adesivi serigrafati a mano'), t2('Both!', 'Tutti e due!')] },
  ],
  'Selling.5': [
    { kind: 'sort', label: t2('Cut what sounds pushy, then drag your reply into order', 'Togli quello che mette fretta, poi trascina la risposta in ordine'), out: t2('Reply', 'Risposta'), cutOut: t2('Cut', 'Tolgo'), cut: 4,
      items: [
        { t: t2('Want to try it Saturday morning?', 'Vuoi provarla sabato mattina?') },
        { t: t2('Lots of people are asking, be quick.', 'Me la chiedono in tanti, sbrigati.') },
        { t: t2('New tuning pegs in March.', 'Meccaniche nuove a marzo.') },
        { t: t2('Hi! Yes, it’s still here.', 'Ciao! Sì, è ancora qui.') },
        { t: t2('Price is firm, no time-wasters.', 'Prezzo fisso, niente perditempo.') },
        { t: t2('Strings are old, small scratch on the back.', 'Corde vecchie, piccolo graffio sul retro.') },
        { t: t2('Read the listing, it’s all there.', 'Leggi l’annuncio, c’è scritto tutto.') },
      ] },
    { kind: 'pick', label: t2('The nudge for day two, no pressure (pick 1)', 'La spintarella per il secondo giorno, senza pressione (scegline 1)'), out: t2('Nudge', 'Spintarella'), max: 1,
      items: [t2('Hello??? Are you there?', 'Ciao??? Ci sei?'), t2('Still interested? I can send a video of it playing.', 'Ti interessa ancora? Posso mandarti un video mentre la suono.'), t2('Someone else wants it, last chance!', 'La vuole anche un’altra persona, ultima occasione!'), t2('Hi again! No worries if it’s not for you.', 'Ciao di nuovo! Nessun problema se non fa per te.'), t2('Price goes up on Monday.', 'Da lunedì il prezzo sale.'), t2('I can add new strings for €5.', 'Posso aggiungere corde nuove per 5 €.')] },
  ],
};
