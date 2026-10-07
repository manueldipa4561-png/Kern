// One icon family for the whole app, on a 24 x 24 grid: a 1.75 round outline, a frosted body (the colour at 16%) and one lime
// "bead", the same core as the app icon. The classes are styled in app.css (.k-i .g body, .b bead, .bp bead as a shape, .gb lime body).
export const ICONS: Record<string, string> = {
  // sections
  missions: '<circle class="g" cx="12" cy="12" r="9"/><circle class="b" cx="12" cy="12" r="3.3"/>',
  yourkern: '<path class="g" d="M5.8 18.2A8.6 8.6 0 0 1 18.2 5.8Z" transform="translate(-2.1 -2.1)" stroke-width="1.5"/><path d="M5.8 18.2A8.6 8.6 0 0 0 18.2 5.8Z" transform="translate(2.1 2.1)" stroke-width="1.5"/><circle class="b" cx="16" cy="16" r="2.6"/>',
  copilot: '<path class="g" d="M12 3Q12.9 11.1 21 12Q12.9 12.9 12 21Q11.1 12.9 3 12Q11.1 11.1 12 3Z"/><circle class="b" cx="12" cy="12" r="2"/>',
  done: '<circle class="g" cx="12" cy="12" r="9"/><path class="bs" d="M7.9 12.4l2.8 2.8 5.4-5.8"/>',
  // the six fields
  Design: '<path class="g" d="M9.4 3.4h5.2l3.1 7.3a2 2 0 0 1-.3 2L12 21 6.6 12.7a2 2 0 0 1-.3-2z"/><path d="M12 12.4V20.4"/><circle class="b" cx="12" cy="10.2" r="1.9"/>',
  Writing: '<rect class="g" x="4.5" y="3.5" width="15" height="17" rx="3.5"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h2.2"/><circle class="b" cx="14" cy="15.5" r="1.6"/>',
  Code: '<rect class="g" x="3" y="4.5" width="18" height="15" rx="4.5"/><path d="M8.6 9.8 6.4 12l2.2 2.2M15.4 9.8l2.2 2.2-2.2 2.2"/><path class="bs" d="M13.1 9.2 10.9 14.8"/>',
  Video: '<rect class="g" x="3" y="5.5" width="18" height="13" rx="4"/><path class="bp" d="M10.3 9.7v4.6l3.9-2.3z"/>',
  Selling: '<path class="g" d="M3.5 12.1V5.9a2.4 2.4 0 0 1 2.4-2.4h6.2a2.4 2.4 0 0 1 1.7.7l7 7a2.4 2.4 0 0 1 0 3.4l-6 6a2.4 2.4 0 0 1-3.4 0l-7-7a2.4 2.4 0 0 1-.7-1.7z"/><circle class="b" cx="8.2" cy="8.2" r="1.9"/>',
  Music: '<rect class="g" x="3.6" y="9" width="2.8" height="6" rx="1.4"/><rect class="g" x="8.1" y="5.5" width="2.8" height="13" rx="1.4"/><rect class="gb" x="12.6" y="3" width="2.8" height="18" rx="1.4"/><rect class="g" x="17.1" y="7.5" width="2.8" height="9" rx="1.4"/>',
};

export const icon = (name: string, cls = 'k-i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] ?? ''}</svg>`;
