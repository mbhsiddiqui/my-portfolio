import React from 'react';

interface ReflectivePanelProps {
  children?: React.ReactNode;
  className?: string;
  overlayColor?: string;
}

const ReflectivePanel: React.FC<ReflectivePanelProps> = ({
  children,
  className = '',
  overlayColor = 'rgba(0,0,0,1)'
}) => {
  return (
    <div
      className={`relative overflow-hidden backdrop-blur-xl ${className}`}
      style={{ background: overlayColor }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(120,165,255,0.25),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(110,150,255,0.18),transparent_40%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgb(28,33,43)_40%,rgb(28,33,43)_70%,rgba(255,255,255,0.3)_100%)] opacity-80" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ReflectivePanel;
