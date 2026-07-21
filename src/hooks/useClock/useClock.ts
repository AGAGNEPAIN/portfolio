import { useEffect, useState } from "preact/hooks";

function formatTime(timeZone: string, date: Date): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  } catch {
    return "--:--:--";
  }
}

/** Live wall-clock time for `timeZone`, ticking every second. */
export function useClock(timeZone: string): string {
  const [time, setTime] = useState(() => formatTime(timeZone, new Date()));

  useEffect(() => {
    const tick = () => setTime(formatTime(timeZone, new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}
