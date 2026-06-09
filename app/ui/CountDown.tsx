'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { BiLeaf, BiBed } from 'react-icons/bi';
import { FiRefreshCcw } from 'react-icons/fi';
import { IoPause, IoPlay } from 'react-icons/io5';

const FOCUS_TIME = 1500; // 25 minutes
const REST_TIME = 300; // 500 seconds

export default function CountDownTimer({taskId, onIncrement}: { taskId: string | null; onIncrement: (id: string) => void }) {

  const [mode, setMode] = useState<'focus' | 'rest'>('focus');
  const [buttonStatus, setButtonStatus] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const totalTime = mode === 'focus' ? FOCUS_TIME : REST_TIME;

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.MP3');
      audio.play().catch(err => console.error('Audio play error:', err));
    } catch (err) {
      console.error('Failed to play sound', err);
    }
  };

  useEffect(() => {
    if (!buttonStatus) return;

    const startTime = Date.now();
    const initialTimeLeft = timeLeft;
    const targetTime = startTime + initialTimeLeft * 1000;

    const countDownInterval = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.ceil((targetTime - now) / 1000));
      
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(countDownInterval);
        setButtonStatus(false);
      }
    }, 200);

    return () => clearInterval(countDownInterval);
  }, [buttonStatus, taskId]);

  useEffect(() => {
    if (timeLeft === 0 && !buttonStatus) {
      if (mode === 'focus') {
        if (taskId && onIncrement) {
          onIncrement(taskId);
        }
        playNotificationSound();
        setMode('rest');
        setTimeLeft(REST_TIME);
      } else {
        playNotificationSound();
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
      }
    }
  }, [timeLeft, buttonStatus, taskId, mode]);

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
          
          <button
            onClick={() => {
              const newMode = mode === 'focus' ? 'rest' : 'focus';
              setMode(newMode);
              setTimeLeft(newMode === 'focus' ? FOCUS_TIME : REST_TIME);
              setButtonStatus(false);
            }}
            className={clsx(
              'flex items-center gap-2 px-4 py-1.5 border rounded-full shadow-inner mb-2 transition-all cursor-pointer duration-300 outline-none select-none',
              mode === 'focus'  
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground/80'
                : 'bg-emerald-950/80 border-[#a3e635] text-white shadow-[0_0_15px_rgba(163,230,53,0.4)] scale-105'
            )}
          >
            {mode === 'focus' ? (
              <>
                <BiLeaf className="text-[#a3e635] w-4 h-4 animate-pulse" />
                <span className="text-xs font-semibold tracking-widest uppercase">Focus Time</span>
              </>
            ) : (
              <>
                <BiBed className="text-[#a3e635] w-4 h-4 animate-bounce" />
                <span className="text-xs font-semibold tracking-widest uppercase">Rest Mode</span>
              </>
            )}
          </button>

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
