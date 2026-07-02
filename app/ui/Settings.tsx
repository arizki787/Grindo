'use client';

import { FormEvent, useState } from "react";
import { BiSave, BiTimeFive, BiCoffee } from 'react-icons/bi';

interface SettingsFormProps{
    focusTime: number;
    breakTime: number;
    onSave: (newFocus: number, newBreak: number) => void;
}

export default function SettingsForm({ focusTime, breakTime, onSave }: SettingsFormProps) {

    const [localFocus, setLocalFocus] = useState(focusTime);
    const [localBreak, setLocalBreak] = useState(breakTime);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(localFocus, localBreak);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="flex w-full max-w-3xl flex-col bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 rounded-4xl relative z-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-8 px-2">
                <h2 className="text-stone-50 text-lg font-bold tracking-[0.3em] font-heading uppercase">Settings</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* focus duration */}
                <div className="flex flex-col gap-3">
                    <label className="text-stone-200 text-sm font-semibold tracking-wide flex-items-center gap-2">
                        <BiTimeFive className="w-5 h-5 text-[#a3e635]"/>
                        Focus Time (minutes)
                    </label>
                    <div className="flex items-center gap-6">
                        <input
                            type="range"
                            min="1"
                            max="60"
                            value={localFocus}
                            onChange={(e) => setLocalFocus(Number(e.target.value))}
                            className="flex-1 accent-[#a3e635] bg-black/40 h-2 rounded-lg cursor-pointer"
                        />
                        <span className="text-stone-50 font-mono font-bold text-xl min-w-12">
                            {localFocus}m
                        </span>
                    </div>
                </div>
                {/* break duration */}
                <div className="flex flex-col gap-3">
                    <label className="text-stone-200 text-sm font-semibold tracking-wide flex-items-center gap-2">
                        <BiCoffee className="w-5 h-5 text-[#a3e635]"/>
                        Break Time (minutes)
                    </label>
                    <div className="flex items-center gap-6">
                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={localFocus}
                            onChange={(e) => setLocalFocus(Number(e.target.value))}
                            className="flex-1 accent-[#a3e635] bg-black/40 h-2 rounded-lg cursor-pointer"
                        />
                        <span className="text-stone-50 font-mono font-bold text-xl min-w-12">
                            {localBreak}m
                        </span>
                    </div>
                </div>
                {/* form actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    {saved ? (
                        <span className="text-[#a3e635] text-sm font-semibold animate-pulse">
                            Settings saved successfully!
                        </span>
                    ) : (
                        <span className="text-stone-400 text-xs">
                            Changes will apply to your next focus session.
                        </span>
                    )}
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-[#a3e635] px-6 py-2.5 text-sm font-bold text-dark-espresso hover:bg-opacity-90 transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                        <BiSave className="w-5 h-5" />
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    )
}

