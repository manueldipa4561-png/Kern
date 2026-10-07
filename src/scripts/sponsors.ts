// Brand missions: which brand presents which mission. Mission text stays brand-neutral (a made-up subject), so a deal is one line
// here, keyed "Field.index" (index 0-5), and needs no change to the mission itself. The sheet then shows "Brand mission · name"
// in the brand colour (#rrggbb). Names marked (demo) are placeholders that show the format.
export type Sponsor = { name: string; color: string };

export const SPONSORS: Record<string, Sponsor> = {
  'Design.0': { name: 'Pomo Pizza (demo)', color: '#D64533' },
  'Writing.1': { name: 'Parlo (demo)', color: '#6D4AFF' },
  'Selling.1': { name: 'Ardi (demo)', color: '#E07A1F' },
};
