// src/components/ui/card.js
import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`glass-card p-6 text-slate-100 ${className}`}>
      {children}
    </div>
  );
};
