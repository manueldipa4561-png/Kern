// Section icons (missions, copilot, done) are Phosphor Icons, duotone weight (MIT licence, (c) Phosphor Icons, phosphoricons.com) on a 24 x 24 grid,
// changed for KERN: the outline stays bone (class pf), the duotone body takes the lime of the brand at about a third (class pd).
// yourkern is the app's own mark, drawn here: a frosted body, an outline and one lime bead (classes g, b, bp, bs, gb). Styles: app.css (.k-i).
export const ICONS: Record<string, string> = {
  // sections
  missions: '<g transform="scale(.09375)"><path class="pd" d="M176,128a48,48,0,1,1-48-48A48,48,0,0,1,176,128Z"/><path class="pf" d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"/></g>',
  yourkern: '<path class="g" d="M5.8 18.2A8.6 8.6 0 0 1 18.2 5.8Z" transform="translate(-2.1 -2.1)" stroke-width="1.5"/><path d="M5.8 18.2A8.6 8.6 0 0 0 18.2 5.8Z" transform="translate(2.1 2.1)" stroke-width="1.5"/><circle class="b" cx="16" cy="16" r="2.6"/>',
  copilot: '<g transform="scale(.09375)"><path class="pd" d="M194.82,151.43l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0l-20.3-55.09-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3A7.92,7.92,0,0,1,194.82,151.43Z"/><path class="pf" d="M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"/></g>',
  done: '<g transform="scale(.09375)"><path class="pd" d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"/><path class="pf" d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></g>',
};

// The seven fields are pictures, not drawings: frosted glass objects with one lime bead, 192 x 192 with a transparent background (public/img/f/<field>.webp, notes in design/field-icons.md).
export const FIELD_PICS = ['Design', 'Writing', 'Code', 'Video', 'Selling', 'Music', 'Prompting'];
export const icon = (name: string, cls = 'k-i') => FIELD_PICS.includes(name)
  ? `<img class="k-fp" src="/img/f/${name.toLowerCase()}.webp" width="192" height="192" alt="" aria-hidden="true">`
  : `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] ?? ''}</svg>`;
