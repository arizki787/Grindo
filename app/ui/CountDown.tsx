'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { incrementTask } from '../lib/actions';
import { BiLeaf } from 'react-icons/bi';
import { FiRefreshCcw } from 'react-icons/fi';
import { IoPause, IoPlay } from 'react-icons/io5';

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
  const progressPercent = elapsed / totalTime;
  
  // Circle Math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressPercent * circumference;

  const minutes = String(Math.floor(timeLeft/60)).padStart(2, '0');
  const seconds = String(timeLeft%60).padStart(2, '0');

  // Handle circular handle position
  const angle = progressPercent * 360 - 90; // -90 to start at top
  const handleX = 100 + radius * Math.cos((angle * Math.PI) / 180);
  const handleY = 100 + radius * Math.sin((angle * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center justify-center bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 rounded-[2rem] w-full max-w-3xl mb-8 relative z-10">
      
      <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        {/* Circular SVG */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full drop-shadow-lg overflow-visible">
          {/* Track */}
          <circle 
            cx="100" cy="100" r={radius} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="6" 
            className="text-olive-green/20"
            strokeDasharray="4 6" // Dashed track look
          />
          {/* Progress */}
          <circle 
            cx="100" cy="100" r={radius} 
            fill="none" 
            stroke="#a3e635" // lime-400
            strokeWidth="8" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            transform="rotate(-90 100 100)"
            className="transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]"
          />
          {/* Handle */}
          <circle
            cx={handleX} cy={handleY} r="6"
            fill="#a3e635"
            className="transition-all duration-1000 ease-linear shadow-lg"
          />
        </svg>

        {/* Inner Content */}
        <div className="relative flex flex-col items-center justify-center z-10 h-full gap-2">
          
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full shadow-inner mb-2">
            <BiLeaf className="text-[#a3e635] w-4 h-4" />
            <span className="text-xs font-semibold text-foreground/80 tracking-widest uppercase">Focus Time</span>
          </div>

          <div className="text-7xl text-foreground font-bold tracking-widest font-sans drop-shadow-md my-2 tabular-nums">
            {minutes}:{seconds}
          </div>

          <button
            className={clsx(
              'mt-2 px-6 py-2 rounded-full font-bold text-foreground transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.2)] border',
              buttonStatus
                ? 'bg-warm-brown/80 border-warm-brown hover:bg-warm-brown'
                : 'bg-olive-green/80 border-olive-green hover:bg-olive-green'
            )}
            onClick={() => {
              if (timeLeft === 0) setTimeLeft(totalTime);
              setButtonStatus((prev) => !prev);
            }}
          >
            {buttonStatus ? <IoPause className="w-5 h-5"/> : <IoPlay className="w-5 h-5"/>}
            <span className="tracking-widest uppercase text-sm">{buttonStatus ? 'Pause' : timeLeft === 0 ? 'Restart' : 'Start'}</span>
          </button>

        </div>
      </div>

      <button 
        onClick={() => { setTimeLeft(totalTime); setButtonStatus(false); }}
        className="mt-8 flex items-center gap-2 text-foreground/60 hover:text-[#a3e635] transition-colors"
      >
        <FiRefreshCcw />
        <span className="text-sm font-semibold tracking-widest uppercase">Reset</span>
      </button>

    </div>
  );
}
