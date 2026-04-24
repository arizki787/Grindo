'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function CountDownTimer() {
  const [buttonStatus, setButtonStatus] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (!buttonStatus) return;

    const countDownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countDownInterval);
          setButtonStatus(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countDownInterval);
  }, [buttonStatus]);
  const minutes = String(Math.floor(timeLeft/60)).padStart(2, '0');
  const seconds = String(timeLeft%60).padStart(2, '0');
  return (
    <div className="flex flex-col items-center justify-center bg-sky-400 p-4 rounded-md">
      <h1 className="text-3xl font-bold mb-4 text-white">Grindo</h1>
      <div className="flex mb-6 gap-4 flex-col justify-center items-center">
        <div className="text-3xl text-white font-bold">{minutes}:{seconds}</div>
        <button
          className={clsx(
            buttonStatus
              ? 'bg-sky-600 p-2 rounded-md font-bold text-white'
              : 'bg-blue-200 p-2 rounded-md font-bold text-white'
          )}
          onClick={() => setButtonStatus((prev) => !prev)}
        >
          {buttonStatus ? 'PAUSE' : 'START'}
        </button>
      </div>
    </div>
  );
}