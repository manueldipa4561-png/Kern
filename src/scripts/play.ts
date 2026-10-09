import { t2 } from './i18n';
import { PLAY_DESIGN } from './play-design';
import { PLAY_WRITING } from './play-writing';
import { PLAY_CODE } from './play-code';
import { PLAY_VIDEO } from './play-video';
import { PLAY_SELLING } from './play-selling';
import { PLAY_MUSIC } from './play-music';
import { PLAY_PROMPTING } from './play-prompting';

// "Do it here": the first mission of every field can be done by tapping or dragging, not only by typing.
// The picks write a plain text summary into the answer box, so Submit, the compare, the reflection, sync and co-op keep working on text.
// pick: tap chips (up to max); `rest` also lists what was not picked ("Cut: ..."). sort: drag rows, or use the arrows, and tap ✕ to cut (up to cut);
// `sum` adds up the n of the rows kept (seconds) against a max. Strings go through t2 so the Italian is in IT; code tokens and song names stay as they are.
type Pick = { kind: 'pick'; label: string; out: string; max: number; items: string[]; rest?: string };
type Row = { t: string; n?: number };
type Sort = { kind: 'sort'; label: string; out: string; cutOut: string; cut: number; items: Row[]; badge?: string; sum?: { label: string; max: number } };
export type Play = (Pick | Sort)[];

export const PLAY: Record<string, Play> = {
  ...PLAY_DESIGN, ...PLAY_WRITING, ...PLAY_CODE, ...PLAY_VIDEO, ...PLAY_SELLING, ...PLAY_MUSIC, ...PLAY_PROMPTING, // missions 2 to 6, one file per field
  'Design.0': [
    { kind: 'pick', label: t2('Keep the message that makes people turn up (1 or 2)', 'Tieni il messaggio che fa venire la gente (1 o 2)'), out: t2('Keep', 'Tengo'), rest: t2('Cut', 'Tolgo'), max: 2,
      items: [t2('Pizza night Saturday', 'Serata pizza sabato'), t2('2 for 1 until 9pm', '2x1 fino alle 21'), t2('Live DJ from 10', 'DJ dal vivo dalle 22'), t2('New menu', 'Nuovo menu'), t2('Win a year of pizza', 'Vinci un anno di pizza'), t2('Tag 3 friends', 'Tagga 3 amici'), t2('12 Via Verdi', 'Via Verdi 12')] }, // the dog is part of the photo, not a message: keeping it is the person's call
    { kind: 'pick', label: t2('One colour', 'Un solo colore'), out: t2('Colour', 'Colore'), max: 1,
      items: [t2('Red on cream', 'Rosso su crema'), t2('Yellow on black', 'Giallo su nero'), t2('Blue on white', 'Blu su bianco'), t2('Green on bone', 'Verde su avorio')] },
  ],
  'Writing.0': [
    { kind: 'pick', label: t2('The details a friend would ask about (pick 2)', 'I dettagli che fanno fare domande (scegline 2)'), out: t2('Details', 'Dettagli'), max: 2,
      items: [t2('She almost stayed home', 'Stava per restare a casa'), t2('Bag strap snapped on the bus', 'Tracolla rotta sul bus'), t2('First time lifting 40 kg', 'Prima volta con 40 kg'), t2('Feeling good', 'Mi sento bene'), '#gym #fitness'] },
  ],
  'Code.0': [
    { kind: 'pick', label: t2('Tap the word that is off', 'Tocca la parola sbagliata'), out: t2('The word that is off', 'La parola sbagliata'), max: 1,
      items: ['let', 'hoodiesLeft', '0', 'color', '"green"', 'if', '===', 'colour', '"red"', 'paintButton'] },
  ],
  'Video.0': [
    { kind: 'sort', label: t2('Cut the slow shots and drag the best moment to the top', 'Togli le parti lente e trascina in cima il momento migliore'), out: t2('Cut list', 'Lista dei tagli'), cutOut: t2('Cut', 'Tolgo'), cut: 5,
      sum: { label: t2('Total', 'Totale'), max: 12 },
      items: [
        { t: t2('0-6s Rocco walks to the van', '0-6s Rocco cammina verso il furgone'), n: 6 },
        { t: t2('6-16s Reads the menu, waits', '6-16s Legge il menu, aspetta'), n: 10 },
        { t: t2('16-19s The press closes, steam', '16-19s La piastra si chiude, vapore'), n: 3 },
        { t: t2('19-22s Cheese stretches an arm long', '19-22s Il formaggio fila lungo un braccio'), n: 3 },
        { t: t2('22-26s First bite: “OK. OK. OK.”', '22-26s Primo morso: “OK. OK. OK.”'), n: 4 },
        { t: t2('26-30s Walks off', '26-30s Se ne va'), n: 4 },
      ] },
  ],
  'Selling.0': [
    { kind: 'pick', label: t2('Words for the title, the ones a buyer would search', 'Parole per il titolo, quelle che chi compra cerca'), out: t2('Title', 'Titolo'), max: 5,
      items: [t2('Desk lamp', 'Lampada da scrivania'), t2('Black', 'Nera'), t2('Metal', 'In metallo'), t2('40 cm', '40 cm'), t2('Bulb included', 'Lampadina inclusa'), t2('Used', 'Usata'), t2('Cheap', 'Economica'), t2('Vintage', 'Vintage')] },
  ],
  'Music.0': [
    { kind: 'sort', label: t2('Tap ✕ on the song that kills the mood, then drag from calmest to loudest', 'Tocca ✕ sulla canzone che rovina tutto, poi trascina dalla più calma alla più forte'), out: t2('Order', 'Ordine'), cutOut: t2('Cut', 'Tolgo'), cut: 1, // no energy badge: the main version gives mood words only, the numbers live in Make it easier (easy.ts)
      items: [{ t: 'Mango Static' }, { t: 'Sad Trombone Tuesday' }, { t: 'Pocket Sunrise' }, { t: 'Confetti Cannon' }, { t: 'Tile Floor Groove' }, { t: 'Last Bus Home' }] },
  ],
  'Prompting.0': [
    { kind: 'pick', label: t2('Facts the AI needs (at least 3)', 'I fatti che servono all’AI (almeno 3)'), out: t2('Facts', 'Fatti'), max: 6,
      items: [t2('Saturdays at 10:00', 'Ogni sabato alle 10:00'), t2('6 seats', '6 posti'), t2('€35, clay included', '35 €, argilla inclusa'), t2('You take your bowl home', 'La ciotola la porti a casa'), t2('No experience needed', 'Non serve esperienza'), t2('Dana laughs at wobbly bowls', 'Dana ride delle ciotole storte')] },
    { kind: 'pick', label: t2('How Dana sounds (3 words)', 'Come parla Dana (3 parole)'), out: t2('Tone', 'Tono'), max: 3,
      items: [t2('warm', 'calda'), t2('funny', 'divertente'), t2('relaxed', 'rilassata'), t2('formal', 'formale'), t2('hyped', 'esaltata'), t2('honest', 'sincera')] },
  ],
};

