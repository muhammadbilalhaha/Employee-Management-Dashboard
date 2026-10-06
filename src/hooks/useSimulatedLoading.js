import { useEffect, useState } from "react";

/**
 * Simulates a short loading period on mount, so the UI can display skeletons.
 * @param {number} delay - ms to stay loading
 */
export function useSimulatedLoading(delay = 500) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return loading;
}