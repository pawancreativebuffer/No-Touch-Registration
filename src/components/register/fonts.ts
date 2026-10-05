import { Anton, Great_Vibes, Lobster, Oswald, Roboto, Roboto_Slab, UnifrakturMaguntia } from 'next/font/google';

// Google Fonts offered on the "Pick a google Font" step
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });
const oswald = Oswald({ subsets: ['latin'] });
const robotoSlab = Roboto_Slab({ weight: ['400', '800'], subsets: ['latin'] });
const fraktur = UnifrakturMaguntia({ weight: '400', subsets: ['latin'] });
const anton = Anton({ weight: '400', subsets: ['latin'] });
const lobster = Lobster({ weight: '400', subsets: ['latin'] });

export interface TicketFont {
  name: string;
  family: string;
}

export const TICKET_FONTS: TicketFont[] = [
  { name: 'Great Vibes', family: greatVibes.style.fontFamily },
  { name: 'Roboto', family: roboto.style.fontFamily },
  { name: 'Oswald', family: oswald.style.fontFamily },
  { name: 'Roboto Slab', family: robotoSlab.style.fontFamily },
  { name: 'UnifrakturMaguntia', family: fraktur.style.fontFamily },
  { name: 'Anton', family: anton.style.fontFamily },
  { name: 'Lobster', family: lobster.style.fontFamily },
];

/** Condensed display face used for ticket headers ("SPECIAL", "CORE") */
export const HEADER_FONT = anton.style.fontFamily;
