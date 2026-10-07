import React from 'react';

/* Simple SVG illustrations in the Ticket-IT palette (pink, navy, greys) */

const PINK = '#f73582';
const NAVY = '#2b253e';
const GREY = '#e4e6ea';
const STEEL = '#b8bcc6';
const RED = '#d0202e';
const YELLOW = '#f5c400';

export type IllustrationId =
  | 'paper'
  | 'esl'
  | 'screens'
  | 'rail'
  | 'clip'
  | 'peg'
  | 'pole'
  | 'stand'
  | 'wall'
  | 'access-point'
  | 'subscription'
  | 'clamp'
  | 'ceiling'
  | 'floor-stand'
  | 'screen-ap'
  | 'poe-switch'
  | 'spreadsheet'
  | 'system'
  | 'help';

/** Small e-paper label used inside several drawings */
const Label: React.FC<{ x: number; y: number; w: number; h: number; promo?: boolean }> = ({ x, y, w, h, promo }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={2} fill="#f7f7f2" stroke={STEEL} />
    <rect x={x + 2} y={y + 2} width={w - 4} height={h * 0.28} fill={promo ? RED : NAVY} />
    <rect x={x + w * 0.2} y={y + h * 0.45} width={w * 0.6} height={h * 0.28} rx={1} fill={promo ? RED : '#141414'} />
    {promo && <rect x={x + 2} y={y + h * 0.8} width={w - 4} height={h * 0.12} fill={YELLOW} />}
  </g>
);

