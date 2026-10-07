import React from 'react';
import { ProductArtId } from '../products';

/** Flat illustrations of the sample products, used on screens and showcases */
const ART: Record<ProductArtId, React.ReactNode> = {
  banana: (
    <>
      <path d="M22 40c8 36 44 58 82 44 4-2 4-7-1-7-30 6-58-10-70-40-3-6-12-4-11 3z" fill="#f6c915" />
      <path d="M30 34c14 34 44 48 76 38 4-1 3-6-1-6-28 4-52-12-64-36-3-5-12-2-11 4z" fill="#ffdc3d" />
      <path d="M20 40l-6-10 8-2 5 9z" fill="#6b4a1f" />
      <path d="M104 77l8 2-2 6-7-3z" fill="#4a3313" />
      <path d="M40 46c12 18 30 28 52 28" stroke="#e0ad00" strokeWidth="2" fill="none" />
    </>
  ),
  milk: (
    <>
      <rect x="40" y="12" width="40" height="12" rx="3" fill="#1d6fd8" />
      <path d="M36 30l6-6h36l6 6v76a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6z" fill="#ffffff" stroke="#d4dbe6" strokeWidth="2" />
      <rect x="36" y="52" width="48" height="34" fill="#1d6fd8" />
      <text x="60" y="68" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11" fill="#fff">MILK</text>
      <text x="60" y="80" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fill="#cfe2ff">2 LITRE</text>
    </>
  ),
  bread: (
    <>
      <path d="M14 70c0-24 20-38 46-38s46 14 46 38v14a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8z" fill="#c98a3d" />
      <path d="M18 70c0-20 18-32 42-32s42 12 42 32" fill="#dda15e" />
      <path d="M36 50l8 14M54 46l6 16M74 48l-4 15M90 54l-8 12" stroke="#f3d29b" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  eggs: (
    <>
      <path d="M10 64h100l-8 30H18z" fill="#c7b299" />
      {[24, 44, 64, 84].map((x, i) => (
        <ellipse key={x} cx={x + 6} cy={i % 2 ? 54 : 50} rx="11" ry="14" fill={i % 2 ? '#f3e3cc' : '#fbf1e2'} stroke="#e0cfb5" />
      ))}
      <path d="M10 64h100" stroke="#a89277" strokeWidth="3" />
    </>
  ),
  avocado: (
    <>
      <path d="M60 12c18 0 30 26 34 50 4 26-12 46-34 46S22 88 26 62c4-24 16-50 34-50z" fill="#3f6b2a" />
      <path d="M60 22c13 0 23 22 26 42 3 20-9 36-26 36s-29-16-26-36c3-20 13-42 26-42z" fill="#c9e07a" />
      <circle cx="60" cy="72" r="15" fill="#8a5a2b" />
      <circle cx="55" cy="67" r="4" fill="#a8743f" />
    </>
  ),
  beer: (
    <>
      {[30, 60, 90].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="14" width="12" height="18" rx="2" fill="#5a3410" />
          <path d={`M${x - 6} 32c0 8-10 12-10 22v50a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V54c0-10-10-14-10-22z`} fill="#7a4a17" />
          <rect x={x - 16} y="62" width="32" height="26" fill="#f2e6c9" />
          <rect x={x - 16} y="68" width="32" height="6" fill="#1f7a4d" />
          <rect x={x - 7} y="10" width="14" height="5" rx="1" fill="#c9a227" />
        </g>
      ))}
    </>
  ),
};

interface ProductArtProps {
  art: ProductArtId;
  className?: string;
}

const ProductArt: React.FC<ProductArtProps> = ({ art, className }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    {ART[art]}
  </svg>
);

export default ProductArt;
