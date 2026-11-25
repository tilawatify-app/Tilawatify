import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Gift,
  Headphones,
  Lock,
  Minus,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";
import {
  DownloadButton,
  FinalCTA,
  Logo,
  PageHeading,
  Reveal,
  SectionHeading,
  ease,
} from "../components/Shared";
import { FAQ } from "../components/FAQ";
import { ProPlanCard, usePro } from "../components/ProPlan";

const comparisons = [
  { label: "Full 114-Surah streaming", free: true, pro: true },
  { label: "All featured reciters", free: true, pro: true },
  { label: "Hifz progress tracker", free: true, pro: true },
  { label: "Favourites", free: true, pro: true },
  { label: "Personal playlists", free: "Standard", pro: "Unlimited" },
  { label: "Audio seek, scrub & rewind", free: "Locked", pro: "Unlocked" },
  { label: "Offline Surah downloads", free: false, pro: true },
  { label: "Ad-free experience", free: false, pro: true },
];

const redeemSteps = [
  {
    title: "Open your Profile",
    description: "Open Tilawatify and tap Profile in the bottom navigation.",
  },
  {
    title: "Discover Tilawatify Pro",
    description:
      "Choose Tilawatify Pro from your profile to view the Pro Plan.",
  },
  {
    title: "Redeem. Reconnect.",
    description:
      "Select the redeem option, enter your code, and confirm to activate your Pro benefits.",
  },
];

