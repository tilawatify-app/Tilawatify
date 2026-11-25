import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowUpRight, CodeXml, Menu, X } from "lucide-react";
import { AudioProvider } from "./components/AudioPlayer";
import { DownloadCounterProvider } from "./components/DownloadCounter";
import { ProProvider } from "./components/ProPlan";
import { Atmosphere, DownloadButton, Logo, ease } from "./components/Shared";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Reciters from "./pages/Reciters";
import Pro from "./pages/Pro";
import Download from "./pages/Download";

const links = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/reciters", label: "Reciters" },
  { to: "/pro", label: "Tilawatify Pro" },
  { to: "/download", label: "Install Guide" },
];

function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="nav-container container">
        <Link className="brand" to="/" aria-label="Tilawatify home">
          <Logo />
          <span>
            Tilawatify<span className="brand-period">.</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink end={link.to === "/"} key={link.to} to={link.to}>
              {({ isActive }) => (
                <>
                  <span>
                    {link.label}
                    {link.to === "/pro" && (
                      <span className="nav-pro-spark" aria-hidden="true">
                        +
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.i
                      layoutId="nav-active"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <DownloadButton compact />
          <button
            className="mobile-menu-toggle icon-button"
            ref={toggleRef}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              {links.map((link, index) => (
                <NavLink
                  key={link.to}
                  end={link.to === "/"}
                  to={link.to}
                  onClick={() => setOpen(false)}
                >
                  <span>0{index + 1}</span>
                  {link.label}
                  <ArrowUpRight size={17} />
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link className="brand" to="/" aria-label="Tilawatify home">
              <Logo />
              <span>
                Tilawatify<span className="brand-period">.</span>
              </span>
            </Link>
            <p>
              Your complete Quran companion.
              <br />A little closer, every day.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <span>EXPLORE TILAWATIFY</span>
            <div>
              {links.slice(1).map((link) => (
                <Link key={link.to} to={link.to}>
                  {link.to === "/download" ? "Download & Install" : link.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="footer-download">
            <span>YOUR JOURNEY STARTS HERE</span>
            <DownloadButton compact />
            <a
              href="https://github.com/tilawatify-app/Tilawatifyapp"
              target="_blank"
              rel="noreferrer"
            >
              <CodeXml size={14} /> Find us on GitHub
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} Tilawatify. Made with purpose.
          </span>
          <span>
            Listen. Reflect. Grow.
            <i />
            <span className="footer-status-dot" />
            Crafted for your connection.
          </span>
        </div>
      </div>
    </footer>
  );
}

const pageTitles: Record<string, string> = {
  "/": "Tilawatify | Your Complete Quran Companion",
  "/features": "Thoughtful Features | Tilawatify",
  "/reciters": "Extraordinary Quran Reciters | Tilawatify",
  "/pro": "A Little More Possibility | Tilawatify Pro",
  "/download": "Download & Install Tilawatify v1.0.0 for Android",
};

function Site() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    document.title =
      pageTitles[location.pathname] || "Page Not Found | Tilawatify";
    if (previousPath.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      previousPath.current = location.pathname;
    }
    if (location.hash) {
      const timer = window.setTimeout(() => {
        const id = ["#hifz", "#streaming", "#playback"].includes(location.hash)
          ? "feature-explorer"
          : location.hash.slice(1);
        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
            block: "start",
          });
      }, 350);
      return () => window.clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Atmosphere />
      <Navigation />
      <main id="main-content">
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            if (!window.location.hash)
              window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/reciters" element={<Reciters />} />
              <Route path="/pro" element={<Pro />} />
              <Route path="/download" element={<Download />} />
              <Route
                path="*"
                element={
                  <section className="not-found container">
                    <Logo />
                    <span className="eyebrow">A LITTLE OFF THE PATH</span>
                    <h1>Let's find your way back.</h1>
                    <p>
                      The page you're looking for isn't here. Your Quran journey
                      still is.
                    </p>
                    <Link className="button button-primary" to="/">
                      Return to Tilawatify
                      <ArrowUpRight size={17} />
                    </Link>
                  </section>
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <DownloadCounterProvider>
          <ProProvider>
            <AudioProvider>
              <Site />
            </AudioProvider>
          </ProProvider>
        </DownloadCounterProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
