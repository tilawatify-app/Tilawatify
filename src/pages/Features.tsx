import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownToLine,
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  CheckCheck,
  ChevronRight,
  CloudOff,
  Heart,
  ListMusic,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  Target,
  Wifi,
  WifiOff,
} from "lucide-react";
import { reciters, surahs } from "../data";
import {
  FinalCTA,
  Logo,
  PageHeading,
  Reveal,
  SectionHeading,
  TextLink,
  Waveform,
  ease,
} from "../components/Shared";
import { ReciterPlayButton, useAudio } from "../components/AudioPlayer";
import { FAQ } from "../components/FAQ";

const features = [
  {
    id: "streaming",
    icon: AudioLines,
    name: "The complete Quran. Instantly.",
    description:
      "From Al-Fatihah to An-Nas, every Surah is ready when you are. Find your favourite reciter, press play, and be present.",
    detail: "Full Quran. Beloved Qaris. No unnecessary steps.",
  },
  {
    id: "offline",
    icon: CloudOff,
    name: "Your peace. Not your signal.",
    description:
      "Save Surahs with Pro and listen without a connection. If your signal drops while streaming, clear messages help you find your way back.",
    detail: "Offline downloads are included with Tilawatify Pro.",
  },
  {
    id: "hifz",
    icon: Target,
    name: "A journey, one ayah at a time.",
    description:
      "Give every small achievement a place. Keep track of memorized Surahs and build a Quran routine that feels meaningful, not overwhelming.",
    detail: "Your progress, at your pace. Always.",
  },
  {
    id: "playlists",
    icon: ListMusic,
    name: "A listening space of your own.",
    description:
      "Keep the recitations you love close. Create personal playlists for reflection, revision, or the quiet moments in between.",
    detail: "Your favourites, together. Unlimited playlists with Pro.",
  },
  {
    id: "midnight",
    icon: Moon,
    name: "Less distraction. More reflection.",
    description:
      "A considered, midnight-blue interface that gives the Quran room to breathe. Thoughtful contrast and effortless controls, day or night.",
    detail: "Calm by design. Beautiful in every detail.",
  },
];

function StreamingPreview() {
  const [query, setQuery] = useState("");
  const { track, playing } = useAudio();
  const filtered = surahs.filter((surah) =>
    surah.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="app-preview">
      <div className="preview-app-header">
        <Logo />
        <strong>Your Quran</strong>
        <span>114 SURAHS</span>
      </div>
      <div className="preview-search">
        <Search size={15} />
        <input
          aria-label="Search preview Surahs"
          placeholder="Find a Surah..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="preview-track-list">
        {filtered.map((surah) => (
          <div className="preview-surah" key={surah.id}>
            <span className="surah-number">
              {String(surah.id).padStart(3, "0")}
            </span>
            <div>
              <strong>{surah.name}</strong>
              <span>{surah.meaning}</span>
            </div>
            <ReciterPlayButton reciter={reciters[0]} surah={surah.id} />
          </div>
        ))}
        {!filtered.length && (
          <p className="preview-empty">
            Try Al-Fatihah, Ar-Rahman, Al-Mulk, or Al-Ikhlas.
          </p>
        )}
      </div>
      <div className="preview-now-playing">
        <Waveform playing={playing && track?.reciter.id === "mishary"} />
        <span>
          {playing && track?.reciter.id === "mishary"
            ? `Now playing ${track.name}`
            : "Find your Surah. Press play. Be present."}
        </span>
      </div>
    </div>
  );
}

function OfflinePreview() {
  const [offline, setOffline] = useState(false);
  return (
    <div className="app-preview offline-preview">
      <div className="preview-app-header">
        <ArrowDownToLine size={22} />
        <strong>Your offline library</strong>
        <span>PRO</span>
      </div>
      <button
        className={`connection-toggle ${offline ? "offline" : ""}`}
        onClick={() => setOffline(!offline)}
        aria-pressed={offline}
      >
        {offline ? <WifiOff size={18} /> : <Wifi size={18} />}
        <span>
          {offline
            ? "You are offline. Your Quran is not."
            : "Connected. Ready for wherever life takes you."}
        </span>
        <i />
      </button>
      <div className="preview-track-list">
        {surahs.slice(0, 3).map((surah) => (
          <div className="preview-surah" key={surah.id}>
            <span className="surah-number">
              {String(surah.id).padStart(3, "0")}
            </span>
            <div>
              <strong>{surah.name}</strong>
              <span>Mishary Rashid Alafasy</span>
            </div>
            <span className="downloaded-check">
              <CheckCheck size={18} />
            </span>
          </div>
        ))}
      </div>
      <div className="preview-footer-note">
        <Check size={14} />
        Saved for the moments without a signal.
      </div>
      <span className="preview-instruction">
        Tap the connection switch to preview offline mode.
      </span>
    </div>
  );
}

