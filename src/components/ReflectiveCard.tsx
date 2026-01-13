import React from 'react';
import { Fingerprint, User, Activity, Lock } from 'lucide-react';

interface ReflectiveCardProps {
  name?: string;
  title?: string;
  subtitle?: string;
  statusLabel?: string;
  locationLabel?: string;
  locationValue?: string;
  avatarSrc?: string;
  backgroundSrc?: string;
  socials?: React.ReactNode;
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ReflectiveCard: React.FC<ReflectiveCardProps> = ({
  name = 'MAAZ',
  title = 'ASPIRING SOFTWARE ENGINEER',
  subtitle = 'FULL-STACK WEB APPS',
  statusLabel = 'OPEN TO WORK',
  locationLabel = 'LOCATION',
  locationValue = 'Toronto, ON',
  avatarSrc,
  backgroundSrc,
  socials,
  blurStrength = 12,
  color = 'white',
  metalness = 0,
  roughness = 0.4,
  overlayColor = 'rgba(0, 0, 0, 1)',
  displacementStrength = 1,
  noiseScale = 0.4,
  specularConstant = 1.2,
  grayscale = 0,
  glassDistortion = 0,
  className = '',
  style = {}
}) => {
  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  } as React.CSSProperties;

  return (
    <div
      className={`relative w-full h-full min-h-[460px] sm:min-h-[500px] rounded-[20px] overflow-hidden bg-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] isolate font-sans ${className}`}
      style={{ ...style, ...cssVariables }}
    >
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      {backgroundSrc ? (
        <img
          src={backgroundSrc}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover scale-[1.2] -scale-x-100 z-0 opacity-80 transition-[filter] duration-300"
          style={{
            filter:
              'saturate(var(--saturation, 0)) contrast(120%) brightness(110%) blur(var(--blur-strength, 12px)) url(#metallic-displacement)'
          }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-full z-0 opacity-90"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.12), transparent 40%), linear-gradient(160deg, rgba(10,16,30,0.9), rgba(6,12,22,0.9))'
          }}
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 z-10 opacity-[var(--roughness,0.4)] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.8%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23noiseFilter)%27%2F%3E%3C%2Fsvg%3E')] mix-blend-overlay" />

      <div className="absolute inset-0 z-20 bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_40%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_60%,rgba(255,255,255,0.3)_100%)] pointer-events-none mix-blend-overlay opacity-[var(--metalness,1)]" />

      <div className="absolute inset-0 rounded-[20px] p-[1px] bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.15)_100%)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] z-20 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 text-[var(--text-color,white)] bg-[var(--overlay-color,rgba(255,255,255,0.05))]">
        <div className="flex justify-between items-center border-b border-white/20 pb-4">
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.1em] px-2 py-1 bg-white/10 rounded border border-white/20">
            <Lock size={14} className="opacity-80" />
            <span>{statusLabel}</span>
          </div>
          <Activity className="opacity-80" size={20} />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center gap-4 sm:gap-6">
          {avatarSrc ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/40 bg-white/10 flex items-center justify-center overflow-hidden">
              <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/40 bg-white/10 flex items-center justify-center">
              <User className="opacity-80" size={42} />
            </div>
          )}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-[0.05em] m-0 mb-2 drop-shadow-md">{name}</h2>
            <p className="text-[11px] sm:text-xs tracking-[0.2em] opacity-70 m-0 uppercase">{title}</p>
            <p className="text-[9px] sm:text-[10px] tracking-[0.18em] opacity-60 mt-2 uppercase">{subtitle}</p>
          </div>
          {socials ? <div className="mt-4 sm:mt-6">{socials}</div> : null}
        </div>

        <div className="flex justify-between items-end border-t border-white/20 pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-[0.1em] opacity-60">{locationLabel}</span>
            <span className="font-mono text-sm tracking-[0.05em]">{locationValue}</span>
          </div>
          <div className="opacity-40">
            <Fingerprint size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;
