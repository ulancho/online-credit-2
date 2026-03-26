import styles from './TermsCheckbox.module.css';

import type { ReactNode } from 'react';

interface TermsCheckboxProps {
  checked: boolean;
  text: string;
  onChange: (checked: boolean) => void;
  onTapLink?: () => void;
}

const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]*)\)/g;
const normalizeMarkdownLinks = (value: string) =>
  value.replace(MARKDOWN_LINK_PATTERN, '[$1](link)');

const renderMarkdown = (value: string, onTapLink?: () => void): ReactNode[] => {
  const normalizedValue = normalizeMarkdownLinks(value);
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  normalizedValue.replaceAll(
    MARKDOWN_LINK_PATTERN,
    (match, linkText: string, _href: string, offset: number) => {
      if (offset > lastIndex) {
        nodes.push(normalizedValue.slice(lastIndex, offset));
      }

      nodes.push(
        <a
          key={`${linkText}-${offset}`}
          className={styles.termLink}
          href="link"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onTapLink?.();
          }}
        >
          {linkText}
        </a>,
      );

      lastIndex = offset + match.length;
      return match;
    },
  );

  if (lastIndex < normalizedValue.length) {
    nodes.push(normalizedValue.slice(lastIndex));
  }

  return nodes;
};

export default function TermsCheckbox({ checked, text, onChange, onTapLink }: TermsCheckboxProps) {
  const handleToggle = () => onChange(!checked);

  if (!text) return null;

  return (
    <label className={styles.termRow} onClick={handleToggle}>
      <div className={styles.checkboxWrapper}>
        <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
          {checked && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path
                d="M1 4L4.5 7.5L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className={styles.termText}>{renderMarkdown(text, onTapLink)}</span>
    </label>
  );
}