const UP = t2('Move up', 'Sposta su'), DOWN = t2('Move down', 'Sposta giù'), CUT = t2('Cut this', 'Togli'), BACK = t2('Put back', 'Rimetti');

// Draws the groups into host and calls change(summary) after every pick, cut or move. Nothing to clean up: the host is emptied on the next mission.
export function renderPlay(host: HTMLElement, play: Play, tr: (s: string) => string, change: (text: string) => void) {
  host.innerHTML = '';
  const parts: (() => string)[] = [];
  const emit = () => change(parts.map((p) => p()).filter(Boolean).join('\n'));
  for (const g of play) {
    const box = document.createElement('div'); box.className = 'k-pl-g';
    const lab = document.createElement('div'); lab.className = 'k-l k-s'; lab.textContent = tr(g.label); box.append(lab);
    if (g.kind === 'pick') {
      const row = document.createElement('div'); row.className = 'k-pl-chips'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', tr(g.label));
      const chosen: string[] = []; // in tap order: the title words come out in the order they were picked
      g.items.forEach((it) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'k-pl-chip'; b.textContent = tr(it); b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => {
          const i = chosen.indexOf(it);
          if (i >= 0) chosen.splice(i, 1);
          else { if (chosen.length >= g.max) chosen.splice(0, 1); chosen.push(it); } // one too many drops the oldest pick, like a radio when max is 1
          row.querySelectorAll<HTMLButtonElement>('button').forEach((x, k) => x.setAttribute('aria-pressed', String(chosen.includes(g.items[k]))));
          emit();
        });
        row.append(b);
      });
      box.append(row);
      parts.push(() => (chosen.length ? `${tr(g.out)}: ${chosen.map(tr).join(', ')}.` + (g.rest ? ` ${tr(g.rest)}: ${g.items.filter((x) => !chosen.includes(x)).map(tr).join(', ')}.` : '') : ''));
    } else {
      const list = document.createElement('ol'); list.className = 'k-pl-sort';
      const order = g.items.map((_, i) => i), cut = new Set<number>();
      let touched = false;
      const sumEl = g.sum ? document.createElement('p') : null;
      const kept = () => order.filter((i) => !cut.has(i));
      const total = () => kept().reduce((s, i) => s + (g.items[i].n || 0), 0);
      const move = (from: number, to: number) => { if (to < 0 || to >= order.length) return; const [x] = order.splice(from, 1); order.splice(to, 0, x); touched = true; paint(); emit(); };
      // Drag by the grip: the row follows the finger, and drops where it passes the middle of a neighbour.
      const drag = (e: PointerEvent, li: HTMLElement) => {
        e.preventDefault(); li.classList.add('lift');
        const startY = e.clientY, from = order.indexOf(Number(li.dataset.i));
        const mids = ([...list.children] as HTMLElement[]).map((r) => r.getBoundingClientRect().top + r.offsetHeight / 2);
        let to = from;
        const onMove = (ev: PointerEvent) => {
          const dy = ev.clientY - startY, y = mids[from] + dy; li.style.transform = `translateY(${dy}px)`;
          to = Math.max(0, Math.min(order.length - 1, mids.filter((m, k) => k !== from && m < y).length));
        };
        const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); li.style.transform = ''; li.classList.remove('lift'); if (to !== from) move(from, to); };
        window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
      };
      const paint = () => {
        list.innerHTML = '';
        order.forEach((idx, pos) => {
          const it = g.items[idx], li = document.createElement('li');
          li.className = cut.has(idx) ? 'cut' : ''; li.dataset.i = String(idx);
          const grip = document.createElement('span'); grip.className = 'k-pl-grip'; grip.setAttribute('aria-hidden', 'true');
          const txt = document.createElement('span'); txt.className = 'k-pl-t'; txt.textContent = tr(it.t);
          if (g.badge && it.n !== undefined) { const bd = document.createElement('small'); bd.textContent = `${tr(g.badge)} ${it.n}`; txt.append(' ', bd); }
          const btn = (cls: string, label: string, text: string, on: () => void, off = false) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = text; b.setAttribute('aria-label', `${tr(label)}: ${tr(it.t)}`); b.disabled = off; b.addEventListener('click', on); return b; };
          li.append(grip, txt,
            btn('k-pl-mv', UP, '↑', () => move(pos, pos - 1), pos === 0),
            btn('k-pl-mv', DOWN, '↓', () => move(pos, pos + 1), pos === order.length - 1),
            btn('k-pl-x', cut.has(idx) ? BACK : CUT, cut.has(idx) ? '↺' : '✕', () => { if (cut.has(idx)) cut.delete(idx); else { if (cut.size >= g.cut) cut.delete([...cut][0]); cut.add(idx); } touched = true; paint(); emit(); }));
          grip.addEventListener('pointerdown', (e) => drag(e, li));
          list.append(li);
        });
        if (sumEl && g.sum) { sumEl.className = `k-pl-sum${total() > g.sum.max ? ' over' : ''}`; sumEl.textContent = `${tr(g.sum.label)}: ${total()}s / ${g.sum.max}s`; }
      };
      paint();
      box.append(list); if (sumEl) box.append(sumEl);
      parts.push(() => {
        if (!touched) return '';
        const gone = [...cut].map((i) => tr(g.items[i].t));
        return `${gone.length ? `${tr(g.cutOut)}: ${gone.join(', ')}. ` : ''}${tr(g.out)}: ${kept().map((i) => tr(g.items[i].t)).join(', ')}.${g.sum ? ` ${tr(g.sum.label)}: ${total()}s.` : ''}`;
      });
    }
    host.append(box);
  }
}
