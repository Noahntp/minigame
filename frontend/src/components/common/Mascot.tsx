import React from 'react';

interface MascotProps {
  /** Blob fill color (usually the game's accent, tinted). */
  color: string;
  /** Optional accessory sitting on top of the blob. */
  accessory?: 'none' | 'hat' | 'scarf';
  /** Overall blob diameter in px. */
  size?: number;
  className?: string;
}

/**
 * The "lucky star" blob mascot shared across the hub and every game screen —
 * a soft asymmetric blob with dot eyes, blush, and a curved smile.
 */
export const Mascot: React.FC<MascotProps> = ({
  color,
  accessory = 'none',
  size = 56,
  className = '',
}) => {
  const eye = Math.round(size * 0.11);
  const eyeTop = Math.round(size * 0.4);
  const eyeGapFromCenter = Math.round(size * 0.15);

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '45% 55% 50% 50% / 55% 45% 55% 45%',
        background: color,
      }}
    >
      {accessory === 'hat' && (
        <div
          className="absolute"
          style={{
            top: -size * 0.24,
            left: size * 0.22,
            width: 0,
            height: 0,
            borderLeft: `${size * 0.15}px solid transparent`,
            borderRight: `${size * 0.15}px solid transparent`,
            borderBottom: `${size * 0.22}px solid #E23F3F`,
          }}
        >
          <div
            className="absolute rounded-full bg-[#FFC93C]"
            style={{ top: -size * 0.08, left: -size * 0.04, width: size * 0.14, height: size * 0.14 }}
          />
        </div>
      )}
      {accessory === 'scarf' && (
        <div
          className="absolute rounded-md bg-[#E23F3F]"
          style={{ bottom: -size * 0.06, left: size * 0.06, right: size * 0.06, height: size * 0.17 }}
        />
      )}

      <div
        className="absolute rounded-full bg-ink"
        style={{ width: eye, height: eye * 1.15, top: eyeTop, left: size / 2 - eyeGapFromCenter - eye / 2 }}
      />
      <div
        className="absolute rounded-full bg-ink"
        style={{ width: eye, height: eye * 1.15, top: eyeTop, left: size / 2 + eyeGapFromCenter - eye / 2 }}
      />

      <div
        className="absolute rounded-full bg-white/55"
        style={{
          width: size * 0.14,
          height: size * 0.09,
          top: size * 0.53,
          left: size * 0.12,
        }}
      />
      <div
        className="absolute rounded-full bg-white/55"
        style={{
          width: size * 0.14,
          height: size * 0.09,
          top: size * 0.53,
          right: size * 0.12,
        }}
      />

      <div
        className="absolute border-ink border-t-0"
        style={{
          top: size * 0.49,
          left: size / 2 - size * 0.11,
          width: size * 0.22,
          height: size * 0.11,
          borderWidth: Math.max(2, size * 0.045),
          borderRadius: `0 0 ${size * 0.22}px ${size * 0.22}px`,
        }}
      />
    </div>
  );
};
