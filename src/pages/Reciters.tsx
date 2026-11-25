import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  AudioLines,
  BookOpen,
  Check,
  Heart,
  Headphones,
  Search,
  X,
} from "lucide-react";
import { reciters, surahs, type Reciter } from "../data";
import {
  DownloadButton,
  FinalCTA,
  Modal,
  PageHeading,
  Reveal,
  Waveform,
} from "../components/Shared";
import { ReciterPlayButton, useAudio } from "../components/AudioPlayer";
import { useStoredState } from "../hooks";

function ReciterDetails({
  reciter,
  saved,
  onSave,
  onClose,
}: {
  reciter: Reciter;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const { track, playing } = useAudio();
  return (
    <Modal onClose={onClose} labelledBy="reciter-modal-title">
      <div className="reciter-modal-hero">
        <img src={reciter.image} alt={reciter.name} />
        <span className="eyebrow">A VOICE FOR YOUR JOURNEY</span>
        <h2 id="reciter-modal-title">{reciter.name}</h2>
        <span className="reciter-modal-origin">
          {reciter.country}
          <i />
          {reciter.style}
        </span>
      </div>
      <div className="reciter-modal-body">
        <p>{reciter.description}</p>
        <div className="modal-section-label">
          <span>
            <Headphones size={16} /> Take a moment. Listen.
          </span>
          <button
            className={`save-reciter ${saved ? "is-saved" : ""}`}
            onClick={onSave}
            aria-label={
              saved ? `Unsave ${reciter.name}` : `Save ${reciter.name}`
            }
          >
            <Heart size={15} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save voice"}
          </button>
        </div>
        <div className="preview-surahs">
          {surahs
            .filter((surah) => [1, 112].includes(surah.id))
            .map((surah) => (
              <div
                className={`preview-surah ${track?.reciter.id === reciter.id && track.surah === surah.id ? "active" : ""}`}
                key={surah.id}
              >
                <span className="surah-number">
                  {String(surah.id).padStart(3, "0")}
                </span>
                <div>
                  <strong>{surah.name}</strong>
                  <span>
                    {surah.meaning} / {surah.verses} ayahs
                  </span>
                </div>
                {track?.reciter.id === reciter.id &&
                  track.surah === surah.id &&
                  playing && <Waveform playing />}
                <ReciterPlayButton reciter={reciter} surah={surah.id} />
              </div>
            ))}
        </div>
        <div className="modal-download">
          <span>
            <Check size={15} /> All 114 Surahs in the app
          </span>
          <DownloadButton compact />
        </div>
        <p className="audio-attribution">
          Web previews provided by MP3Quran.net.
        </p>
      </div>
    </Modal>
  );
}

export default function Reciters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All voices");
  const [saved, setSaved] = useStoredState<string[]>(
    "tilawatify-saved-reciters",
    [],
  );
  const selected =
    reciters.find((reciter) => reciter.id === searchParams.get("reciter")) ||
    null;
  const visible = reciters.filter(
    (reciter) =>
      reciter.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All voices" ||
        (filter === "Saved voices"
          ? saved.includes(reciter.id)
          : reciter.style === filter)),
  );
  const toggleSaved = (id: string) =>
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  useEffect(() => {
    if (searchParams.get("reciter") && !selected)
      setSearchParams({}, { replace: true });
  }, [searchParams, selected, setSearchParams]);

  return (
    <>
      <PageHeading
        eyebrow="THE VOICES OF TILAWATIFY"
        title={
          <>
            The voices of Tilawatify.
            <br />
            <span className="gradient-text">A connection that stays.</span>
          </>
        }
        description="Find the recitation that speaks to your heart. Explore seven beloved Qaris, each with all 114 Surahs."
      />
      <section className="reciters-section container">
        <Reveal className="reciters-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Filter reciters by style"
          >
            {[
              "All voices",
              "Melodic",
              "Reflective",
              "Powerful",
              "Saved voices",
            ].map((item) => (
              <button
                className={filter === item ? "active" : ""}
                key={item}
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
              >
                {item === "Saved voices" && <Heart size={13} />}
                {item}
              </button>
            ))}
          </div>
          <div className="search-field">
            <Search size={17} />
            <input
              type="search"
              aria-label="Search reciters"
              placeholder="Find your reciter..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                className="icon-button"
                aria-label="Clear reciter search"
                onClick={() => setSearch("")}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </Reveal>
        <div className="reciter-results-label" aria-live="polite">
          <span>
            {visible.length} {visible.length === 1 ? "voice" : "voices"} to
            connect with
          </span>
          <span>
            <Headphones size={13} /> Press play for a moment of peace
          </span>
        </div>
        <motion.div layout className="reciters-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((reciter, index) => (
              <motion.article
                layout
                className="reciter-card"
                key={reciter.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: index * 0.035 }}
              >
                <div className="reciter-card-photo">
                  <button
                    className="reciter-photo-button"
                    onClick={() =>
                      setSearchParams(
                        { reciter: reciter.id },
                        { preventScrollReset: true },
                      )
                    }
                    aria-label={`Explore ${reciter.name}`}
                  >
                    <img
                      src={reciter.image}
                      alt={reciter.name}
                      loading="lazy"
                    />
                  </button>
                  <span className="surah-badge">
                    <BookOpen size={12} />
                    114 Surahs
                  </span>
                  <button
                    className={`reciter-save icon-button ${saved.includes(reciter.id) ? "is-saved" : ""}`}
                    onClick={() => toggleSaved(reciter.id)}
                    aria-label={`${saved.includes(reciter.id) ? "Unsave" : "Save"} ${reciter.name}`}
                  >
                    <Heart
                      size={17}
                      fill={
                        saved.includes(reciter.id) ? "currentColor" : "none"
                      }
                    />
                  </button>
                  <ReciterPlayButton reciter={reciter} />
                </div>
                <div className="reciter-card-copy">
                  <span className="reciter-country">{reciter.country}</span>
                  <button
                    onClick={() =>
                      setSearchParams(
                        { reciter: reciter.id },
                        { preventScrollReset: true },
                      )
                    }
                  >
                    <h2>{reciter.name}</h2>
                  </button>
                  <div className="reciter-style">
                    <AudioLines size={13} />
                    {reciter.style} recitation
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        {!visible.length && (
          <div className="empty-state">
            <Search size={30} strokeWidth={1} />
            <h2>
              {filter === "Saved voices"
                ? "Your favourite voices belong here."
                : "No voices found, just yet."}
            </h2>
            <p>
              {filter === "Saved voices"
                ? "Tap the heart on a reciter to keep them close."
                : "Try a different name or explore all seven reciters."}
            </p>
            <button
              className="button button-secondary"
              onClick={() => {
                setSearch("");
                setFilter("All voices");
              }}
            >
              Explore all voices
            </button>
          </div>
        )}
        <Reveal className="reciters-note">
          <BookOpen size={19} />
          <p>
            One complete Quran. Seven extraordinary ways to connect.
            <br />
            <span>All reciters are available in the free Tilawatify app.</span>
          </p>
        </Reveal>
      </section>
      <FinalCTA />
      <AnimatePresence>
        {selected && (
          <ReciterDetails
            reciter={selected}
            saved={saved.includes(selected.id)}
            onSave={() => toggleSaved(selected.id)}
            onClose={() => setSearchParams({}, { preventScrollReset: true })}
          />
        )}
      </AnimatePresence>
    </>
  );
}
