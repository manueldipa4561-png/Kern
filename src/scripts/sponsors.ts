import { t2 } from './i18n';

// Brand missions: which brand presents which mission. Mission text stays brand-neutral (a made-up subject), so a deal is one line
// here, keyed "Field.index" (index 0-5), and needs no change to the mission itself. The sheet then shows "Brand mission · name"
// in the brand colour (#rrggbb). Names marked (sample) are placeholders that show the format (not "demo": that word belongs to the demo profile).
export type Sponsor = { name: string; color: string };

export const SPONSORS: Record<string, Sponsor> = {
  'Design.0': { name: t2('Pomo Pizza (sample)', 'Pomo Pizza (esempio)'), color: '#D64533' },
  'Writing.1': { name: t2('Parlo (sample)', 'Parlo (esempio)'), color: '#6D4AFF' },
  'Selling.1': { name: t2('Ardi (sample)', 'Ardi (esempio)'), color: '#E07A1F' },
};
