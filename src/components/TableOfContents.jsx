import React from 'react';
import Slugger from 'github-slugger';
import { useActiveHeading } from '@/hooks/useActiveHeading';
import { cn } from '@/lib/utils';

export default function TableOfContents({ headings }) {
  if (!headings || headings.length === 0) {
    return null;
  }

  const slugger = new Slugger();
  const headingIds = headings.map(h => slugger.slug(h.text));
  const activeId = useActiveHeading(headingIds);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">On this page</h3>
      <ul className="space-y-2 border-l-2 border-[var(--border)]">
        {headings.map((heading, index) => {
          const slug = headingIds[index];
          const isActive = activeId === slug;
          return (
            <li key={heading.text}>
              <a
                href={`#${slug}`}
                className={cn(
                  "block border-l-2 -ml-px py-1 text-sm transition-colors duration-200",
                  isActive 
                    ? "border-[var(--primary)] text-[var(--primary)] font-medium" 
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
                style={{ paddingLeft: `${(heading.level - 1) * 1 + 1}rem` }}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}