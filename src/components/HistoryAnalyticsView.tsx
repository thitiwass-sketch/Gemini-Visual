import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Tag,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Filter,
  Layers,
  Sparkles,
  Clock,
  Activity,
  Award
} from 'lucide-react';
import { GenerationRecord } from '../lib/firebase';

interface HistoryAnalyticsViewProps {
  history: GenerationRecord[];
  language: 'th' | 'en';
  onFilterByMode?: (mode: string) => void;
  onFilterByTag?: (tag: string) => void;
  onBackToList: () => void;
}

const MODE_COLORS: Record<string, string> = {
  'cinematic-realistic': '#f59e0b', // amber-500
  'cad-wireframe': '#38bdf8',       // sky-400
  'schematic-drawing': '#34d399',   // emerald-400
  'chalkboard-diagram': '#a78bfa',  // purple-400
  'exploded-assembly': '#fb7185',   // rose-400
  'patent-illustration': '#fbbf24', // amber-400
  'isometric-render': '#2dd4bf',    // teal-400
  'macro-detail': '#818cf8',        // indigo-400
  'academic-figure': '#60a5fa',     // blue-400
};

const PALETTE = [
  '#f59e0b', '#38bdf8', '#34d399', '#a78bfa',
  '#fb7185', '#2dd4bf', '#fbbf24', '#818cf8',
  '#60a5fa', '#f97316'
];

