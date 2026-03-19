import { useCallback, useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import type { CountryConfig } from './Header';

interface HeaderCountrySelectorProps {
  countries: CountryConfig[];
  currentCountry?: string;
  onCountryChange?: (id: string) => void;
}

/**
 * Globe-icon dropdown for selecting a country/region.
 */
export function HeaderCountrySelector({
  countries,
  currentCountry,
  onCountryChange,
}: HeaderCountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleCountryChange = useCallback(
    (id: string) => {
      setOpen(false);
      onCountryChange?.(id);
    },
    [onCountryChange],
  );

  useEffect(() => {
    if (open && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setContentHeight(0), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Country selector"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '6px',
          transition: 'background-color 0.15s ease',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Globe size={18} color="var(--text-inverse)" />
      </button>

      {(open || contentHeight > 0) && (
        <>
          <div
            onClick={() => setOpen(false)}
            role="presentation"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              cursor: 'default',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              transform: visible ? 'translateY(0)' : 'translateY(-8px)',
              marginTop: '10px',
              minWidth: '220px',
              overflow: 'hidden',
              maxHeight: visible ? `${contentHeight}px` : '0px',
              opacity: visible ? 1 : 0,
              transition:
                'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '14px',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(240,249,255,0.95))',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              boxShadow:
                '0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
              zIndex: 1001,
            }}
          >
            <div ref={contentRef} style={{ padding: '8px' }}>
              {countries.map((country, i) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => handleCountryChange(country.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight:
                      currentCountry === country.id ? 700 : 600,
                    color: 'var(--color-teal-800)',
                    transition:
                      'background-color 0.12s ease, color 0.12s ease, opacity 0.3s ease',
                    transitionDelay: visible ? `${i * 50}ms` : '0ms',
                    opacity: visible ? 1 : 0,
                    lineHeight: '1.3',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-teal-500)';
                    e.currentTarget.style.color = 'var(--text-inverse)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-teal-800)';
                  }}
                >
                  {country.flagEmoji && (
                    <span style={{ marginRight: '8px', fontSize: '16px' }}>
                      {country.flagEmoji}
                    </span>
                  )}
                  {country.label}
                  {currentCountry === country.id && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        opacity: 0.6,
                      }}
                    >
                      &#10003;
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