function RedeemGuide() {
  const [step, setStep] = useState(0);
  return (
    <section className="redeem-section container" id="redeem">
      <div className="redeem-copy">
        <SectionHeading
          eyebrow="PRO ACCESS MADE SIMPLE"
          title={
            <>
              Your invitation
              <br />
              to <span className="gradient-text">something more.</span>
            </>
          }
          description="Explore Tilawatify Pro in just a few taps inside the app, or view the Pro Plan above."
        />
        <div className="redeem-steps">
          {redeemSteps.map((item, index) => (
            <button
              className={`redeem-step ${step === index ? "active" : ""}`}
              key={item.title}
              onClick={() => setStep(index)}
              aria-pressed={step === index}
            >
              <span>
                {step > index ? <Check size={17} /> : `0${index + 1}`}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
        <p className="redeem-disclaimer">
          <ShieldCheck size={15} />
          Pro unlocks offline audio downloads, unlimited playlists, and full
          seek &amp; rewind playback controls.
        </p>
      </div>
      <Reveal className="redeem-visual">
        <div className="redeem-glow" />
        <div className="redeem-app">
          <div className="redeem-app-head">
            <Logo />
            <span>Tilawatify</span>
            <i />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              className="redeem-screen-content"
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease }}
            >
              {step === 0 ? (
                <>
                  <div className="demo-user-avatar">
                    <UserRound size={35} strokeWidth={1.2} />
                  </div>
                  <span className="demo-small-label">YOUR PERSONAL SPACE</span>
                  <h3>Assalamu Alaikum.</h3>
                  <p>A little closer, every day.</p>
                  <div className="demo-profile-row">
                    <Crown size={20} />
                    <div>
                      <strong>Tilawatify Pro</strong>
                      <span>View Pro Plan</span>
                    </div>
                    <ChevronRight size={15} />
                  </div>
                  <div className="demo-profile-row subtle">
                    <Headphones size={19} />
                    <div>
                      <strong>Listening history</strong>
                      <span>Your recent moments</span>
                    </div>
                  </div>
                </>
              ) : step === 1 ? (
                <>
                  <div className="pro-demo-icon">
                    <Crown size={34} strokeWidth={1.1} />
                  </div>
                  <span className="demo-small-label">
                    YOUR QURAN. WITHOUT LIMITS.
                  </span>
                  <h3>
                    Tilawatify <em>Pro</em>
                  </h3>
                  <p>500 per month &middot; Audio downloads included</p>
                  <ul className="demo-pro-benefits">
                    <li>
                      <Check size={15} />
                      Offline audio downloads
                    </li>
                    <li>
                      <Check size={15} />
                      Unlimited playlists
                    </li>
                    <li>
                      <Check size={15} />
                      Ad-free &amp; full seek control
                    </li>
                  </ul>
                  <span className="demo-redeem-label">
                    <Gift size={16} />
                    or redeem code
                    <ArrowRight size={15} />
                  </span>
                </>
              ) : (
                <>
                  <div className="pro-demo-icon">
                    <Ticket size={33} strokeWidth={1.2} />
                  </div>
                  <span className="demo-small-label">
                    A MORE PERSONAL EXPERIENCE
                  </span>
                  <h3>Unlock your Pro.</h3>
                  <p>Enter your code inside the Pro Plan.</p>
                  <div className="demo-code-field">Enter code...</div>
                  <div className="demo-code-button">
                    <Sparkles size={16} />
                    Redeem in Tilawatify
                  </div>
                  <span className="demo-code-note">
                    <ShieldCheck size={13} />
                    Only valid codes unlock Pro.
                  </span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="demo-step-dots">
            {redeemSteps.map((item, index) => (
              <button
                className={step === index ? "active" : ""}
                key={item.title}
                aria-label={`Show step ${index + 1}: ${item.title}`}
                onClick={() => setStep(index)}
              />
            ))}
          </div>
        </div>
        <span className="redeem-visual-caption">
          A SIMPLE WALKTHROUGH FOR TILAWATIFY PRO.
        </span>
      </Reveal>
    </section>
  );
}

export default function Pro() {
  const { isPro } = usePro();
  const [showProPlan, setShowProPlan] = useState(false);

  const openPlanSection = () => {
    setShowProPlan(true);
    window.setTimeout(() => {
      document
        .getElementById("pro-plan-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  return (
    <>
      <PageHeading
        eyebrow="INTRODUCING TILAWATIFY PRO"
        title={
          <>
            Tilawatify Pro.
            <br />
            <span className="gradient-text">A little more possibility.</span>
          </>
        }
        description="Your Quran journey, with more freedom. Take your recitations offline, make space for every playlist, and unlock full playback control."
      >
        <div className="pro-hero-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={openPlanSection}
          >
            <Crown size={17} />
            <span>{isPro ? "Manage Pro Status" : "View Pro Plan"}</span>
            <ArrowRight size={16} />
          </button>
          <a href="#comparison" className="text-link">
            Compare plans
            <ArrowDown size={16} />
          </a>
        </div>
      </PageHeading>

      <section className="comparison-section container" id="comparison">
        <Reveal className="comparison-table-wrap">
          <table className="comparison-table">
            <caption className="sr-only">
              Compare Tilawatify Free and Tilawatify Pro features
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="eyebrow">YOUR JOURNEY, YOUR CHOICE</span>
                  <h2>Meaningful at every level.</h2>
                  <p>Begin for free. Go further with Pro.</p>
                </th>
                <th scope="col">
                  <Logo />
                  <strong>Tilawatify Free</strong>
                  <span>A beautiful beginning.</span>
                </th>
                <th scope="col" className="pro-column">
                  <Crown size={27} strokeWidth={1.3} />
                  <strong>
                    Tilawatify <em>Pro</em>
                  </strong>
                  <span>500 per month &middot; Downloads included</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>
                    {typeof row.free === "boolean" ? (
                      row.free ? (
                        <Check size={20} aria-label="Included" />
                      ) : (
                        <Minus
                          size={18}
                          aria-label="Not included"
                          className="not-included"
                        />
                      )
                    ) : row.free === "Locked" ? (
                      <span className="locked-label">
                        <Lock size={12} />
                        Locked
                      </span>
                    ) : (
                      row.free
                    )}
                  </td>
                  <td className="pro-column">
                    {typeof row.pro === "boolean" ? (
                      <Check size={20} aria-label="Included" />
                    ) : (
                      <span className="unlimited-label">
                        {row.pro}
                        <Sparkles size={12} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td />
                <td>
                  <DownloadButton compact>Download App</DownloadButton>
                </td>
                <td className="pro-column">
                  <button
                    type="button"
                    onClick={openPlanSection}
                    className="button button-secondary"
                  >
                    {isPro ? "Pro Unlocked" : "Get Pro Plan"}
                    <ArrowRight size={15} />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </Reveal>

        <div className="pro-plan-toggle-area" id="pro-plan-panel">
          {!showProPlan ? (
            <Reveal className="pro-plan-collapsed">
              <div className="pro-plan-collapsed-copy">
                <Crown size={22} />
                <div>
                  <h3>
                    {isPro
                      ? "Your Tilawatify Pro membership is active."
                      : "Want offline audio downloads & unlocked seek controls?"}
                  </h3>
                  <p>
                    {isPro
                      ? "View your active Pro Plan perks anytime."
                      : "Open the Pro Plan to view monthly pricing and membership options."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="button button-primary button-compact"
                onClick={() => setShowProPlan(true)}
              >
                <Crown size={15} />
                <span>{isPro ? "View Pro Status" : "View / Get Pro Plan"}</span>
              </button>
            </Reveal>
          ) : (
            <motion.div
              className="pro-plan-expanded"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              <ProPlanCard />
            </motion.div>
          )}
        </div>
      </section>

      <RedeemGuide />
      <FAQ
        items={[
          {
            question: "Do I need Pro to listen to the Quran?",
            answer:
              "No. The free app gives you all 114 Surahs, our featured Qaris, favourites, and Hifz progress tracking. Pro (500 per month) adds audio downloads, unlocked audio seeking & rewinding, unlimited playlists, and an ad-free experience.",
          },
          {
            question: "How do I get Tilawatify Pro?",
            answer:
              "Click View Pro Plan above to view the 500 per month plan (with audio downloads included) or apply a valid code. You can also manage Pro inside Profile > Tilawatify Pro in the Android app.",
          },
          {
            question: "Why is seeking or rewinding locked on the free player?",
            answer:
              "Free listeners can stream and play or pause recitations freely. Manual scrubbing, jumping ahead, and rewinding back and forth are Pro features unlocked with Tilawatify Pro (500 per month).",
          },
          {
            question: "Can I download Surahs without Pro?",
            answer:
              "Offline Surah audio downloads are included with Tilawatify Pro. Free listeners can stream any of the 114 Surahs while connected to the internet.",
          },
        ]}
      />
      <FinalCTA />
    </>
  );
}
