// Section icons (missions, done) are Phosphor Icons, duotone weight (MIT licence, (c) Phosphor Icons, phosphoricons.com) on a 24 x 24 grid,
// changed for KERN: the outline stays bone (class pf), the duotone body takes the lime of the brand at about a third (class pd).
// The names ending in -on are the filled versions the tab bar shows for the tab in play. The yourKERN tab (a glass person) and KERN.AI (a glass star with a small blue star) are pictures, see FIELD_PICS below. Styles: app.css (.k-i).
export const ICONS: Record<string, string> = {
  // sections
  missions: '<g transform="scale(.09375)"><path class="pd" d="M240,112l-33.62,37.35a8,8,0,0,1-5.94,2.65H40a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H200.44a8,8,0,0,1,5.94,2.65Z"/><path class="pf" d="M246,106.65,212.33,69.3A16,16,0,0,0,200.44,64H136V32a8,8,0,0,0-16,0V64H40A16,16,0,0,0,24,80v64a16,16,0,0,0,16,16h80v64a8,8,0,0,0,16,0V160h64.44a16,16,0,0,0,11.89-5.3L246,117.35A8,8,0,0,0,246,106.65ZM200.44,144H40V80H200.44l28.8,32Z"/></g>',
  'missions-on': '<g transform="scale(.09375)"><path class="pf" d="M246,117.35,212.33,154.7a16,16,0,0,1-11.89,5.3H136v64a8,8,0,0,1-16,0V160H40a16,16,0,0,1-16-16V80A16,16,0,0,1,40,64h80V32a8,8,0,0,1,16,0V64h64.44a16,16,0,0,1,11.89,5.3L246,106.65A8,8,0,0,1,246,117.35Z"/></g>',
  done: '<g transform="scale(.09375)"><path class="pd" d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"/><path class="pf" d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></g>',
};

// The seven fields, the yourKERN tab and KERN.AI are pictures, not drawings: frosted glass objects with one lime bead, 192 x 192 with a transparent background (public/img/f/<name>.webp, notes in design/field-icons.md).
export const FIELD_PICS = ['Design', 'Writing', 'Code', 'Video', 'Selling', 'Music', 'Prompting', 'yourkern', 'copilot'];
export const picFile = (name: string) => (name === 'copilot' ? 'ai' : name.toLowerCase()); // KERN.AI's picture is ai.webp
export const icon = (name: string, cls = 'k-i') => FIELD_PICS.includes(name)
  ? `<img class="k-fp" src="/img/f/${picFile(name)}.webp" width="192" height="192" alt="" aria-hidden="true">`
  : `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] ?? ''}</svg>`;
