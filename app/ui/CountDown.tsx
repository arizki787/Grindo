'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { incrementTask } from '../lib/actions';

export default function CountDownTimer({taskId}: { taskId: string | null}) {

  const [buttonStatus, setButtonStatus] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes
  const totalTime = 1500;

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
  }, [buttonStatus, taskId]);

  useEffect(() => {
    if (timeLeft === 0 && !buttonStatus && taskId) {
      incrementTask(taskId);
    }
  }, [timeLeft, buttonStatus, taskId]);

  const elapsed = totalTime - timeLeft;
  const progressPercent = (elapsed / totalTime) * 100;

  const minutes = String(Math.floor(timeLeft/60)).padStart(2, '0');
  const seconds = String(timeLeft%60).padStart(2, '0');
  return (
    <div className="flex flex-col items-center justify-center bg-dark-forest p-8 rounded-2xl shadow-xl border border-olive-green/30">
      <h1 className="text-4xl font-bold mb-6 text-foreground tracking-wide font-heading">Grindo</h1>
      <div className="flex gap-6 flex-col justify-center items-center">
        <div className="text-5xl text-foreground font-bold tracking-widest">{minutes}:{seconds}</div>
        <div className="w-64 h-3 bg-dark-espresso rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-warm-brown rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <button
          className={clsx(
            'px-8 py-3 rounded-xl font-bold text-foreground transition-all uppercase tracking-widest shadow-md',
            buttonStatus
              ? 'bg-warm-brown hover:bg-opacity-80'
              : 'bg-olive-green hover:bg-opacity-80'
          )}
          onClick={() => {
            if (timeLeft === 0) setTimeLeft(totalTime);
            setButtonStatus((prev) => !prev);
          }}
        >
          {buttonStatus ? 'PAUSE' : timeLeft === 0 ? 'RESTART' : 'START'}
        </button>
      </div>
    </div>
  );
}
