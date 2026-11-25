import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  AudioLines,
  BookOpen,
  ChevronRight,
  CirclePlay,
  Headphones,
  Sparkles,
} from "lucide-react";
import { reciters, TOP_QARI_IDS } from "../data";
import {
  DownloadButton,
  FinalCTA,
  Logo,
  Phone,
  Reveal,
  ScrollHint,
  SectionHeading,
  Star,
  TextLink,
  Waveform,
  ease,
} from "../components/Shared";
import { ReciterPlayButton } from "../components/AudioPlayer";
import { LiveDownloadBadge } from "../components/DownloadCounter";

function Marquee() {
  const names = [
    "Mishary Rashid Alafasy",
    "Abdul Rahman Al-Sudais",
    "Maher Al-Muaiqly",
    "Yasser Al-Dossari",
    "Saad Al-Ghamdi",
    "Hani Ar-Rifai",
    "Abdul Basit",
    "114 Surahs. Endless connection.",
    "Your Hifz journey",
    "Instant streaming",
  ];
  return (
    <section
      className="marquee-section"
      aria-label="Featuring renowned Quran reciters"
    >
      <div className="marquee-intro">
        <AudioLines size={24} strokeWidth={1.4} />
        <span>
          TIMELESS WORDS.
          <br />
          EXTRAORDINARY VOICES.
        </span>
      </div>
      <div className="marquee-window">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-copy" key={copy} aria-hidden={copy === 1}>
              {names.map((name) => (
                <span className="marquee-item" key={name}>
                  <Star />
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section className="overview-section container" id="discover">
      <SectionHeading
        eyebrow="FAITH MEETS THOUGHTFUL DESIGN"
        title={
          <>
            A deeper connection.
            <br />
            <span className="muted-heading">A simpler experience.</span>
          </>
        }
        description="Everything you need for your Quran journey. Nothing to get in the way."
        center
      />
      <div className="overview-grid">
        <Reveal delay={0.05}>
          <Link className="overview-card" to="/features#streaming">
            <div className="overview-visual streaming-visual">
              <div className="visual-orb" />
              <div className="visual-surah">
                <span className="surah-number">01</span>
                <div>
                  <strong>Al-Fatihah</strong>
                  <span>The Opening</span>
                </div>
                <CirclePlay size={28} strokeWidth={1.2} />
              </div>
              <Waveform playing />
              <div className="streaming-caption">
                <span className="live-dot" />
                114 SURAHS. ONE BEAUTIFUL PLACE.
              </div>
            </div>
            <div className="overview-copy">
              <span className="overview-kicker">
                <BookOpen size={15} /> THE COMPLETE QURAN
              </span>
              <h3>
                Every Surah.
                <br />
                Just a tap away.
              </h3>
              <p>
                Stream all 114 Surahs in the voices that bring you closer to the
                words.
              </p>
              <span className="card-link">
                Explore streaming
                <ArrowUpRight size={17} />
              </span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={0.15}>
          <Link className="overview-card" to="/features#hifz">
            <div className="overview-visual progress-visual">
              <svg className="progress-ring" viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="ringGradient">
                    <stop stopColor="#3074ea" />
                    <stop offset="1" stopColor="#84c2ff" />
                  </linearGradient>
                </defs>
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke="#20314e"
                  strokeWidth="7"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="402"
                  strokeDashoffset="110"
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div className="progress-ring-copy">
                <strong>One ayah</strong>
                <span>AT A TIME</span>
              </div>
              <span className="progress-caption">
                <Sparkles size={13} /> Every step is a step forward.
              </span>
            </div>
            <div className="overview-copy">
              <span className="overview-kicker">
                <Sparkles size={15} /> YOUR HIFZ JOURNEY
              </span>
              <h3>
                Small steps.
                <br />
                Meaningful progress.
              </h3>
              <p>
                Build a lasting connection with a Hifz tracker that grows with
                you.
              </p>
              <span className="card-link">
                Find your rhythm
                <ArrowUpRight size={17} />
              </span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={0.25}>
          <Link className="overview-card" to="/features#playback">
            <div className="overview-visual playback-visual">
              <div className="playback-lines" />
              <div className="instant-play">
                <span />
                <span />
                <div>
                  <Headphones size={32} strokeWidth={1.3} />
                </div>
              </div>
              <div className="playback-caption">
                <span className="live-dot" />
                READY WHEN YOU ARE
              </div>
            </div>
            <div className="overview-copy">
              <span className="overview-kicker">
                <AudioLines size={15} /> INSTANT PLAYBACK
              </span>
              <h3>
                Less waiting.
                <br />
                More presence.
              </h3>
              <p>
                Press play and settle in. Seamless listening, without the
                distractions.
              </p>
              <span className="card-link">
                Feel the difference
                <ArrowUpRight size={17} />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
      <Reveal className="overview-bottom">
        <TextLink to="/features">
          Discover everything Tilawatify can do
        </TextLink>
      </Reveal>
    </section>
  );
}

const topQariTitles: Record<string, string> = {
  sudais: "Qari Sudais",
  maher: "Qari Maher",
  yasser: "Qari Yasser",
};

function FeaturedReciters() {
  const topQaris = TOP_QARI_IDS.map((id) =>
    reciters.find((item) => item.id === id),
  ).filter((item): item is (typeof reciters)[number] => Boolean(item));

  return (
    <section className="featured-section container" id="top-qaris">
      <div className="featured-intro">
        <SectionHeading
          eyebrow="FAMILIAR VOICES. FRESH CONNECTION."
          title={
            <>
              Meet our top
              <br />
              <span className="gradient-text">Qari Quran.</span>
            </>
          }
          description="Listen to Qari Sudais, Qari Maher, and Qari Yasser — timeless recitations that reach the heart."
        />
        <Reveal>
          <TextLink to="/reciters">Explore all reciters</TextLink>
        </Reveal>
      </div>
      <div className="featured-grid">
        {topQaris.map((reciter, index) => (
          <Reveal
            key={reciter.id}
            delay={index * 0.1}
            className="featured-reciter"
          >
            <Link
              to={`/reciters?reciter=${reciter.id}`}
              className="featured-photo"
              aria-label={`Explore ${topQariTitles[reciter.id] || reciter.name}`}
            >
              <img src={reciter.image} alt={reciter.name} loading="lazy" />
              <div className="featured-photo-shade" />
              <span className="featured-qari-tag">
                {topQariTitles[reciter.id]}
              </span>
              <ArrowUpRight size={19} />
            </Link>
            <div className="featured-reciter-info">
              <div>
                <h3>{topQariTitles[reciter.id] || reciter.shortName}</h3>
                <span>
                  {reciter.name} &middot; {reciter.style}
                </span>
              </div>
              <ReciterPlayButton reciter={reciter} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-texture" aria-hidden="true" />
        <div className="hero-grid container">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="eyebrow hero-eyebrow">
              <span />
              YOUR QURAN. YOUR PEACE.
            </span>
            <h1 aria-label="Tilawatify - Your Complete Quran Companion">
              <span className="hero-brand">
                <Logo />
                Tilawatify<span className="brand-period">.</span>
              </span>
              <span className="hero-headline">
                Your Complete
                <br />
                <span className="gradient-text">Quran Companion.</span>
              </span>
            </h1>
            <p className="hero-description">
              Beautiful recitations. Meaningful progress.
              <br />A deeper connection with the Quran, every single day.
            </p>
            <div className="actions">
              <DownloadButton />
              <TextLink to="/features">Explore features</TextLink>
            </div>
            <div className="hero-counter-wrap">
              <LiveDownloadBadge />
            </div>
          </motion.div>
          <motion.div
            className="hero-showcase"
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.15, ease }}
          >
            <div className="hero-arch" aria-hidden="true">
              <svg viewBox="0 0 510 640">
                <path
                  d="M35 610V315C35 190 212 162 255 33c43 129 220 157 220 282v295"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M53 610V321C53 203 216 181 255 64c39 117 202 139 202 257v289"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".6"
                />
                <path
                  d="M16 610h478M9 620h492"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".7"
                />
              </svg>
            </div>
            <Phone />
          </motion.div>
          <ScrollHint />
        </div>
      </section>
      <Marquee />
      <Overview />
      <FeaturedReciters />
      <section className="reflection-section">
        <Reveal className="container">
          <Star />
          <blockquote>
            Let the words bring you back
            <br />
            to what truly matters.
          </blockquote>
          <span>A QUIETER MOMENT. A STRONGER CONNECTION.</span>
          <Link to="/features" aria-label="Explore your Quran journey">
            <ChevronRight size={20} />
          </Link>
        </Reveal>
      </section>
      <FinalCTA />
    </>
  );
}
