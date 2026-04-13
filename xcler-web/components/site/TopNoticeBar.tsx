"use client";

import { useEffect, useState } from "react";

const storageKey = "xcler_notice_dismissed";

export default function TopNoticeBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(storageKey);
    setVisible(!dismissed);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="noticeBar" role="status">
      <span>Based in Pakistan · Serving Germany &amp; worldwide</span>
      <button
        type="button"
        onClick={() => {
          window.localStorage.setItem(storageKey, "true");
          setVisible(false);
        }}
        aria-label="Dismiss location notice"
      >
        ×
      </button>
    </div>
  );
}
