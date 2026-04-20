import React, { useState, useEffect } from 'react';

export default function AcademyDashboard() {
  const [counters, setCounters] = useState({ graduates: 0, employers: 0, programmes: 0, placement: 0, uplift: 0, countries: 0 });
  const [isPinging, setIsPinging] = useState(false);
  const [lastPing, setLastPing] = useState<string | null>(null);
  const [feed, setFeed] = useState([
    { init: 'TN', color: '#00f2ff', name: 'Thembi N.', action: 'passed AWS Solutions Architect', time: '2m ago' },
    { init: 'KM', color: '#4fc3f7', name: 'Kwame M.', action: 'enrolled in AI/ML Engineering', time: '4m ago' },
    { init: 'NS', color: '#56cfac', name: 'Nomsa S.', action: 'completed Cohort 11 capstone', time: '8m ago' },
    { init: 'BD', color: '#a78bfa', name: 'Bongani D.', action: 'received job offer at Standard Bank', time: '12m ago' },
    { init: 'FO', color: '#f4664a', name: 'Fatima O.', action: 'started DevSecOps micro-credential', time: '18m ago' },
  ]);

  useEffect(() => {
    const targets = { graduates: 1247, employers: 48, programmes: 12, placement: 94, uplift: 62, countries: 7 };
    const dur = 1400;
    const step = 16;
    const timers: any[] = [];

    Object.entries(targets).forEach(([key, target]) => {
      const inc = target / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, target);
        setCounters(prev => ({ ...prev, [key]: Math.floor(cur) }));
        if (cur >= target) clearInterval(timer);
      }, step);
      timers.push(timer);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  useEffect(() => {
    const moreFeed = [
      { init: 'LD', color: '#00f2ff', name: 'Lungelo D.', action: 'achieved Azure Expert cert', time: 'now' },
      { init: 'PE', color: '#56cfac', name: 'Priya E.', action: 'hired at Google Africa', time: '1m ago' },
      { init: 'AB', color: '#4fc3f7', name: 'Amara B.', action: 'enrolled in Cloud Launchpad', time: '3m ago' },
    ];
    let feedIdx = 0;
    const interval = setInterval(() => {
      setFeed(prev => {
        const next = [...prev];
        const newItem = moreFeed[feedIdx % moreFeed.length];
        next.unshift(newItem);
        next.pop();
        feedIdx++;
        const times = ['just now', '1m ago', '3m ago', '6m ago', '10m ago'];
        return next.map((f, i) => ({ ...f, time: times[i] || `${i * 3}m ago` }));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualPing = async () => {
    setIsPinging(true);
    try {
      const response = await fetch('/api/ping-supabase', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setLastPing(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Manual ping failed:', err);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="bg-card border border-border-custom rounded-lg overflow-hidden relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[linear-gradient(90deg,transparent,var(--color-brand),transparent)] before:opacity-50">
      <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
        <span className="font-dm-mono text-[10px] tracking-[0.15em] uppercase text-text-soft">Academy Live Dashboard</span>
        <span className="flex items-center gap-1.25 font-dm-mono text-[9px] text-[#22c55e] tracking-[0.08em]"><span className="pulse"></span> Live</span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-px bg-border-custom rounded-sm overflow-hidden mb-5">
          <div className="bg-card2 px-4 py-4.5 text-center">
            <span className="font-syne font-extrabold text-[26px] tracking-[-0.03em] text-brand block leading-none">{counters.graduates}</span>
            <span className="font-dm-mono text-[8px] tracking-[0.15em] uppercase text-text-dim mt-1.5 block">Graduates</span>
          </div>
          <div className="bg-card2 px-4 py-4.5 text-center">
            <span className="font-syne font-extrabold text-[26px] tracking-[-0.03em] text-brand block leading-none">{counters.employers}</span>
            <span className="font-dm-mono text-[8px] tracking-[0.15em] uppercase text-text-dim mt-1.5 block">Employers</span>
          </div>
          <div className="bg-card2 px-4 py-4.5 text-center">
            <span className="font-syne font-extrabold text-[26px] tracking-[-0.03em] text-brand block leading-none">{counters.programmes}</span>
            <span className="font-dm-mono text-[8px] tracking-[0.15em] uppercase text-text-dim mt-1.5 block">Programmes</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {feed.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-3.5 py-2.75 bg-white/2 border border-border-custom rounded-sm transition-colors animate-feedIn">
              <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-syne font-extrabold text-[11px] text-[#080b12] shrink-0" style={{ background: f.color }}>{f.init}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium whitespace-nowrap overflow-hidden text-overflow-ellipsis">{f.name}</div>
                <div className="font-dm-mono text-[9px] text-text-muted tracking-[0.05em]">{f.action}</div>
              </div>
              <div className="font-dm-mono text-[8px] text-text-dim shrink-0">{f.time}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border-custom">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald animate-pulse"></div>
              <span className="font-dm-mono text-[10px] tracking-[0.1em] text-text-muted uppercase">Supabase Keep-Alive Heartbeat</span>
            </div>
            <button 
              onClick={handleManualPing}
              disabled={isPinging}
              className={`font-dm-mono text-[9px] px-2.5 py-1 rounded border border-brand/30 text-brand hover:bg-brand/10 transition-all ${isPinging ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPinging ? 'Pinging...' : 'Manual Ping'}
            </button>
          </div>
          <p className="text-[10px] text-text-dim leading-relaxed mb-2">
            Proactive measure: The server automatically pings your database every 24 hours to prevent account suspension due to inactivity.
          </p>
          {lastPing && (
            <div className="font-dm-mono text-[8px] text-emerald/70">
              Last manual ping successful at {lastPing}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
