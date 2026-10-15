import { useEffect, useState } from "react";

/** Simulated live sensor value that drifts around a base every few seconds. */
export function useLive(base: number, spread: number, active = true, ms = 2500) {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (!active) { setV(0); return; }
    setV(base);
    const t = setInterval(() => setV(+(base + (Math.random() - 0.5) * spread).toFixed(2)), ms);
    return () => clearInterval(t);
  }, [base, spread, active, ms]);
  return v;
}