const DRAWINGS: Record<IllustrationId, React.ReactNode> = {
  paper: (
    <>
      <rect x="40" y="58" width="120" height="52" rx="8" fill={NAVY} />
      <rect x="56" y="40" width="88" height="24" rx="3" fill={GREY} />
      <rect x="54" y="98" width="92" height="6" rx="3" fill="#15121f" />
      <circle cx="146" cy="72" r="4" fill={PINK} />
      <g transform="rotate(-8 70 30)">
        <rect x="52" y="6" width="44" height="60" fill="#fff" stroke={STEEL} />
        <rect x="52" y="6" width="44" height="15" fill={PINK} />
        <rect x="60" y="30" width="28" height="14" fill={NAVY} />
        <rect x="60" y="50" width="20" height="4" fill={STEEL} />
      </g>
      <g transform="rotate(10 140 30)">
        <rect x="118" y="4" width="44" height="60" fill="#fff" stroke={STEEL} />
        <rect x="118" y="4" width="44" height="15" fill={RED} />
        <rect x="126" y="28" width="28" height="14" fill={RED} />
        <rect x="118" y="50" width="44" height="7" fill={YELLOW} />
      </g>
      <rect x="64" y="108" width="72" height="26" fill="#fff" stroke={STEEL} />
      <rect x="64" y="108" width="72" height="7" fill={PINK} />
    </>
  ),
  esl: (
    <>
      <rect x="10" y="20" width="180" height="6" fill={STEEL} />
      {[22, 62, 102, 142].map((x, i) => (
        <g key={x}>
          <rect x={x} y={0} width="30" height="20" rx="3" fill={['#ffd166', '#06d6a0', '#ef476f', '#118ab2'][i]} />
          <rect x={x + 4} y={0} width="22" height="6" fill="rgba(255,255,255,0.4)" />
        </g>
      ))}
      <rect x="10" y="26" width="180" height="18" fill={GREY} stroke={STEEL} />
      <Label x={18} y={30} w={34} h={24} />
      <Label x={62} y={30} w={34} h={24} promo />
      <Label x={106} y={30} w={34} h={24} />
      <Label x={150} y={30} w={34} h={24} promo />
      <rect x="10" y="80" width="180" height="6" fill={STEEL} />
      <rect x="10" y="86" width="180" height="18" fill={GREY} stroke={STEEL} />
      <Label x={20} y={90} w={50} h={36} promo />
      <Label x={84} y={90} w={50} h={36} />
      <Label x={148} y={90} w={34} h={24} />
    </>
  ),
  screens: (
    <>
      <rect x="6" y="14" width="124" height="44" rx="4" fill="#141418" />
      <rect x="10" y="18" width="116" height="36" fill={PINK} />
      <rect x="16" y="24" width="40" height="8" fill="#fff" />
      <text x="16" y="48" fontFamily="Arial" fontWeight="900" fontSize="14" fill="#fff">$3.49</text>
      <circle cx="104" cy="36" r="13" fill={YELLOW} />
      <rect x="6" y="70" width="124" height="12" rx="2" fill="#141418" />
      <rect x="8" y="72" width="120" height="8" fill={NAVY} />
      <rect x="12" y="74" width="30" height="4" fill={YELLOW} />
      <rect x="88" y="74" width="34" height="4" fill="#fff" />
      <rect x="148" y="6" width="46" height="96" rx="4" fill="#141418" />
      <rect x="152" y="10" width="38" height="88" fill={RED} />
      <rect x="158" y="18" width="26" height="6" fill="#fff" />
      <circle cx="171" cy="50" r="12" fill={YELLOW} />
      <text x="157" y="88" fontFamily="Arial" fontWeight="900" fontSize="11" fill="#fff">$1.50</text>
      <rect x="168" y="102" width="6" height="22" fill="#3a3a42" />
      <ellipse cx="171" cy="128" rx="20" ry="5" fill="#26262c" />
    </>
  ),
  rail: (
    <>
      <rect x="10" y="50" width="180" height="30" rx="3" fill={GREY} stroke={STEEL} />
      <rect x="10" y="46" width="180" height="6" fill={STEEL} />
      <Label x={22} y={54} w={36} h={22} />
      <Label x={68} y={54} w={36} h={22} promo />
      <Label x={114} y={54} w={36} h={22} />
      <path d="M160 52h24v24h-24" fill="none" stroke={PINK} strokeWidth="2" strokeDasharray="4 3" />
    </>
  ),
  clip: (
    <>
      <rect x="20" y="58" width="160" height="10" fill={STEEL} />
      <path d="M90 50h20v14h-6v10h-8V64h-6z" fill={NAVY} />
      <Label x={76} y={76} w={48} h={34} promo />
    </>
  ),
  peg: (
    <>
      <rect x="20" y="20" width="160" height="16" fill={GREY} stroke={STEEL} />
      {[50, 100, 150].map((x) => (
        <circle key={x} cx={x} cy={28} r={3} fill={STEEL} />
      ))}
      <path d="M100 28h6v54" stroke={NAVY} strokeWidth="4" fill="none" strokeLinecap="round" />
      <Label x={82} y={82} w={42} h={30} />
    </>
  ),
  pole: (
    <>
      <rect x="40" y="110" width="120" height="16" rx="3" fill={GREY} stroke={STEEL} />
      <rect x="97" y="44" width="6" height="68" fill={NAVY} />
      <Label x={70} y={12} w={60} h={40} promo />
    </>
  ),
  stand: (
    <>
      <path d="M70 120l18-40h24l18 40z" fill={NAVY} />
      <Label x={46} y={16} w={108} h={72} />
    </>
  ),
  wall: (
    <>
      <rect x="0" y="0" width="200" height="140" fill="#f3f4f6" />
      <rect x="36" y="26" width="128" height="10" fill={NAVY} />
      <Label x={46} y={30} w={108} h={74} promo />
    </>
  ),
  'access-point': (
    <>
      <path d="M70 44a42 42 0 0 1 60 0M80 54a28 28 0 0 1 40 0M90 64a14 14 0 0 1 20 0" stroke={PINK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="100" rx="56" ry="18" fill={GREY} stroke={STEEL} />
      <ellipse cx="100" cy="94" rx="56" ry="18" fill="#fff" stroke={STEEL} />
      <circle cx="100" cy="94" r="4" fill="#58b97d" />
    </>
  ),
  subscription: (
    <>
      <rect x="44" y="18" width="112" height="104" rx="10" fill="#fff" stroke={STEEL} strokeWidth="2" />
      <rect x="44" y="18" width="112" height="24" rx="10" fill={PINK} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={70 + i * 30} cy={72} r={11} fill={i === 0 ? PINK : '#fdeef4'} stroke={PINK} strokeWidth="2" />
          <text x={70 + i * 30} y={76} textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill={i === 0 ? '#fff' : PINK}>
            {i + 1}
          </text>
        </g>
      ))}
      <rect x="60" y="96" width="80" height="8" rx="4" fill={GREY} />
    </>
  ),
  clamp: (
    <>
      <rect x="10" y="60" width="180" height="24" fill={GREY} stroke={STEEL} />
      <rect x="20" y="38" width="160" height="22" rx="3" fill="#141418" />
      <rect x="24" y="42" width="152" height="14" fill={PINK} />
      {[40, 160].map((x) => (
        <path key={x} d={`M${x - 8} 56h16v34h-16z`} fill={NAVY} />
      ))}
    </>
  ),
  ceiling: (
    <>
      <rect x="0" y="0" width="200" height="12" fill={STEEL} />
      <path d="M60 12v40M140 12v40" stroke={NAVY} strokeWidth="3" />
      <rect x="30" y="52" width="140" height="44" rx="4" fill="#141418" />
      <rect x="34" y="56" width="132" height="36" fill={PINK} />
      <rect x="42" y="64" width="50" height="8" fill="#fff" />
    </>
  ),
  'floor-stand': (
    <>
      <rect x="72" y="6" width="56" height="100" rx="4" fill="#141418" />
      <rect x="76" y="10" width="48" height="92" fill={PINK} />
      <rect x="96" y="106" width="8" height="18" fill="#3a3a42" />
      <ellipse cx="100" cy="128" rx="30" ry="6" fill="#26262c" />
      <path d="M142 70l10 10 20-24" stroke="#58b97d" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'screen-ap': (
    <>
      <path d="M70 44a42 42 0 0 1 60 0M80 54a28 28 0 0 1 40 0M90 64a14 14 0 0 1 20 0" stroke={NAVY} strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="54" y="80" width="92" height="34" rx="8" fill="#fff" stroke={STEEL} strokeWidth="2" />
      <rect x="66" y="94" width="40" height="6" rx="3" fill={PINK} />
      <circle cx="128" cy="97" r="4" fill="#58b97d" />
    </>
  ),
  'poe-switch': (
    <>
      <rect x="20" y="52" width="160" height="40" rx="5" fill={NAVY} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={32 + i * 18} y={64} width={12} height={12} rx={1} fill="#fff" />
      ))}
      <circle cx="170" cy="60" r="3" fill="#58b97d" />
    </>
  ),
  spreadsheet: (
    <>
      <rect x="50" y="10" width="100" height="120" rx="6" fill="#fff" stroke={STEEL} strokeWidth="2" />
      <rect x="50" y="10" width="100" height="22" rx="6" fill="#1f7a4d" />
      {[44, 62, 80, 98].map((y) => (
        <g key={y}>
          <rect x="60" y={y} width="24" height="10" fill={GREY} />
          <rect x="88" y={y} width="50" height="10" fill={GREY} />
        </g>
      ))}
      <circle cx="146" cy="112" r="18" fill={PINK} />
      <path d="M146 120v-16m0 0l-7 7m7-7l7 7" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  system: (
    <>
      <rect x="14" y="34" width="68" height="52" rx="6" fill={NAVY} />
      <rect x="22" y="42" width="52" height="30" rx="2" fill="#fff" />
      <rect x="34" y="86" width="28" height="10" fill={NAVY} />
      <rect x="118" y="30" width="68" height="60" rx="8" fill="#fff" stroke={STEEL} strokeWidth="2" />
      <rect x="128" y="42" width="48" height="8" rx="4" fill={PINK} />
      <rect x="128" y="58" width="36" height="6" rx="3" fill={GREY} />
      <rect x="128" y="70" width="42" height="6" rx="3" fill={GREY} />
      <path d="M86 60h28" stroke={PINK} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 8" />
      <circle cx="100" cy="60" r="10" fill={PINK} />
      <path d="M96 60h8m-3-4l4 4-4 4" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),
  help: (
    <>
      <circle cx="100" cy="56" r="30" fill="#fdeef4" stroke={PINK} strokeWidth="3" />
      <circle cx="100" cy="50" r="12" fill={NAVY} />
      <path d="M78 76a24 20 0 0 1 44 0" fill={NAVY} />
      <path d="M68 56a32 32 0 0 1 64 0" stroke={PINK} strokeWidth="5" fill="none" />
      <rect x="62" y="52" width="10" height="16" rx="4" fill={PINK} />
      <rect x="128" y="52" width="10" height="16" rx="4" fill={PINK} />
      <rect x="54" y="98" width="92" height="28" rx="14" fill="#fff" stroke={STEEL} strokeWidth="2" />
      <circle cx="82" cy="112" r="4" fill={PINK} />
      <circle cx="100" cy="112" r="4" fill={PINK} />
      <circle cx="118" cy="112" r="4" fill={PINK} />
    </>
  ),
};

interface IllustrationProps {
  id: IllustrationId;
  className?: string;
}

const Illustration: React.FC<IllustrationProps> = ({ id, className }) => (
  <svg viewBox="0 0 200 140" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    {DRAWINGS[id]}
  </svg>
);

export default Illustration;
