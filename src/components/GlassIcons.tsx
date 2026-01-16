import React from 'react';

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  customClass?: string;
  href?: string;
  target?: '_blank' | '_self';
  rel?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
  showLabels?: boolean;
  labelClassName?: string;
  labelPosition?: 'top' | 'bottom';
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

const GlassIcons: React.FC<GlassIconsProps> = ({
  items,
  className,
  showLabels = true,
  labelClassName = '',
  labelPosition = 'bottom'
}) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  const gridClasses = className
    ? className
    : 'gap-[4em] grid-cols-2 md:grid-cols-3 mx-auto py-[3em]';

  return (
    <div className={`grid ${gridClasses} overflow-visible`}>
      {items.map((item, index) => {
        const baseClasses = `relative bg-transparent outline-none border-none cursor-pointer w-[3.6em] h-[3.6em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
          item.customClass || ''
        } ${item.isActive ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-black/40 rounded-[1.25em]' : ''}`;

        const content = (
          <>
          <span
            className="absolute top-0 left-0 w-full h-full rounded-[1.1em] block transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[12deg] [will-change:transform] group-hover:[transform:rotate(18deg)_translate3d(-0.35em,-0.35em,0.35em)]"
            style={{
              ...getBackgroundStyle(item.color),
              boxShadow: '0.35em -0.35em 0.6em hsla(223, 10%, 10%, 0.18)'
            }}
          ></span>

          <span
            className="absolute top-0 left-0 w-full h-full rounded-[1.1em] transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.7em] [-webkit-backdrop-filter:blur(0.7em)] [-moz-backdrop-filter:blur(0.7em)] [will-change:transform] transform group-hover:[transform:translate3d(0,0,1.6em)]"
            style={{
              background: item.isActive ? 'rgba(0,0,0,0.65)' : 'hsla(0,0%,100%,0.12)',
              boxShadow: item.isActive
                ? '0 0 0 0.1em hsla(0, 0%, 100%, 0.15) inset'
                : '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
            }}
          >
            <span className="m-auto w-[1.35em] h-[1.35em] flex items-center justify-center" aria-hidden="true">
              {item.icon}
            </span>
          </span>

          <span
            className={`absolute ${labelPosition === 'top' ? 'bottom-full mb-1' : 'top-full'} left-0 right-0 text-center whitespace-nowrap leading-[2] text-sm transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
              showLabels
                ? labelPosition === 'top'
                  ? 'opacity-100 -translate-y-1'
                  : 'opacity-100 translate-y-2'
                : labelPosition === 'top'
                  ? 'opacity-0 translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(-20%)]'
                  : 'opacity-0 translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]'
            } ${labelClassName}`}
          >
            {item.label}
          </span>
          </>
        );

        if (item.href) {
          return (
            <a
              key={index}
              href={item.href}
              aria-label={item.label}
              target={item.target}
              rel={item.rel}
              className={baseClasses}
              onClick={event => {
                event.stopPropagation();
              }}
            >
              {content}
            </a>
          );
        }

        return (
          <div
            key={index}
            aria-label={item.label}
            role="button"
            tabIndex={0}
            onClick={item.onClick}
            onKeyDown={event => {
              if (!item.onClick) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                item.onClick();
              }
            }}
            className={baseClasses}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default GlassIcons;
