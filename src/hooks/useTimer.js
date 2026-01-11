// Timer Hook
// For quiz time limit functionality

import { useState, useEffect, useRef } from 'react';

/**
 * Timer hook for quiz time limits
 * Counts down from initial time and calls onExpire when finished
 *
 * @param {number} initialTime - Initial time in seconds
 * @param {function} onExpire - Callback when timer expires
 * @returns {object} - { timeRemaining, isRunning, start, pause, resume, reset }
 */
const useTimer = (initialTime, onExpire) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Countdown logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onExpire) {
              onExpire();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onExpire]);

  // Control functions
  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);
  const reset = () => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
  };

  return {
    timeRemaining,
    isRunning,
    start,
    pause,
    resume,
    reset,
  };
};

export default useTimer;
