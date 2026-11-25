import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal, SectionHeading } from "./Shared";

export function FAQ({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq-section container">
      <SectionHeading
        eyebrow="GOOD TO KNOW"
        title="A little clarity."
        description="A few answers before you begin."
      />
      <div className="faq-list">
        {items.map((item, index) => (
          <Reveal
            key={item.question}
            delay={index * 0.04}
            className={`faq-item ${open === index ? "is-open" : ""}`}
          >
            <h3>
              <button
                onClick={() => setOpen(open === index ? null : index)}
                aria-expanded={open === index}
                aria-controls={`faq-answer-${index}`}
              >
                {item.question}
                <Plus size={20} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open === index && (
                <motion.div
                  id={`faq-answer-${index}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
