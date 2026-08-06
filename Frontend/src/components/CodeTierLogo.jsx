import React from 'react';
import { Link } from 'react-router-dom';

export default function CodeTierLogo({ className = "h-10 w-auto" }) {
  return (
    <Link to="/" className="inline-block shrink-0 cursor-pointer transition-opacity hover:opacity-90">
      <img
        src="/logo.png"
        alt="CodeTier"
        className={`object-contain select-none ${className}`}
      />
    </Link>
  );
}



