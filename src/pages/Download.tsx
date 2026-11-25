import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Copy,
  Download as DownloadIcon,
  ExternalLink,
  FileDown,
  FolderDown,
  Settings2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { APK_SHA256, APK_URL } from "../data";
import {
  DownloadButton,
  Logo,
  PageHeading,
  Reveal,
  SectionHeading,
  Star,
  ease,
} from "../components/Shared";
import { FAQ } from "../components/FAQ";
import {
  LiveDownloadBadge,
  useDownloadCounter,
} from "../components/DownloadCounter";

const installSteps = [
  {
    title: "A little peace, downloaded.",
    label: "DOWNLOAD THE APK",
    description:
      "Tap the download button and save Tilawatify.apk to your Android device. If your browser asks, choose Download anyway for this official APK.",
    icon: FolderDown,
  },
  {
    title: "Give your device permission.",
    label: "ALLOW THIS SOURCE",
    description:
      "Open the downloaded file. If prompted, go to Settings and allow your browser or file manager to install apps from this source.",
    icon: Settings2,
  },
  {
    title: "Your journey begins here.",
    label: "INSTALL & OPEN",
    description:
      "Tap Install, then Open. Find a familiar voice, choose a Surah, and settle into your first moment with Tilawatify.",
    icon: Smartphone,
  },
];

