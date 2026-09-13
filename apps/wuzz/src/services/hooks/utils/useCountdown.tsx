import { useState, useEffect } from 'react';

export function useCountdown(targetDate: string | Date) {
  // Use the targetDate directly in the initial state
  const [countdown, setCountdown] = useState(new Date(targetDate).getTime() - new Date().getTime());
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Reset countdown when targetDate changes
    const newCountdownDate = new Date(targetDate).getTime();
    setCountdown(newCountdownDate - new Date().getTime());
    setIsFinished(false); // Reset finished state when targetDate changes
  }, [targetDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = new Date(targetDate).getTime() - new Date().getTime();
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]); // Track changes in targetDate directly

  return { ...getReturnValues(countdown), isFinished };
}

function getReturnValues(countdown: number) {
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : `${time}`);

  return {
    days: formatTime(days),
    hours: formatTime(hours),
    minutes: formatTime(minutes),
    seconds: formatTime(seconds),
  };
}

export default useCountdown;
