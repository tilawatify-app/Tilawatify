import {
  createContext,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence } from "motion/react";
import {
  Check,
  Crown,
  Download,
  Headphones,
  ListMusic,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
} from "lucide-react";
import { useStoredState } from "../hooks";
import { DownloadButton, Modal } from "./Shared";

const BASE_MONTHLY_PRICE = 500;
const DISCOUNT_PERCENT = 10;
const DISCOUNTED_MONTHLY_PRICE = Math.round(
  BASE_MONTHLY_PRICE * (1 - DISCOUNT_PERCENT / 100),
);

type RedeemResult = {
  status: "pro" | "discount" | "invalid";
  message: string;
};

type ProContextValue = {
  isPro: boolean;
  discountApplied: boolean;
  proModalOpen: boolean;
  openProModal: () => void;
  closeProModal: () => void;
  applyRedeemCode: (rawCode: string) => RedeemResult;
};

const ProContext = createContext<ProContextValue | null>(null);

export function usePro() {
  const context = useContext(ProContext);
  if (!context) {
    throw new Error("usePro must be used within ProProvider");
  }
  return context;
}

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useStoredState<boolean>(
    "tilawatify-pro-unlocked",
    false,
  );
  const [discountApplied, setDiscountApplied] = useStoredState<boolean>(
    "tilawatify-pro-discount",
    false,
  );
  const [proModalOpen, setProModalOpen] = useState(false);

  const applyRedeemCode = (rawCode: string): RedeemResult => {
    const normalized = rawCode.trim();
    if (!normalized) {
      return {
        status: "invalid",
        message: "Please enter a code first.",
      };
    }

    if (normalized.toUpperCase() === "TILAWATIFYPRO0") {
      setIsPro(true);
      return {
        status: "pro",
        message:
          "Tilawatify Pro unlocked! Audio downloads and full seek & rewind controls are now active.",
      };
    }

    if (normalized.toUpperCase() === "TILAWATIFY10") {
      setDiscountApplied(true);
      return {
        status: "discount",
        message: `10% off applied! Your Pro Plan is now ${DISCOUNTED_MONTHLY_PRICE} per month.`,
      };
    }

    return {
      status: "invalid",
      message: "Invalid code. Please check your code and try again.",
    };
  };

  return (
    <ProContext.Provider
      value={{
        isPro,
        discountApplied,
        proModalOpen,
        openProModal: () => setProModalOpen(true),
        closeProModal: () => setProModalOpen(false),
        applyRedeemCode,
      }}
    >
      {children}
      <AnimatePresence>
        {proModalOpen && (
          <Modal
            onClose={() => setProModalOpen(false)}
            labelledBy="pro-plan-modal-title"
          >
            <ProPlanCard headingId="pro-plan-modal-title" compact />
          </Modal>
        )}
      </AnimatePresence>
    </ProContext.Provider>
  );
}

export function ProPlanCard({
  headingId,
  compact = false,
}: {
  headingId?: string;
  compact?: boolean;
}) {
  const { isPro, discountApplied, applyRedeemCode } = usePro();
  const [codeInput, setCodeInput] = useState("");
  const [feedback, setFeedback] = useState<RedeemResult | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = applyRedeemCode(codeInput);
    setFeedback(result);
    if (result.status !== "invalid") {
      setCodeInput("");
    }
  };

  return (
    <div className={`pro-plan-card ${compact ? "is-modal" : ""}`}>
      <div className="pro-plan-header">
        <div className="pro-plan-icon">
          <Crown size={24} strokeWidth={1.5} />
        </div>
        <div>
          <span className="eyebrow">
            <span />
            TILAWATIFY PRO PLAN
          </span>
          <h3 id={headingId}>
            Tilawatify <em>Pro</em>
          </h3>
        </div>
        {isPro && (
          <span className="pro-active-badge" role="status">
            <Sparkles size={13} />
            Pro Active
          </span>
        )}
      </div>

      <div className="pro-price-block">
        {discountApplied && !isPro ? (
          <div className="pro-price-row">
            <span className="pro-price-original">
              {BASE_MONTHLY_PRICE} per month
            </span>
            <strong className="pro-price-amount">
              {DISCOUNTED_MONTHLY_PRICE} <span>per month</span>
            </strong>
            <span className="pro-discount-pill">10% off applied</span>
          </div>
        ) : (
          <div className="pro-price-row">
            <strong className="pro-price-amount">
              {BASE_MONTHLY_PRICE} <span>per month</span>
            </strong>
          </div>
        )}
        <p className="pro-price-sub">
          <Download size={14} />
          Audio downloads included
        </p>
        <p className="pro-or-redeem">or redeem code</p>
      </div>

      <ul className="pro-plan-perks">
        <li>
          <Check size={15} />
          <span>Audio downloads included for offline listening</span>
        </li>
        <li>
          <Headphones size={15} />
          <span>Full audio seek, scrub &amp; rewind unlocked</span>
        </li>
        <li>
          <ListMusic size={15} />
          <span>Unlimited custom Quran playlists</span>
        </li>
        <li>
          <ShieldCheck size={15} />
          <span>Ad-free, distraction-free experience</span>
        </li>
      </ul>

      {isPro ? (
        <div className="pro-unlocked-panel" role="status">
          <div className="pro-unlocked-title">
            <Sparkles size={16} />
            <strong>Your Tilawatify Pro membership is active.</strong>
          </div>
          <p>
            Manual audio seeking, scrubbing, and rewinding are now unlocked
            across the player, and offline audio downloads are included in the
            app.
          </p>
          <DownloadButton compact>Download Tilawatify App</DownloadButton>
        </div>
      ) : (
        <div className="pro-redeem-box">
          <div className="pro-promo-callout">
            <Tag size={14} />
            <span>
              redeem code for 10 percent off:{" "}
              <button
                type="button"
                className="promo-code-chip"
                onClick={() => setCodeInput("Tilawatify10")}
                title="Fill Tilawatify10"
              >
                Tilawatify10
              </button>
            </span>
          </div>

          <form className="pro-redeem-form" onSubmit={handleSubmit}>
            <div className="pro-redeem-input-wrap">
              <Ticket size={15} aria-hidden="true" />
              <input
                type="text"
                value={codeInput}
                onChange={(event) => {
                  setCodeInput(event.target.value);
                  if (feedback) setFeedback(null);
                }}
                placeholder="Enter code..."
                aria-label="Redeem code"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button type="submit" className="button button-primary button-compact">
              Apply Code
            </button>
          </form>

          {feedback && (
            <p
              className={`pro-redeem-feedback is-${feedback.status}`}
              role="status"
            >
              {feedback.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
