import type { Play } from './play';
import { t2 } from './i18n';

// Do it here for missions 2 to 6 of this field (keys '<Field>.1' to '<Field>.5'). Mission 1 is in play.ts.
// Rows carry their seconds in the text (· 3s) and in n, so the sum checks the total; decoys break a rule of the mission.
export const PLAY_VIDEO: Record<string, Play> = {
  'Video.1': [
    { kind: 'sort', label: t2('Drag 3 shots in order, ✕ the rest: 10 seconds, the empty shelf first', 'Trascina in ordine 3 inquadrature, ✕ sulle altre: 10 secondi, prima lo scaffale vuoto'), out: t2('Shots', 'Inquadrature'), cutOut: t2('Cut', 'Tolgo'), cut: 4,
      sum: { label: t2('Total', 'Totale'), max: 10 },
      items: [
        { t: t2('You walk into the living room · 3s', 'Entri in salotto · 3s'), n: 3 },
        { t: t2('Bea lifts a cushion: the Zumo, charged · 3s', 'Bea alza un cuscino: lo Zumo, carico · 3s'), n: 3 },
        { t: t2('You look under your bed · 4s', 'Guardi sotto il letto · 4s'), n: 4 },
        { t: t2('The empty shelf, a loose cable · 3s', 'Lo scaffale vuoto, un cavo penzoloni · 3s'), n: 3 },
        { t: t2('Music from under a cushion · 4s', 'Musica da sotto un cuscino · 4s'), n: 4 },
        { t: t2('Bea whistles at the ceiling · 3s', 'Bea fischietta guardando il soffitto · 3s'), n: 3 },
        { t: t2('Slow turn to Bea on the sofa · 4s', 'Giro lento su Bea, sul divano · 4s'), n: 4 },
      ] },
    { kind: 'pick', label: t2('On-screen text, one per shot in order (6 words or fewer)', 'Testo a schermo, uno per inquadratura in ordine (massimo 6 parole)'), out: t2('Text', 'Testo'), max: 3,
      items: [t2('“The shelf. Empty.”', '“Lo scaffale. Vuoto.”'), t2('“I think my cousin Bea took my speaker”', '“Secondo me mia cugina Bea mi ha preso la cassa”'), t2('“POV: your Zumo is gone”', '“POV: il tuo Zumo è sparito”'), t2('“Bea. Way too calm.”', '“Bea. Fin troppo tranquilla.”'),
        t2('“Music. From a cushion?”', '“Musica. Da un cuscino?”'), t2('“This is the story of how my Zumo vanished”', '“Questa è la storia di come è sparito il mio Zumo”'), t2('“She even charged it”', '“L’ha pure caricato”'), t2('“Case closed”', '“Caso chiuso”')] },
  ],
  'Video.2': [
    { kind: 'pick', label: t2('The director’s 3 questions, in the order you ask them', 'Le 3 domande della regia, nell’ordine in cui le fai'), out: t2('Questions at 0s, 7s, 14s', 'Domande a 0s, 7s, 14s'), max: 3,
      items: [t2('“Tell us about the banana.”', '“Raccontaci della banana.”'), t2('“What was your worst awkward moment?”', '“Qual è la tua figuraccia peggiore?”'), t2('“Was it hot?”', '“Faceva caldo?”'), t2('“Then what happened?”', '“E poi cos’è successo?”'),
        t2('“Look at the camera.”', '“Guarda in camera.”'), t2('“What did the kid say?”', '“Cosa ha detto il bambino?”'), t2('“Why a banana?”', '“Perché proprio una banana?”'), t2('“How did it end?”', '“E com’è finita?”')] },
    { kind: 'pick', label: t2('Tino’s story: the moment you save for the last answer', 'La storia di Tino: il momento da tenere per l’ultima risposta'), out: t2('Punchline', 'Battuta finale'), max: 1,
      items: [t2('Not a costume party', 'Non era una festa in maschera'), t2('32 degrees in a banana', '32 gradi dentro una banana'), t2('Nobody said a word', 'Nessuno ha detto niente'), t2('A kid: “Are you a lemon?”', 'Un bambino: “Sei un limone?”')] },
  ],
  'Video.3': [
    { kind: 'sort', label: t2('Drag the captions into the order Greta speaks, ✕ any that break a rule', 'Trascina i sottotitoli nell’ordine in cui parla Greta, ✕ su quelli fuori regola'), out: t2('Captions', 'Sottotitoli'), cutOut: t2('Cut', 'Tolgo'), cut: 2,
      sum: { label: t2('Total', 'Totale'), max: 12 },
      items: [
        { t: t2('“Only five euros.” · 2s', '“Solo cinque euro.” · 2s'), n: 2 },
        { t: t2('“The culprit?” · 1s', '“Il colpevole?” · 1s'), n: 1 },
        { t: t2('“Hi, welcome back.” · 2s', '“Ciao, bentornati.” · 2s'), n: 2 },
        { t: t2('“The culprit? One tiny nail.” · 4s', '“Il colpevole? Un chiodino.” · 4s'), n: 4 },
        { t: t2('“Ten minutes, one patch.” · 2s', '“Dieci minuti, una toppa.” · 2s'), n: 2 },
        { t: t2('“One tiny nail.” · 3s', '“Un chiodino.” · 3s'), n: 3 },
        { t: t2('“Today: flat tyre.” · 2s', '“Oggi: una gomma a terra.” · 2s'), n: 2 },
      ] },
  ],
  'Video.4': [
    { kind: 'pick', label: t2('Shot 1 (up to 4 words), then shot 2 (up to 6): tap them in order', 'Inquadratura 1 (fino a 4 parole), poi la 2 (fino a 6): toccale in ordine'), out: t2('Shots 1-2', 'Inquadrature 1-2'), max: 2,
      items: [t2('“A skateboard is on the ground.”', '“Uno skate è per terra.”'), t2('“Ladies and gentlemen: the board.”', '“Signore e signori: la tavola.”'), t2('“One push. History begins.”', '“Una spinta. Comincia la storia.”'),
        t2('“And now the foot goes on and pushes really hard.”', '“E adesso il piede sale sopra e spinge fortissimo.”'), t2('“Silence. The board. Still.”', '“Silenzio. La tavola. Immobile.”'), t2('“One foot. One push. Pure courage.”', '“Un piede. Una spinta. Coraggio puro.”')] },
    { kind: 'pick', label: t2('Shot 3 (up to 6 words), then shot 4 (up to 4): tap them in order', 'Inquadratura 3 (fino a 6 parole), poi la 4 (fino a 4): toccale in ordine'), out: t2('Shots 3-4', 'Inquadrature 3-4'), max: 2,
      items: [t2('“The wheels roll.”', '“Le ruote girano.”'), t2('“It rolls! It rolls!”', '“Rotola! Ma rotola davvero!”'), t2('“The wheels are finally starting to turn.”', '“Le ruote finalmente iniziano a girare.”'), t2('“Gone. Gone for good.”', '“Via. Via per sempre.”'),
        t2('“Buy your wheels at Rotella!”', '“Compra le ruote da Rotella!”'), t2('“Off to buy bread.”', '“A comprare il pane.”'), t2('“Rotella. Goodbye, legend.”', '“Rotella. Addio, leggenda.”')] },
  ],
  'Video.5': [
    { kind: 'sort', label: t2('Drag 3 shots in order, ✕ the rest: 12 seconds, the comment first', 'Trascina in ordine 3 inquadrature, ✕ sulle altre: 12 secondi, prima il commento'), out: t2('Shots', 'Inquadrature'), cutOut: t2('Cut', 'Tolgo'), cut: 4,
      sum: { label: t2('Total', 'Totale'), max: 12 },
      items: [
        { t: t2('You read the comment, arms crossed · 4s', 'Leggi il commento a braccia conserte · 4s'), n: 4 },
        { t: t2('A wall clock, then the empty chair · 5s', 'Un orologio al muro, poi la poltrona vuota · 5s'), n: 5 },
        { t: t2('A cheaper shop’s price list · 3s', 'Il listino di un negozio più economico · 3s'), n: 3 },
        { t: t2('The comment on screen, you smile · 4s', 'Il commento a schermo, tu sorridi · 4s'), n: 4 },
        { t: t2('Close-up of the scissors, snip · 3s', 'Primo piano delle forbici, zac · 3s'), n: 3 },
        { t: t2('Someone shows off a fresh cut · 5s', 'Qualcuno mostra il taglio appena fatto · 5s'), n: 5 },
        { t: t2('A hand lays a hot towel on the chair · 3s', 'Una mano posa un asciugamano caldo sulla poltrona · 3s'), n: 3 },
      ] },
    { kind: 'pick', label: t2('One line per shot, in order: 8 words or fewer, nothing defensive', 'Una frase per inquadratura, in ordine: massimo 8 parole, niente di difensivo'), out: t2('Lines', 'Frasi'), max: 3,
      items: [t2('“You get what you pay for.”', '“Chi più spende, meno spende.”'), t2('“Fair question, Ivo. Here’s why.”', '“Domanda giusta, Ivo. Ecco perché.”'), t2('“Then go to your €10 barber.”', '“Allora vai dal tuo barbiere da 10 €.”'), t2('“30 full minutes, every single cut.”', '“30 minuti pieni, ogni singolo taglio.”'),
        t2('“Sorry, prices went up for everyone.”', '“Scusa, i prezzi sono saliti per tutti.”'), t2('“Hot towel and neck shave included.”', '“Asciugamano caldo e rasatura del collo inclusi.”'), t2('“Honestly, our cuts beat every other shop in town.”', '“Sinceramente, i nostri tagli battono ogni altro negozio in città.”'), t2('“Come try it, Ivo.”', '“Vieni a provare, Ivo.”')] },
  ],
};
