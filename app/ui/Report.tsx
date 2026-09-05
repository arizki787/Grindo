'use client';

import type { CSSProperties } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { BiBarChartAlt2, BiTimeFive, BiCalendarWeek, BiPlayCircle } from 'react-icons/bi';
import { FaGoogle } from 'react-icons/fa';
import { createClient } from '@/utils/supabase/client';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { DailyReport } from '../lib/definition';

const chartConfig = {
  minutes: {
    label: 'Focus minutes',
    color: '#a3e635',
  },
} satisfies ChartConfig;

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function dayLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  });
}

export default function Report({
  data,
  isLoggedIn,
}: {
  data?: DailyReport[];
  isLoggedIn: boolean;
}) {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex w-full max-w-3xl flex-col items-center justify-center bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 rounded-4xl relative z-10 text-center gap-6">
        <BiBarChartAlt2 className="w-12 h-12 text-[#a3e635]/60" />
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-heading tracking-wide text-foreground">
            Sign in to view your report
          </h2>
          <p className="text-foreground/60 text-sm max-w-sm mx-auto">
            Track your focus sessions and see how your week adds up once you&apos;re logged in.
          </p>
        </div>
        <button
          onClick={handleSignIn}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3F5426]/20 border border-[#3F5426]/40 text-[#fdfbf7] hover:bg-[#3F5426]/40 hover:border-[#3F5426]/60 hover:shadow-[0_0_15px_rgba(63,84,38,0.4)] transition-all font-semibold shadow-md active:scale-[0.98] cursor-pointer text-sm"
        >
          <FaGoogle className="w-4 h-4 text-[#a3e635]" />
          <span>Sign in with Google</span>
        </button>
      </div>
    );
  }

  const report = data ?? [];
  const today = report[report.length - 1];
  const weekSeconds = report.reduce((sum, d) => sum + d.total_seconds, 0);
  const weekSessions = report.reduce((sum, d) => sum + d.sessions, 0);

  const chartData = report.map((d) => ({
    day: dayLabel(d.day),
    minutes: Math.round(d.total_seconds / 60),
    total_seconds: d.total_seconds,
    sessions: d.sessions,
  }));

  const summaries = [
    {
      label: "Today's focus",
      value: formatDuration(today?.total_seconds ?? 0),
      icon: BiTimeFive,
    },
    {
      label: "This week's total",
      value: formatDuration(weekSeconds),
      icon: BiCalendarWeek,
    },
    {
      label: 'Sessions this week',
      value: String(weekSessions),
      icon: BiPlayCircle,
    },
  ];

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6 relative z-10">
      <div className="flex items-center gap-2 px-2">
        <BiBarChartAlt2 className="w-6 h-6 text-[#a3e635]" />
        <h2 className="text-stone-50 text-lg font-bold tracking-[0.3em] font-heading uppercase">
          Report
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaries.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] rounded-2xl p-5 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-foreground/60 text-xs font-semibold tracking-widest uppercase">
              <Icon className="w-4 h-4 text-[#a3e635]" />
              {label}
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-4xl p-6 sm:p-8">
        <p className="text-foreground/60 text-xs font-semibold tracking-widest uppercase mb-6">
          Last 7 days
        </p>
        <div className='h-60 w-full'>
          <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
            <BarChart accessibilityLayer data={chartData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'rgba(253,251,247,0.6)', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={36}
                tick={{ fill: 'rgba(253,251,247,0.5)', fontSize: 11 }}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(163,230,53,0.08)' }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                          style={
                            {
                              '--color-bg': 'var(--color-minutes)',
                            } as CSSProperties
                          }
                        />
                        <div className="flex flex-1 justify-between leading-none items-center gap-4">
                          <span className="text-muted-foreground">Focus</span>
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {value} min
                          </span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Bar
                dataKey="minutes"
                fill="var(--color-minutes)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