function HifzPreview() {
  const [completed, setCompleted] = useState<number[]>([112]);
  const shortSurahs = [
    { id: 112, name: "Al-Ikhlas", verses: "4 ayahs" },
    { id: 113, name: "Al-Falaq", verses: "5 ayahs" },
    { id: 114, name: "An-Nas", verses: "6 ayahs" },
  ];
  return (
    <div className="app-preview hifz-preview">
      <div className="preview-app-header">
        <Target size={22} />
        <strong>Your Hifz journey</strong>
        <Sparkles size={17} />
      </div>
      <div className="hifz-demo-progress">
        <span>Every little step counts.</span>
        <strong>
          {completed.length}
          <small> / 3 Surahs in this preview</small>
        </strong>
        <div>
          <motion.i
            animate={{ width: `${(completed.length / 3) * 100}%` }}
            transition={{ duration: 0.5, ease }}
          />
        </div>
      </div>
      <div className="preview-track-list">
        {shortSurahs.map((surah) => (
          <button
            className={`preview-surah hifz-check-row ${completed.includes(surah.id) ? "completed" : ""}`}
            onClick={() =>
              setCompleted((previous) =>
                previous.includes(surah.id)
                  ? previous.filter((id) => id !== surah.id)
                  : [...previous, surah.id],
              )
            }
            key={surah.id}
          >
            <span className="surah-number">{surah.id}</span>
            <div>
              <strong>{surah.name}</strong>
              <span>{surah.verses}</span>
            </div>
            <span className="custom-checkbox">
              {completed.includes(surah.id) && <Check size={15} />}
            </span>
          </button>
        ))}
      </div>
      <span className="preview-instruction">
        Try it: mark a Surah as memorized. This is a demo.
      </span>
    </div>
  );
}

function PlaylistPreview() {
  const [favourites, setFavourites] = useState<number[]>([55]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [playlistName, setPlaylistName] = useState("Moments of reflection");
  return (
    <div className="app-preview playlist-preview">
      <div className="preview-app-header">
        <ListMusic size={22} />
        <strong>Your listening space</strong>
        <Heart size={17} />
      </div>
      <div className="demo-playlist">
        <div className="demo-playlist-art">
          <Moon size={28} strokeWidth={1.2} />
        </div>
        <div>
          <span>PERSONAL PLAYLIST</span>
          <h3>{playlistName}</h3>
          <p>A little peace, on repeat.</p>
        </div>
      </div>
      {adding ? (
        <form
          className="playlist-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim()) {
              setPlaylistName(name.trim());
              setAdding(false);
            }
          }}
        >
          <input
            autoFocus
            maxLength={36}
            aria-label="Preview playlist name"
            placeholder="Give your playlist a name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <button
            className="icon-button"
            aria-label="Save preview playlist name"
            type="submit"
          >
            <Check size={18} />
          </button>
        </form>
      ) : (
        <button
          className="demo-new-playlist"
          onClick={() => {
            setName("");
            setAdding(true);
          }}
        >
          <Plus size={15} />
          Try naming your playlist
        </button>
      )}
      <div className="preview-track-list">
        {surahs.slice(1, 4).map((surah) => (
          <div className="preview-surah" key={surah.id}>
            <span className="surah-number">
              {String(surah.id).padStart(3, "0")}
            </span>
            <div>
              <strong>{surah.name}</strong>
              <span>{surah.meaning}</span>
            </div>
            <button
              className={`icon-button favourite-button ${favourites.includes(surah.id) ? "favourited" : ""}`}
              aria-label={`${favourites.includes(surah.id) ? "Remove" : "Add"} ${surah.name} ${favourites.includes(surah.id) ? "from" : "to"} preview favourites`}
              onClick={() =>
                setFavourites((previous) =>
                  previous.includes(surah.id)
                    ? previous.filter((id) => id !== surah.id)
                    : [...previous, surah.id],
                )
              }
            >
              <Heart
                size={18}
                fill={favourites.includes(surah.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
        ))}
      </div>
      <span className="preview-instruction">
        A small interactive preview. Make it yours in the app.
      </span>
    </div>
  );
}

