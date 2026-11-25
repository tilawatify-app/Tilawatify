import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Crown,
  LoaderCircle,
  Lock,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { type Reciter, surahs } from "../data";
import { usePro } from "./ProPlan";

type Track = { reciter: Reciter; surah: number; name: string };
type AudioContextValue = {
  track: Track | null;
  playing: boolean;
  loading: boolean;
  toggle: (reciter: Reciter, surah?: number) => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error("Audio controls must be used within AudioProvider");
  return context;
};

const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

export function AudioProvider({ children }: { children: ReactNode }) {
  const { isPro, openProModal } = usePro();
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const lastAllowedTimeRef = useRef(0);
  const lockTimerRef = useRef<number | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [lockNotice, setLockNotice] = useState(false);

  useEffect(() => {
    if (isPro) setLockNotice(false);
  }, [isPro]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
    };
  }, []);

  const showSeekLockPrompt = () => {
    setLockNotice(true);
    if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      setLockNotice(false);
    }, 6500);
  };

  const seekTo = (nextTime: number) => {
    if (!isPro) {
      showSeekLockPrompt();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(duration || nextTime, nextTime));
    lastAllowedTimeRef.current = clamped;
    audio.currentTime = clamped;
    setTime(clamped);
  };

  const seekBy = (deltaSeconds: number) => {
    if (!isPro) {
      showSeekLockPrompt();
      return;
    }
    const current = audioRef.current?.currentTime ?? time;
    seekTo(current + deltaSeconds);
  };

  const toggle = async (reciter: Reciter, surah = 1) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (
      track?.reciter.id === reciter.id &&
      track.surah === surah &&
      !audio.paused
    ) {
      audio.pause();
      return;
    }
    const request = ++requestRef.current;
    setError("");
    setLockNotice(false);
    if (track?.reciter.id !== reciter.id || track.surah !== surah) {
      audio.src = `https://cdn.mp3quran.net/audio/${reciter.server}/${String(surah).padStart(3, "0")}.mp3`;
      setTrack({
        reciter,
        surah,
        name:
          surahs.find((item) => item.id === surah)?.name || "Quran recitation",
      });
      lastAllowedTimeRef.current = 0;
      setTime(0);
      setDuration(0);
    }
    setLoading(true);
    try {
      await audio.play();
    } catch (cause) {
      if (request !== requestRef.current) return;
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError(
        "This preview could not load. Please try again or listen in the app.",
      );
      setLoading(false);
      setPlaying(false);
    }
  };

  const close = () => {
    requestRef.current += 1;
    lastAllowedTimeRef.current = 0;
    audioRef.current?.pause();
    audioRef.current?.removeAttribute("src");
    audioRef.current?.load();
    setTrack(null);
    setLoading(false);
    setError("");
    setLockNotice(false);
  };

  return (
    <AudioContext.Provider value={{ track, playing, loading, toggle }}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        muted={muted}
        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setLoading(false);
        }}
        onTimeUpdate={() => {
          const current = audioRef.current?.currentTime || 0;
          if (!isPro && Math.abs(current - lastAllowedTimeRef.current) > 2) {
            if (audioRef.current) {
              audioRef.current.currentTime = lastAllowedTimeRef.current;
            }
            return;
          }
          lastAllowedTimeRef.current = current;
          setTime(current);
        }}
        onSeeking={() => {
          const audio = audioRef.current;
          if (!audio || isPro) return;
          if (Math.abs(audio.currentTime - lastAllowedTimeRef.current) > 1.2) {
            audio.currentTime = lastAllowedTimeRef.current;
            showSeekLockPrompt();
          }
        }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onError={() => {
          if (audioRef.current?.getAttribute("src")) {
            setError(
              "This preview could not load. Please try again or listen in the app.",
            );
            setLoading(false);
            setPlaying(false);
          }
        }}
      />
      <AnimatePresence>
        {track && (
          <motion.aside
            className={`audio-player ${error ? "has-error" : ""} ${lockNotice ? "has-lock-notice" : ""}`}
            aria-label="Recitation preview player"
            initial={{ y: 110, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 110, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 250 }}
          >
            <AnimatePresence>
              {lockNotice && !isPro && (
                <motion.div
                  className="player-lock-prompt"
                  role="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="player-lock-prompt-copy">
                    <Lock size={14} aria-hidden="true" />
                    <span>
                      Seeking &amp; rewinding are locked on Free. Upgrade to
                      Tilawatify Pro (<strong>500 per month</strong>) to scrub
                      freely &amp; download audio.
                    </span>
                  </div>
                  <div className="player-lock-prompt-actions">
                    <button
                      type="button"
                      className="player-upgrade-btn"
                      onClick={() => {
                        setLockNotice(false);
                        openProModal();
                      }}
                    >
                      <Crown size={13} />
                      View Pro Plan
                    </button>
                    <button
                      type="button"
                      className="icon-button player-lock-dismiss"
                      onClick={() => setLockNotice(false)}
                      aria-label="Dismiss upgrade prompt"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="player-main-row">
              <img
                src={track.reciter.image}
                alt=""
                className="player-portrait"
              />
              <div className="player-info">
                <strong>
                  {track.name}
                  {isPro && (
                    <span className="player-pro-badge">
                      <Crown size={10} />
                      PRO
                    </span>
                  )}
                </strong>
                <span>{track.reciter.shortName}</span>
              </div>
              <div className="player-controls-group">
                <button
                  type="button"
                  className={`icon-button player-seek-btn ${!isPro ? "is-locked" : ""}`}
                  onClick={() => seekBy(-10)}
                  aria-label={
                    isPro
                      ? "Rewind 10 seconds"
                      : "Rewind locked — Pro required"
                  }
                  title={
                    isPro
                      ? "Rewind 10s"
                      : "Upgrade to Pro (500 per month) to rewind"
                  }
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  className="player-play icon-button"
                  aria-label={playing ? "Pause recitation" : "Play recitation"}
                  onClick={() => toggle(track.reciter, track.surah)}
                >
                  {loading ? (
                    <LoaderCircle className="spin" size={21} />
                  ) : playing ? (
                    <Pause size={21} fill="currentColor" />
                  ) : (
                    <Play size={21} fill="currentColor" />
                  )}
                </button>
                <button
                  type="button"
                  className={`icon-button player-seek-btn ${!isPro ? "is-locked" : ""}`}
                  onClick={() => seekBy(10)}
                  aria-label={
                    isPro
                      ? "Forward 10 seconds"
                      : "Forward locked — Pro required"
                  }
                  title={
                    isPro
                      ? "Forward 10s"
                      : "Upgrade to Pro (500 per month) to jump ahead"
                  }
                >
                  <RotateCw size={16} />
                </button>
              </div>
              <div
                className={`player-timeline ${!isPro ? "is-locked" : ""}`}
                onPointerDown={() => {
                  if (!isPro) showSeekLockPrompt();
                }}
              >
                <span>{formatTime(time)}</span>
                <div className="player-range-wrap">
                  <input
                    aria-label={
                      isPro
                        ? "Recitation progress"
                        : "Recitation progress (locked on Free — Pro required to seek)"
                    }
                    type="range"
                    min="0"
                    max={duration || 1}
                    step="0.1"
                    value={time}
                    onChange={(event) => {
                      if (!isPro) {
                        showSeekLockPrompt();
                        return;
                      }
                      seekTo(Number(event.target.value));
                    }}
                    onKeyDown={(event) => {
                      if (
                        !isPro &&
                        [
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                          "Home",
                          "End",
                          "PageUp",
                          "PageDown",
                        ].includes(event.key)
                      ) {
                        event.preventDefault();
                        showSeekLockPrompt();
                      }
                    }}
                  />
                  {!isPro && (
                    <Lock
                      size={11}
                      className="timeline-lock-icon"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span>{formatTime(duration)}</span>
              </div>
              <button
                type="button"
                className="icon-button player-volume"
                onClick={() => setMuted(!muted)}
                aria-label={muted ? "Unmute recitation" : "Mute recitation"}
              >
                {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
              <button
                type="button"
                className="icon-button player-close"
                onClick={close}
                aria-label="Close audio player"
              >
                <X size={19} />
              </button>
            </div>
            <p className="player-error" role="status">
              {error}
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </AudioContext.Provider>
  );
}

export function ReciterPlayButton({
  reciter,
  surah = 1,
  className = "",
}: {
  reciter: Reciter;
  surah?: number;
  className?: string;
}) {
  const { track, playing, loading, toggle } = useAudio();
  const active = track?.reciter.id === reciter.id && track.surah === surah;
  return (
    <button
      className={`reciter-play ${active && playing ? "is-playing" : ""} ${className}`}
      aria-label={`${active && playing ? "Pause" : "Play"} ${surahs.find((item) => item.id === surah)?.name || "preview"} by ${reciter.name}`}
      onClick={(event) => {
        event.stopPropagation();
        toggle(reciter, surah);
      }}
    >
      {active && loading ? (
        <LoaderCircle size={19} className="spin" />
      ) : active && playing ? (
        <Pause size={18} fill="currentColor" />
      ) : (
        <Play size={18} fill="currentColor" />
      )}
    </button>
  );
}
