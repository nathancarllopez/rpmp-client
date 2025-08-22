import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export default function useCountdown(duration: number, navigateTo: string) {
  const [remaining, setRemaining] = useState(duration);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (remaining === 0) {
      navigate({ to: navigateTo });
    }
  }, [remaining, navigate, navigateTo]);

  return remaining;
}
