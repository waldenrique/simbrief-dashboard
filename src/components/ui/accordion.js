// src/components/ui/accordion.js
import React, { useState } from 'react';

export const Accordion = ({ children, type = 'single', collapsible = true, className }) => {
  return <div className={className}>{children}</div>;
};

Accordion.Item = ({ value, children }) => {
  return <div className="border rounded mb-2">{children}</div>;
};

Accordion.Trigger = ({ children, onClick, className }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <div
      onClick={toggle}
      className={`cursor-pointer bg-gray-200 px-4 py-2 ${className}`}
    >
      {children} {open ? '▾' : '▸'}
    </div>
  );
};

Accordion.Content = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return <div className="p-4 bg-white">{children}</div>;
};
