import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Moon, Sun } from 'lucide-react';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  logoHref?: string;
  onLogoClick?: () => void;
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  pillGap?: string;
  dimmed?: boolean;
  onItemClick?: (item: PillNavItem) => void;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  logoHref,
  onLogoClick,
  activeHref,
  className = '',
  ease = 'power2.out',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  pillGap = '10px',
  dimmed = false,
  onItemClick,
  onMobileMenuClick,
  initialLoadAnimation = true,
  isDarkMode = true,
  onToggleTheme
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuReady, setMenuReady] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);

  useEffect(() => {
    setMenuReady(true);
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.45, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.45, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.45, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, {
        visibility: 'hidden',
        opacity: 0,
        scale: 0.9,
        x: 10,
        y: -8,
        transformOrigin: 'top right'
      });
    }

    if (initialLoadAnimation && !hasAnimatedRef.current) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.fromTo(
          logo,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.55, ease }
        );
      }

      if (navItems) {
        gsap.fromTo(
          navItems,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.6, ease, delay: 0.05 }
        );
      }

      hasAnimatedRef.current = true;
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.24,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.18,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const openMobileMenu = () => {
    if (isMobileMenuOpen) return;
    setIsMobileMenuOpen(true);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
    }

    if (menu) {
      gsap.killTweensOf(menu);
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(
        menu,
        { opacity: 0, y: -8, x: 10, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.28,
          ease,
          transformOrigin: 'top right'
        }
      );
    }

    onMobileMenuClick?.();
  };

  const closeMobileMenu = () => {
    if (!isMobileMenuOpen) return;
    setIsMobileMenuOpen(false);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.25, ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.25, ease });
    }

    if (menu) {
      gsap.killTweensOf(menu);
      gsap.to(menu, {
        opacity: 0,
        y: -8,
        x: 10,
        scale: 0.9,
        duration: 0.2,
        ease,
        transformOrigin: 'top right',
        onComplete: () => {
          gsap.set(menu, { visibility: 'hidden', opacity: 0, y: -8, x: 10, scale: 0.9 });
        }
      });
    }

    onMobileMenuClick?.();
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const handleThemeToggle = () => {
    if (isThemeAnimating) return;
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
    setIsThemeAnimating(true);
    window.setTimeout(() => {
      onToggleTheme?.();
    }, 160);
    window.setTimeout(() => setIsThemeAnimating(false), 360);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent | TouchEvent | MouseEvent) => {
      const menu = mobileMenuRef.current;
      const hamburger = hamburgerRef.current;
      const target = event.target as Node | null;

      if (!menu || !target) return;
      if (menu.contains(target) || (hamburger && hamburger.contains(target))) return;
      closeMobileMenu();
    };

    const handleScroll = () => {
      closeMobileMenu();
    };

    const handleTouchMove = (event: TouchEvent) => {
      const menu = mobileMenuRef.current;
      const hamburger = hamburgerRef.current;
      const target = event.target as Node | null;

      if (!menu || !target) return;
      if (menu.contains(target) || (hamburger && hamburger.contains(target))) return;
      closeMobileMenu();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    document.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('touchstart', handlePointerDown, true);
      document.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--logo']: '36px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: pillGap
  } as React.CSSProperties;

  const initialRevealStyle = initialLoadAnimation
    ? { opacity: 0, transform: 'translateY(-10px)' }
    : undefined;

  const isHashLink = (href: string) => href.startsWith('#');

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
      return;
    }
    if (logoHref && onItemClick && logoHref.startsWith('#')) {
      onItemClick({ label: 'Logo', href: logoHref });
    }
  };

  return (
    <div
      className={`fixed top-4 left-0 right-0 z-[1000] flex justify-center transition-opacity duration-300 ${
        dimmed ? 'opacity-60 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {logoHref && isRouterLink(logoHref) ? (
          <Link
            to={logoHref}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden pill-logo-glass"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
              border: 'none',
              ...initialRevealStyle
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
          </Link>
        ) : (logoHref || '').startsWith('#') ? (
          <button
            type="button"
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            onClick={handleLogoClick}
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden pill-logo-glass"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
              border: 'none',
              ...initialRevealStyle
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
          </button>
        ) : (
          <a
            href={logoHref || '#'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden pill-logo-glass"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
              border: 'none',
              ...initialRevealStyle
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
          </a>
        )}

        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2 pill-nav-surface"
          style={{
            height: 'var(--nav-h)',
            ...initialRevealStyle
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle: React.CSSProperties = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                border: '1px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(12px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: 'var(--base, #000)',
                      willChange: 'transform'
                    }}
                    aria-hidden="true"
                    ref={el => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: 'var(--base, #000)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : isHashLink(item.href) && onItemClick ? (
                    <button
                      role="menuitem"
                      type="button"
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      onClick={() => onItemClick(item)}
                    >
                      {PillContent}
                    </button>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {onToggleTheme ? (
          <button
            type="button"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={handleThemeToggle}
            className={`hidden md:inline-flex items-center justify-center rounded-full ml-3 theme-toggle ${
              isThemeAnimating ? 'theme-toggle-animating' : ''
            } ${initialLoadAnimation ? 'theme-toggle-intro' : ''}`}
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              backdropFilter: 'blur(12px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
              ['--toggle-rotate' as string]: isDarkMode ? '0deg' : '180deg'
            }}
          >
            <span className="theme-toggle-glyph">
              <Sun size={16} className="theme-toggle-icon theme-toggle-icon--sun" />
              <Moon size={16} className="theme-toggle-icon theme-toggle-icon--moon" />
            </span>
          </button>
        ) : null}

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative pill-nav-toggle"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'rgba(255,255,255,0.28)',
            border: '1px solid rgba(255,255,255,0.45)',
            backdropFilter: 'blur(12px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.2)'
          }}
        >
          <span
          className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: '#fff' }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: '#fff' }}
          />
        </button>
      </nav>

      {menuReady ? (
        <div
          ref={mobileMenuRef}
          className={`mobile-menu md:hidden absolute top-[calc(var(--nav-h)+0.05rem)] right-4 left-auto w-[calc(100vw-120px)] max-w-[19rem] min-w-[180px] rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[998] origin-top-right ${
            isMobileMenuOpen ? 'is-open' : ''
          }`}
          style={{
            ...cssVars,
            background: 'rgba(10,14,24,0.6)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(16px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
            pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
          }}
        >
          <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
            {items.map(item => {
              const defaultStyle: React.CSSProperties = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, #fff)'
              };
              const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.background = 'var(--base)';
                e.currentTarget.style.color = 'var(--hover-text, #fff)';
              };
              const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.background = 'var(--pill-bg, #fff)';
                e.currentTarget.style.color = 'var(--pill-text, #fff)';
              };

              const linkClasses =
                'block py-3 px-5 w-full text-left text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

              return (
                <li key={item.href}>
                  {isRouterLink(item.href) ? (
                    <Link
                      to={item.href}
                      className={linkClasses}
                      style={defaultStyle}
                      onMouseEnter={hoverIn}
                      onMouseLeave={hoverOut}
                      onClick={() => closeMobileMenu()}
                    >
                      {item.label}
                    </Link>
                  ) : isHashLink(item.href) && onItemClick ? (
                    <button
                      type="button"
                      className={linkClasses}
                      style={defaultStyle}
                      onMouseEnter={hoverIn}
                      onMouseLeave={hoverOut}
                      onClick={() => {
                        closeMobileMenu();
                        onItemClick(item);
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className={linkClasses}
                      style={defaultStyle}
                      onMouseEnter={hoverIn}
                      onMouseLeave={hoverOut}
                      onClick={() => {
                        closeMobileMenu();
                      }}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
            {onToggleTheme ? (
              <li>
                <button
                  type="button"
                  className={`block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] w-full text-left flex items-center gap-3 theme-toggle ${
                    isThemeAnimating ? 'theme-toggle-animating' : ''
                  }`}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'var(--pill-text, #fff)',
                    ['--toggle-rotate' as string]: isDarkMode ? '0deg' : '180deg'
                  }}
                  onClick={handleThemeToggle}
                >
                  <span className="theme-toggle-glyph">
                    <Sun size={16} className="theme-toggle-icon theme-toggle-icon--sun" />
                    <Moon size={16} className="theme-toggle-icon theme-toggle-icon--moon" />
                  </span>
                  <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default PillNav;
