import { useId, useState } from 'react';
import './FaqAccordion.css';

export interface FaqItem {
  question: string;
  answer: string;
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="faq-item" data-open={open}>
      <h3 style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit' }}>
        <button
          type="button"
          className="faq-question"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{item.question}</span>
          <span className="faq-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} className="faq-answer" role="region">
        <p className="faq-answer-inner">{item.answer}</p>
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="faq-list">
      {items.map((item) => (
        <FaqRow key={item.question} item={item} />
      ))}
    </div>
  );
}
