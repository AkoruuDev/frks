import { useState, useEffect, useRef } from "react";

function useFocusTimer(onFocusComplete: () => void) {
    const [timer, setTimer] = useState({
        timeLeft: 25 * 60, // 25 minutes in seconds
        isRunning: false,
        mode: "focus", // "focus" or "break"
    });

    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (timer.isRunning && timer.timeLeft > 0) {
        timerRef.current = window.setInterval(() => {
            setTimer((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
        }, 1000);
        } else if (timer.timeLeft === 0) {
        if (timerRef.current) clearInterval(timerRef.current);

        setTimer((prev) => ({ ...prev, isRunning: false }));

        if (timer.mode === "FOCUS") {
            onFocusComplete();
            setTimer({ timeLeft: 5 * 60, isRunning: false, mode: "BREAK" });
        } else {
            setTimer({ timeLeft: 25 * 60, isRunning: false, mode: "FOCUS" });
        }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer]);

  return { timer, setTimer };
};

export default useFocusTimer;