function InstallGuide() {
  const [active, setActive] = useState(0);
  return (
    <section className="install-section container" id="install">
      <SectionHeading
        eyebrow="THREE SMALL STEPS. A BEAUTIFUL BEGINNING."
        title={
          <>
            From download
            <br />
            <span className="muted-heading">to your first recitation.</span>
          </>
        }
        description="Installing directly on Android is simple. We'll walk you through it."
        center
      />
      <div className="install-steps">
        {installSteps.map((step, index) => (
          <Reveal key={step.label} delay={index * 0.1}>
            <button
              className={`install-step ${active === index ? "active" : ""}`}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
            >
              <div className="install-step-top">
                <span>0{index + 1}</span>
                <step.icon size={28} strokeWidth={1.2} />
                {index < 2 && (
                  <ArrowRight size={17} className="step-connector" />
                )}
              </div>
              <span className="overview-kicker">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </button>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="install-detail">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
            >
              <span className="install-tip-icon">
                {active === 0 ? (
                  <FileDown size={20} />
                ) : active === 1 ? (
                  <ShieldCheck size={20} />
                ) : (
                  <Check size={20} />
                )}
              </span>
              <div>
                <strong>
                  {active === 0
                    ? "Look for the official filename."
                    : active === 1
                      ? "A quick note about Android security."
                      : "Your Quran is ready when you are."}
                </strong>
                <p>
                  {active === 0
                    ? "Your download should be named Tilawatify.apk, approximately 33.4 MB, from the tilawatify-app GitHub release linked above."
                    : active === 1
                      ? "Only allow installation for the browser or file manager you are using. You can turn this permission off again after installing."
                      : "Streaming needs an internet connection. Pro listeners can save Surahs for offline moments. Head to Profile to make the experience your own."}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

export default function Download() {
  const { recordDownload } = useDownloadCounter();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyChecksum = async () => {
    try {
      await navigator.clipboard.writeText(APK_SHA256);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="YOUR NEXT CHAPTER STARTS HERE"
        title={
          <>
            Tilawatify for Android.
            <br />
            <span className="gradient-text">Your Quran. Anywhere.</span>
          </>
        }
        description="Bring your complete Quran companion to your Android. Download Tilawatify, take a breath, and begin."
      />
      <section className="download-section container">
        <Reveal className="download-counter-banner">
          <LiveDownloadBadge label="people have downloaded Tilawatify so far" />
        </Reveal>
        <Reveal className="download-card">
          <div className="download-card-glow" />
          <div className="download-app-info">
            <div className="download-app-icon">
              <Logo />
            </div>
            <div>
              <span className="eyebrow">THE OFFICIAL ANDROID APP</span>
              <h2>
                Tilawatify<span className="version-label">v1.0.0</span>
              </h2>
              <p>Your complete Quran companion.</p>
            </div>
          </div>
          <div className="download-specs">
            <div>
              <span>VERSION</span>
              <strong>
                1.0.0 <i>Latest release</i>
              </strong>
            </div>
            <div>
              <span>COMPATIBILITY</span>
              <strong>Android 7.0 &amp; above</strong>
            </div>
            <div>
              <span>DOWNLOAD SIZE</span>
              <strong>
                33.4 MB <small>/ APK</small>
              </strong>
            </div>
          </div>
          <DownloadButton className="download-main-button">
            Download Tilawatify v1.0.0 (APK)
          </DownloadButton>
          <span className="official-download-note">
            <ShieldCheck size={15} />
            Direct from our official GitHub release. No redirects to third-party
            stores.
          </span>
          <button
            className="release-details-toggle"
            onClick={() => setDetailsOpen(!detailsOpen)}
            aria-expanded={detailsOpen}
            aria-controls="release-details"
          >
            Release details &amp; file verification
            <ChevronDown className={detailsOpen ? "rotate" : ""} size={16} />
          </button>
          <AnimatePresence initial={false}>
            {detailsOpen && (
              <motion.div
                id="release-details"
                className="release-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div>
                  <p>
                    <strong>Initial release</strong> / Quran streaming, seven
                    featured Qaris, Hifz progress, favourites, and personal
                    playlists.
                  </p>
                  <span className="checksum-label">SHA-256 CHECKSUM</span>
                  <div className="checksum-value">
                    <code>{APK_SHA256}</code>
                    <button
                      className="icon-button"
                      onClick={copyChecksum}
                      aria-label={
                        copied ? "Checksum copied" : "Copy SHA-256 checksum"
                      }
                    >
                      {copied ? (
                        <ClipboardCheck size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                  <span className="copy-status" role="status">
                    {copied
                      ? "Checksum copied to clipboard."
                      : copyError
                        ? "Clipboard access is unavailable. You can select and copy the checksum above."
                        : "Compare this checksum with your downloaded file to verify its integrity."}
                  </span>
                  <a
                    href="https://github.com/tilawatify-app/Tilawatifyapp/releases/tag/v1.0.0"
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    View the official release
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
        <Reveal className="download-small-note">
          <Smartphone size={17} />
          <p>
            Made for Android. Not available for iOS or desktop.
            <br />
            <a href="#install">
              New to installing an APK? Follow the simple guide below.
              <ArrowDownToLine size={13} />
            </a>
          </p>
        </Reveal>
      </section>
      <InstallGuide />
      <FAQ
        items={[
          {
            question: "Why do I need to allow installation from this source?",
            answer:
              "Tilawatify is distributed directly as an APK. Android asks for your permission before a browser or file manager can install it. Only enable permission for the app you are using and turn it off after installation. On Android 7, this setting is usually under Security > Unknown sources. On Android 8 and later, look for Install unknown apps or Allow from this source.",
          },
          {
            question:
              "My browser says this type of file might be harmful. What should I do?",
            answer:
              "Browsers can display a general warning for APK files downloaded outside an app store. Confirm that you used the official GitHub link on this page and that the file is named Tilawatify.apk. You can also compare the SHA-256 checksum in Release details. Do not install a file if its source or checksum does not match.",
          },
          {
            question: "The app will not install. What can I try?",
            answer:
              "Check that your phone runs Android 7.0 or later, that you have enough free storage, and that the download has finished. If Android reports a corrupted package, delete the partial file and download it again from this page. If you already have another build installed, back up any important data before considering an uninstall.",
          },
          {
            question: "Is Tilawatify available on iPhone?",
            answer:
              "This release is for Android only. The APK cannot be installed on iPhone, iPad, Windows, or macOS. Any future platform announcements will come from Tilawatify.",
          },
          {
            question: "How do I update Tilawatify?",
            answer:
              "Return to the official Tilawatify website or GitHub releases page to check for a newer version. Download the official update and follow the installation prompts. This page currently links to v1.0.0.",
          },
        ]}
      />
      <section className="download-ending container">
        <Reveal>
          <Star />
          <h2>
            May every listen
            <br />
            <span className="gradient-text">bring you a little closer.</span>
          </h2>
          <a
            className="text-link"
            href={APK_URL}
            onClick={() => recordDownload()}
          >
            Begin with Tilawatify
            <DownloadIcon size={16} />
          </a>
        </Reveal>
      </section>
    </>
  );
}