function MidnightPreview() {
  const [night, setNight] = useState(true);
  return (
    <div className={`app-preview midnight-preview ${night ? "night" : "day"}`}>
      <div className="preview-app-header">
        <Logo />
        <strong>Tilawatify</strong>
        <button
          className="icon-button"
          onClick={() => setNight(!night)}
          aria-label={
            night ? "Compare a light interface" : "Return to midnight blue"
          }
        >
          {night ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
      <div className="midnight-art">
        <Moon size={48} strokeWidth={1} />
        <span>Find your quiet.</span>
        <p>
          A little less noise.
          <br />A little more connection.
        </p>
        <div className="theme-stars">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="midnight-bottom">
        <span className="theme-swatch" />
        <div>
          <strong>
            {night
              ? "Midnight blue. Thoughtfully chosen."
              : "Feel the difference."}
          </strong>
          <span>
            {night
              ? "Designed to let the words take the spotlight."
              : "Tap the sun to return to Tilawatify midnight."}
          </span>
        </div>
        <Check size={18} />
      </div>
    </div>
  );
}

const previews = [
  StreamingPreview,
  OfflinePreview,
  HifzPreview,
  PlaylistPreview,
  MidnightPreview,
];

export default function Features() {
  const location = useLocation();
  const [active, setActive] = useState(location.hash === "#hifz" ? 2 : 0);
  useEffect(() => {
    if (location.hash === "#hifz") setActive(2);
    else if (location.hash === "#streaming" || location.hash === "#playback")
      setActive(0);
  }, [location.hash]);
  const Preview = previews[active];
  return (
    <>
      <PageHeading
        eyebrow="THE TILAWATIFY EXPERIENCE"
        title={
          <>
            Tilawatify Features.
            <br />
            <span className="gradient-text">More than listening.</span>
          </>
        }
        description="Thoughtfully built around the way you listen, memorize, and return to the Quran. Discover the details that make a difference."
      />
      <section className="feature-explorer container" id="feature-explorer">
        <div
          className="feature-tab-list"
          role="tablist"
          aria-label="Explore Tilawatify features"
          aria-orientation="vertical"
        >
          {features.map((feature, index) => (
            <button
              role="tab"
              id={`feature-tab-${index}`}
              aria-selected={active === index}
              aria-controls="feature-preview"
              className={`feature-tab ${active === index ? "active" : ""}`}
              key={feature.id}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const next =
                    (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      features.length) %
                    features.length;
                  setActive(next);
                  document.getElementById(`feature-tab-${next}`)?.focus();
                }
              }}
              tabIndex={active === index ? 0 : -1}
            >
              <span className="feature-tab-number">0{index + 1}</span>
              <feature.icon size={21} strokeWidth={1.5} />
              <span className="feature-tab-content">
                <strong>{feature.name}</strong>
                <AnimatePresence initial={false}>
                  {active === index && (
                    <motion.span
                      className="feature-tab-description"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.description}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
        <Reveal className="feature-preview-stage">
          <div className="feature-stage-orb" />
          <span className="preview-label">
            <span />
            AN INTERACTIVE GLIMPSE OF THE APP
          </span>
          <div
            role="tabpanel"
            id="feature-preview"
            aria-labelledby={`feature-tab-${active}`}
            className="feature-preview-panel"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease }}
              >
                <Preview />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="feature-detail-note">{features[active].detail}</p>
        </Reveal>
      </section>
      <section className="feature-principles container">
        <SectionHeading
          eyebrow="PURPOSE IN EVERY DETAIL"
          title={
            <>
              Made to feel effortless.
              <br />
              <span className="muted-heading">Built to mean more.</span>
            </>
          }
        />
        <div className="principles-list">
          <Reveal>
            <span>01</span>
            <div>
              <h3>A complete experience, not a complicated one.</h3>
              <p>
                The Quran, your favourite voices, and your progress. All in one
                considered space.
              </p>
            </div>
            <BookOpen size={24} strokeWidth={1.2} />
          </Reveal>
          <Reveal>
            <span>02</span>
            <div>
              <h3>Your next moment is always within reach.</h3>
              <p>
                Pick up where you left off, revisit a favourite, or discover a
                different recitation.
              </p>
            </div>
            <ArrowRight size={24} strokeWidth={1.2} />
          </Reveal>
          <Reveal>
            <span>03</span>
            <div>
              <h3>A little more freedom with Tilawatify Pro.</h3>
              <p>
                Take your Surahs offline, create unlimited playlists, and listen
                without ads.
              </p>
              <TextLink to="/pro">Explore Tilawatify Pro</TextLink>
            </div>
            <Sparkles size={24} strokeWidth={1.2} />
          </Reveal>
        </div>
      </section>
      <FAQ
        items={[
          {
            question: "Can I listen to all 114 Surahs for free?",
            answer:
              "Yes. Tilawatify Free includes streaming for all 114 Surahs with our featured reciters. Download the app and begin your listening journey.",
          },
          {
            question: "Does Tilawatify work without an internet connection?",
            answer:
              "Streaming requires an internet connection. With Tilawatify Pro, you can download Surahs in the app and listen to your saved recitations offline.",
          },
          {
            question: "Can I try the app features on this website?",
            answer:
              "The interactive showcases above are small website demonstrations. Recitation previews play real audio, while Hifz, playlists, offline mode, and theme controls are illustrative previews. Your complete Quran experience is inside the Android app.",
          },
          {
            question: "Which Android versions are supported?",
            answer:
              "Tilawatify v1.0.0 supports Android 7.0 (Nougat) and later. Visit the Download & Install page for the official APK and step-by-step instructions.",
          },
        ]}
      />
      <FinalCTA />
    </>
  );
}