export const HistoryAnalyticsView: React.FC<HistoryAnalyticsViewProps> = ({
  history,
  language,
  onFilterByMode,
  onFilterByTag,
  onBackToList,
}) => {
  const isThai = language === 'th';
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Filter records based on selected timeRange
  const scopedRecords = useMemo(() => {
    const now = Date.now();
    return history.filter((item) => {
      const timestamp = new Date(item.createdAt).getTime();
      if (isNaN(timestamp)) return false;
      const diffDays = (now - timestamp) / (1000 * 60 * 60 * 24);

      if (timeRange === '7d') return diffDays <= 7;
      if (timeRange === '30d') return diffDays <= 30;
      if (timeRange === '90d') return diffDays <= 90;
      return true; // 'all'
    });
  }, [history, timeRange]);

  // Total summary metrics
  const totalCount = scopedRecords.length;
  const favoriteCount = scopedRecords.filter((r) => r.isFavorite).length;
  const passCount = scopedRecords.filter((r) => r.qaStatus === 'PASS').length;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  // 1. Daily Activity Trend over the selected period
  const dailyActivityData = useMemo(() => {
    const daysToShow = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
    const now = new Date();
    const dateMap: Record<string, { date: string; displayDate: string; count: number; favorites: number }> = {};

    // Initialize all days in ascending chronological order
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const isoKey = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString(isThai ? 'th-TH' : 'en-US', {
        month: 'short',
        day: 'numeric',
      });
      dateMap[isoKey] = {
        date: isoKey,
        displayDate,
        count: 0,
        favorites: 0,
      };
    }

    // Populate counts
    scopedRecords.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      if (!isNaN(itemDate.getTime())) {
        const isoKey = itemDate.toISOString().split('T')[0];
        if (dateMap[isoKey]) {
          dateMap[isoKey].count += 1;
          if (item.isFavorite) {
            dateMap[isoKey].favorites += 1;
          }
        }
      }
    });

    return Object.values(dateMap);
  }, [scopedRecords, timeRange, isThai]);

  // 2. Modes usage breakdown
  const modeData = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedRecords.forEach((r) => {
      const mode = r.mode || 'default';
      counts[mode] = (counts[mode] || 0) + 1;
    });

    const entries = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      color: MODE_COLORS[name] || '#94a3b8',
    }));

    return entries.sort((a, b) => b.count - a.count);
  }, [scopedRecords, totalCount]);

  // Top mode
  const topMode = modeData[0] || null;

  // 3. Tags usage breakdown
  const tagData = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedRecords.forEach((r) => {
      if (r.tags && Array.isArray(r.tags)) {
        r.tags.forEach((rawTag) => {
          const clean = rawTag.trim().replace(/^#/, '');
          if (clean) {
            counts[clean] = (counts[clean] || 0) + 1;
          }
        });
      }
    });

    const entries = Object.entries(counts).map(([name, count], index) => ({
      name: `#${name}`,
      rawName: name,
      count,
      color: PALETTE[index % PALETTE.length],
    }));

    return entries.sort((a, b) => b.count - a.count).slice(0, 10);
  }, [scopedRecords]);

  // Top tag
  const topTag = tagData[0] || null;

  // 4. QA Status Distribution
  const qaData = useMemo(() => {
    let pass = 0;
    let warn = 0;
    let fail = 0;

    scopedRecords.forEach((r) => {
      const status = (r.qaStatus || 'PASS').toUpperCase();
      if (status === 'PASS') pass++;
      else if (status === 'WARN' || status === 'WARNING') warn++;
      else fail++;
    });

    return [
      { name: isThai ? 'ผ่านการตรวจสอบ (PASS)' : 'Passed (PASS)', value: pass, color: '#10b981' },
      { name: isThai ? 'เตือน/ข้อสังเกต (WARN)' : 'Warning (WARN)', value: warn, color: '#f59e0b' },
      ...(fail > 0 ? [{ name: isThai ? 'ไม่ผ่าน (FAIL)' : 'Failed (FAIL)', value: fail, color: '#f43f5e' }] : []),
    ].filter((d) => d.value > 0);
  }, [scopedRecords, isThai]);

  // 5. Aspect Ratio Distribution
  const ratioData = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedRecords.forEach((r) => {
      const ratio = r.aspectRatio || '16:9';
      counts[ratio] = (counts[ratio] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [scopedRecords]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950 text-slate-100">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToList}
            aria-label={isThai ? 'กลับไปยังรายการประวัติ' : 'Back to history list'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <div>
            <h3 className="text-fluid-h3 font-display font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>{isThai ? 'การวิเคราะห์แนวโน้มกิจกรรม (Activity Trends)' : 'Activity Trends & Analytics'}</span>
            </h3>
            <p className="text-xs text-slate-300">
              {isThai
                ? 'สถิติการสร้างภาพ โหมดที่ใช้งานบ่อยที่สุด และแท็กวิจัยสำคัญ'
                : 'Visualization of generation frequency, popular modes, and research tags'}
            </p>
          </div>
        </div>

        {/* Time Period Selector Tabs */}
        <div
          role="group"
          aria-label={isThai ? 'เลือกช่วงเวลาวิเคราะห์' : 'Select analytics time range'}
          className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800"
        >
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            aria-pressed={timeRange === '7d'}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              timeRange === '7d'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isThai ? '7 วัน' : '7 Days'}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            aria-pressed={timeRange === '30d'}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              timeRange === '30d'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isThai ? '30 วัน (แนะนำ)' : '30 Days'}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('90d')}
            aria-pressed={timeRange === '90d'}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              timeRange === '90d'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isThai ? '90 วัน' : '90 Days'}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('all')}
            aria-pressed={timeRange === 'all'}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              timeRange === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isThai ? 'ทั้งหมด' : 'All Time'}
          </button>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center text-slate-300 space-y-3">
          <Activity className="w-12 h-12 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-white">
            {isThai ? 'ไม่พบข้อมูลกิจกรรมในช่วงเวลาที่เลือก' : 'No activity logged for the selected time range'}
          </p>
          <p className="text-xs max-w-sm text-slate-300">
            {isThai
              ? 'ลองปรับเปลี่ยนช่วงเวลาการกรองเป็น "ทั้งหมด" หรือเริ่มสร้างผลงานใหม่ในสตูดิโอ'
              : 'Try switching the time range to "All Time" or generate new figures in StudioConsole.'}
          </p>
        </div>
      ) : (
        <>
          {/* Key Metric Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Generations */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
                <span>{isThai ? 'การสร้างภาพทั้งหมด' : 'Total Generations'}</span>
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              </div>
              <div className="text-2xl font-mono font-bold text-white tracking-tight tabular-nums">
                {totalCount}
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {timeRange === '30d'
                  ? isThai ? 'ในรอบ 30 วันที่ผ่านมา' : 'in past 30 days'
                  : isThai ? `ตามช่วงที่เลือก (${timeRange})` : `in selected range (${timeRange})`}
              </p>
            </div>

            {/* Most Used Mode */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
                <span>{isThai ? 'โหมดที่นิยมสูงสุด' : 'Top Mode'}</span>
                <Layers className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
              </div>
              <div className="text-sm sm:text-base font-mono font-bold text-sky-300 break-words">
                {topMode ? topMode.name : 'N/A'}
              </div>
              <p className="text-xs text-slate-300 font-mono tabular-nums">
                {topMode ? `${topMode.count} renders (${topMode.percentage}%)` : 'No data'}
              </p>
            </div>

            {/* Top Tag */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
                <span>{isThai ? 'แท็กยอดนิยม' : 'Top Research Tag'}</span>
                <Tag className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              </div>
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-300 break-words">
                {topTag ? topTag.name : 'N/A'}
              </div>
              <p className="text-xs text-slate-300 font-mono tabular-nums">
                {topTag ? `${topTag.count} records tagged` : 'No tags'}
              </p>
            </div>

            {/* QA Pass Rate & Favorites */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
                <span>{isThai ? 'อัตราผ่าน QA / โปรด' : 'QA Pass Rate'}</span>
                <Award className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                  {passRate}%
                </span>
                <span className="text-xs text-slate-300 font-mono flex items-center gap-1 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span>{favoriteCount}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono tabular-nums">
                {passCount} of {totalCount} verified
              </p>
            </div>
          </div>

          {/* Chart 1: Daily Activity Trend */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <h4 className="text-sm font-display font-semibold text-slate-100">
                  {isThai ? 'แนวโน้มกิจกรรมการสร้างภาพประจำวัน' : 'Daily Generation Activity Timeline'}
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-300 tabular-nums">
                {dailyActivityData.length} {isThai ? 'วัน' : 'days tracked'}
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyActivityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorFav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="displayDate"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    interval={timeRange === '90d' ? 6 : timeRange === '30d' ? 2 : 0}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name={isThai ? 'จำนวนการสร้างภาพ' : 'Generations'}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                  <Area
                    type="monotone"
                    dataKey="favorites"
                    name={isThai ? 'รายการโปรด' : 'Favorites'}
                    stroke="#38bdf8"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorFav)"
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row: Most Used Modes & Top Tags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 2: Most Used Modes */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <h4 className="text-sm font-display font-semibold text-slate-100">
                    {isThai ? 'โหมดที่ใช้งานบ่อยที่สุด (Top Modes)' : 'Most Used Generation Modes'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {modeData.length} {isThai ? 'โหมด' : 'modes'}
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={modeData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(value: any, _name: any, item: any) => [
                        `${value} renders (${item.payload.percentage}%)`,
                        item.payload.name
                      ]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {modeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Mode quick filter triggers */}
              {onFilterByMode && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500 mr-1">
                    {isThai ? 'กรองตามโหมด:' : 'Filter records:'}
                  </span>
                  {modeData.slice(0, 5).map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => onFilterByMode(m.name)}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                      <span>{m.name}</span>
                      <span className="text-slate-500">({m.count})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chart 3: Most Used Research Tags */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-display font-semibold text-slate-100">
                    {isThai ? 'แท็กยอดนิยมในรอบ 30 วัน (Top Tags)' : 'Top Tags in Selected Period'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {tagData.length} {isThai ? 'แท็ก' : 'tags'}
                </span>
              </div>

              {tagData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
                  <Tag className="w-8 h-8 text-slate-700 mb-2" />
                  <p className="text-xs text-slate-400">
                    {isThai ? 'ยังไม่มีการติดแท็กในประวัติช่วงเวลานี้' : 'No tags assigned to records yet'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    {isThai
                      ? 'คุณสามารถใช้ "แก้ไขกลุ่ม (Batch Editor)" เพื่อเพิ่มแท็ก #AgriculturalEng หรือ #NRRU_Lab ได้'
                      : 'Use the Batch Editor in the history list to tag multiple generations at once.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={tagData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          angle={-30}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '0.5rem',
                            color: '#f8fafc',
                            fontSize: '12px',
                          }}
                          formatter={(value: any) => [`${value} records`, 'Frequency']}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {tagData.map((entry, index) => (
                            <Cell key={`tag-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tag quick filter triggers */}
                  {onFilterByTag && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-slate-500 mr-1">
                        {isThai ? 'กรองตามแท็ก:' : 'Filter by tag:'}
                      </span>
                      {tagData.slice(0, 5).map((t) => (
                        <button
                          key={t.rawName}
                          type="button"
                          onClick={() => onFilterByTag(t.rawName)}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition-colors"
                        >
                          #{t.rawName} ({t.count})
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Row: QA Audit Distribution & Aspect Ratio Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QA Audit Verification Breakdown */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-display font-semibold text-slate-100">
                    {isThai ? 'สัดส่วนผลตรวจคุณภาพ (50-Point QA Compliance)' : '50-Point QA Audit Compliance'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {passRate}% Pass
                </span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qaData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {qaData.map((entry, index) => (
                        <Cell key={`qa-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Aspect Ratio Distribution */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-display font-semibold text-slate-100">
                    {isThai ? 'สัดส่วนอัตราส่วนภาพ (Aspect Ratio Distribution)' : 'Aspect Ratio Distribution'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {ratioData.length} ratios
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ratioData}
                    margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val} renders`, 'Count']}
                    />
                    <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
