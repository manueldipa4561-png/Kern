import type { Play } from './play';
import { t2 } from './i18n';

// Do it here for missions 2 to 6 of this field (keys '<Field>.1' to '<Field>.5'). Mission 1 is in play.ts.
export const PLAY_CODE: Record<string, Play> = {
  // Pizza quiz: more than one set of 3 rules works, the decoys leave someone with no pizza or two.
  'Code.1': [
    { kind: 'pick', label: t2('Pick 3 rules that give everyone one pizza', 'Scegli 3 regole che diano a tutti una pizza'), out: t2('Rules', 'Regole'), max: 3,
      items: [t2('IF stay in THEN Margherita', 'SE a casa ALLORA Margherita'), t2('IF lots of spice THEN Diavola', 'SE tanto piccante ALLORA Diavola'),
        t2('IF no spice AND go out THEN Quattro Formaggi', 'SE niente piccante E fuori ALLORA Quattro Formaggi'), t2('IF go out THEN Diavola', 'SE fuori ALLORA Diavola'),
        t2('IF no spice AND stay in THEN Margherita', 'SE niente piccante E a casa ALLORA Margherita'), t2('IF no spice THEN Quattro Formaggi', 'SE niente piccante ALLORA Quattro Formaggi'),
        t2('IF lots of spice AND go out THEN Diavola', 'SE tanto piccante E fuori ALLORA Diavola')] },
    { kind: 'pick', label: t2('Test the four kinds of people: tap each one who gets exactly one pizza', 'Prova i quattro tipi di persona: tocca chi riceve una sola pizza'), out: t2('Exactly one pizza', 'Una sola pizza'), max: 4,
      items: [t2('Stay in, no spice', 'A casa, niente piccante'), t2('Stay in, lots of spice', 'A casa, tanto piccante'), t2('Go out, no spice', 'Fuori, niente piccante'), t2('Go out, lots of spice', 'Fuori, tanto piccante')] },
  ],
  'Code.2': [
    { kind: 'pick', label: t2('Play Ada: two ways to never pay', 'Fai la parte di Ada: due modi per non pagare mai'), out: t2('Ada’s tricks', 'I trucchi di Ada'), max: 2,
      items: [t2('Mute the chat', 'Silenziare la chat'), t2('Never reply', 'Non rispondere mai'), t2('Reply “maybe”', 'Rispondere “forse”'), t2('Reply first', 'Rispondere prima di tutti'),
        t2('Leave the group', 'Uscire dal gruppo'), t2('Reply in the same minute as Pia', 'Rispondere nello stesso minuto di Pia'), t2('Delete the reply', 'Cancellare la risposta')] },
    { kind: 'pick', label: t2('The new rule (1 or 2 lines)', 'La nuova regola (1 o 2 righe)'), out: t2('New rule', 'Nuova regola'), max: 2,
      items: [t2('IF your reply is the last, THEN you pay', 'SE la tua risposta è l’ultima, ALLORA paghi'), t2('IF you never reply, THEN you pay', 'SE non rispondi mai, ALLORA paghi'),
        t2('IF you have not replied by 20:30, THEN you pay', 'SE non hai risposto entro le 20:30, ALLORA paghi'), t2('IF Ada has not replied, THEN Ada pays', 'SE Ada non ha risposto, ALLORA paga Ada'),
        t2('IF everyone has replied, THEN the last reply pays', 'SE hanno risposto tutti, ALLORA paga chi ha risposto per ultimo'), t2('IF you leave the group, THEN you pay', 'SE esci dal gruppo, ALLORA paghi'),
        t2('IF you reply first, THEN you pay', 'SE rispondi prima di tutti, ALLORA paghi')] },
  ],
  // Discount sheet: the + is the culprit; two of the formulas give 36.
  'Code.3': [
    { kind: 'pick', label: t2('Tap the part that goes the wrong way', 'Tocca la parte che va nel verso sbagliato'), out: t2('Wrong way', 'Verso sbagliato'), max: 1,
      items: ['=', 'B1', '+', '*', 'B2', '10%'] },
    { kind: 'pick', label: t2('The fixed formula', 'La formula corretta'), out: t2('Fixed formula', 'Formula corretta'), max: 1,
      items: ['=B1*B2', '=B1-B1*B2', '=B1-B2', '=B1+B1*B2', '=B1-10', '=B1*(1-B2)', '=B1/B2'] },
  ],
  // Auto-reply: the plant check must come before the "price?" check, and "anything else" goes last.
  'Code.4': [
    { kind: 'sort', label: t2('Cut the rules that guess, then drag the rest into the order the bot checks them', 'Togli le regole che tirano a indovinare, poi trascina le altre nell’ordine in cui il bot le controlla'),
      out: t2('Order', 'Ordine'), cutOut: t2('Cut', 'Tolgo'), cut: 3,
      items: [
        { t: t2('IF it says “price?” THEN send the fern price', 'SE dice “prezzo?” ALLORA manda il prezzo della felce') },
        { t: t2('IF it is anything else THEN pass it to a person', 'SE è qualcos’altro ALLORA passalo a una persona') },
        { t: t2('IF it names a city THEN say yes, we ship', 'SE nomina una città ALLORA rispondi che spediamo') },
        { t: t2('IF it says “price?” THEN ask which plant', 'SE dice “prezzo?” ALLORA chiedi quale pianta') },
        { t: t2('IF it names a plant THEN give that plant’s price', 'SE nomina una pianta ALLORA dai il prezzo di quella pianta') },
      ] },
    { kind: 'pick', label: t2('The reply to DM 1: “price?”', 'La risposta al DM 1: “prezzo?”'), out: t2('Reply to DM 1', 'Risposta al DM 1'), max: 1,
      items: [t2('35 euro!', '35 euro!'), t2('Your request has been received.', 'La tua richiesta è stata ricevuta.'), t2('Which one: fern, cactus or monstera?', 'Quale? Felce, cactus o monstera?'),
        t2('Check our website.', 'Guarda sul nostro sito.'), t2('From 18 euro, which one do you like?', 'Da 18 euro, quale ti piace?')] },
  ],
  // Basil robot: the vague lines are the ones to cut; the wet-soil check belongs before the pouring.
  'Code.5': [
    { kind: 'sort', label: t2('Cut the lines where the robot would have to guess, then drag the rest into order', 'Togli le righe in cui il robot dovrebbe tirare a indovinare, poi trascina le altre in ordine'),
      out: t2('Steps', 'Passaggi'), cutOut: t2('Cut', 'Tolgo'), cut: 3,
      items: [
        { t: t2('DO: fill it halfway at the tap', 'FAI: riempilo a metà al rubinetto') },
        { t: t2('DO: give it enough water', 'FAI: dagli abbastanza acqua') },
        { t: t2('IF the soil is wet THEN stop', 'SE la terra è bagnata ALLORA fermati') },
        { t: t2('DO: take the watering can from under the sink', 'FAI: prendi l’annaffiatoio da sotto il lavandino') },
        { t: t2('REPEAT: pour a little UNTIL it looks happy', 'RIPETI: versa un po’ FINCHÉ sembra contento') },
        { t: t2('REPEAT: pour a little UNTIL water shows in the saucer', 'RIPETI: versa un po’ FINCHÉ si vede acqua nel sottovaso') },
        { t: t2('DO: put the watering can back under the sink', 'FAI: rimetti l’annaffiatoio sotto il lavandino') },
      ] },
  ],
};
