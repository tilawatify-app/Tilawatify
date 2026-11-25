import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Download, X } from "lucide-react";
import { createPortal } from "react-dom";
import { APK_URL } from "../data";
import { LiveDownloadBadge, useDownloadCounter } from "./DownloadCounter";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-45px" }}
      transition={{ duration: 0.75, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <img
        src="/images/tilawatify-logo-transparent.png"
        alt="Tilawatify mosque and wave logo"
      />
    </span>
  );
}

export function DownloadButton({
  children = "Download App",
  className = "",
  compact = false,
}: {
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  const { recordDownload } = useDownloadCounter();
  return (
    <a
      href={APK_URL}
      onClick={() => recordDownload()}
      className={`button button-primary ${compact ? "button-compact" : ""} ${className}`}
    >
      <Download size={compact ? 16 : 18} strokeWidth={1.8} />
      <span>{children}</span>
      <ArrowUpRight className="download-arrow" size={16} />
    </a>
  );
}

export function TextLink({
  children,
  to,
  className = "",
}: {
  children: ReactNode;
  to: string;
  className?: string;
}) {
  return (
    <Link className={`text-link ${className}`} to={to}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`section-heading ${center ? "centered" : ""}`}>
      <span className="eyebrow">
        <span />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-heading container">
      <Reveal>
        <span className="eyebrow">
          <span />
          {eyebrow}
        </span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </Reveal>
    </section>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 1 3.2 7.8L23 12l-7.8 3.2L12 23l-3.2-7.8L1 12l7.8-3.2L12 1Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="particle-field">
        {Array.from({ length: 34 }, (_, index) => (
          <i
            key={index}
            style={
              {
                "--x": `${(index * 37 + 13) % 100}%`,
                "--y": `${(index * 23 + 5) % 100}%`,
                "--duration": `${8 + (index % 7) * 2}s`,
                "--delay": `${-(index % 11)}s`,
                "--size": `${index % 5 === 0 ? 3 : 2}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <svg className="geometric-corner" viewBox="0 0 400 400">
        <defs>
          <pattern
            id="islamicPattern"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M50 0 64.6 35.4 100 50 64.6 64.6 50 100 35.4 64.6 0 50 35.4 35.4 50 0ZM14.6 14.6h70.8v70.8H14.6Z"
              fill="none"
              stroke="currentColor"
              strokeWidth=".65"
            />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#islamicPattern)" />
      </svg>
    </div>
  );
}

export function Waveform({
  playing = false,
  className = "",
}: {
  playing?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`waveform ${playing ? "waveform-playing" : ""} ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 43 }, (_, index) => (
        <i
          key={index}
          style={
            {
              "--height": `${12 + Math.abs(Math.sin(index * 2.31) * Math.cos(index * 0.36)) * 60}px`,
              "--delay": `${-(index % 9) * 0.17}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Phone({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`phone-scene ${small ? "phone-small" : ""}`}
      aria-label="Static Tilawatify Android app home-screen showcase"
      role="img"
    >
      <div className="phone-halo" />
      <div className="phone-orbit orbit-outer" />
      <div className="phone-orbit orbit-inner" />
      <div className="phone-float">
        <div className="phone-device">
          <div className="phone-button phone-button-left" />
          <div className="phone-button phone-button-right" />
          <div className="phone-inner">
            <img
              className="phone-screen"
              src="/images/tilawatify-home.png"
              alt="Tilawatify home screen with Quran quick access, Hifz progress and recitation player"
              draggable="false"
            />
            <div className="phone-camera">
              <i />
            </div>
            <div className="phone-status">
              <span>9:41</span>
              <span className="phone-signal">
                <svg
                  width="10"
                  height="9"
                  viewBox="0 0 10 9"
                  fill="currentColor"
                >
                  <rect x="0" y="6" width="2" height="3" rx=".4" />
                  <rect x="3" y="3" width="2" height="6" rx=".4" />
                  <rect x="6" y="0" width="2" height="9" rx=".4" />
                </svg>
                <svg width="12" height="9" viewBox="0 0 16 12">
                  <path
                    d="M1 4q7-6 14 0M4 7q4-4 8 0m-5 3h2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
                <b />
              </span>
            </div>
          </div>
          <div className="phone-gloss" />
        </div>
      </div>
      <div className="phone-ground" />
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="cta-rays" aria-hidden="true" />
      <Reveal className="container">
        <Star className="cta-star" />
        <span className="eyebrow">A MOMENT FOR YOUR HEART</span>
        <h2>
          Your Quran.
          <br />
          <span className="gradient-text">Always with you.</span>
        </h2>
        <p>
          Make a little space for what matters. Start your journey with
          Tilawatify.
        </p>
        <div className="actions">
          <DownloadButton />
          <TextLink to="/download">Installation guide</TextLink>
        </div>
        <div className="cta-counter-wrap">
          <LiveDownloadBadge />
        </div>
      </Reveal>
    </section>
  );
}

export function Modal({
  children,
  onClose,
  labelledBy,
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("button, a, input")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab" || !panel) return;
      const focusable = [
        ...panel.querySelectorAll<HTMLElement>(
          'button, a, input, [tabindex="0"]',
        ),
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);
  return createPortal(
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
        initial={{ y: 25, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 15, scale: 0.98 }}
        transition={{ duration: 0.3, ease }}
      >
        <button
          className="modal-close icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export function ScrollHint() {
  return (
    <a
      href="#discover"
      className="scroll-hint"
      aria-label="Scroll to discover Tilawatify"
    >
      <span>SCROLL TO DISCOVER</span>
      <ArrowDown size={15} />
    </a>
  );
}

export function ArrowLink({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}) {
  return (
    <Link to={to} className="arrow-link">
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}
