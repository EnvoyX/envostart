import { VisualEditing } from '@sanity/visual-editing/react';
import { useEffect, useState } from 'react';

export function SanityVisualEditing() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowButton(window === window.parent && !window.opener);
  }, []);

  return (
    <>
      <VisualEditing portal={true} />
      {showButton && (
        <a
          href="/api/draft-mode/disable"
          className="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg hover:bg-neutral-800 transition"
        >
          Disable Preview Mode
        </a>
      )}
    </>
  );
}
