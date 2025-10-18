import { useState, useEffect } from 'react';

export function useActiveHeading(headingIds, topOffset = 150) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headingIds.length === 0) return;

    const handleScroll = () => {
      let currentActiveId = '';
      for (const id of headingIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= topOffset) {
            currentActiveId = id;
          }
        }
      }
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headingIds, topOffset]);

  return activeId;
}