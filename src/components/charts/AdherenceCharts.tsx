import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translateWeekday } from '../../i18n/helpers';
import { DailyAdherencePoint } from '../../types';

export const WeeklyAdherenceChart: React.FC<{
  data: DailyAdherencePoint[];
  height?: number;
}> = ({ data, height = 220 }) => {
  const { t } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-4 text-sm text-slate-600">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#15803D]" aria-hidden="true" />
            <span>{t.charts.takenDoses}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#DC2626]" aria-hidden="true" />
            <span>{t.charts.missedDoses}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#CBE2F5]" aria-hidden="true" />
            <span>{t.charts.pending}</span>
          </span>
        </div>
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div className="font-mono-num text-xs sm:text-sm font-semibold text-slate-800">
            {translateWeekday(data[hoveredIdx].day, t)}: {data[hoveredIdx].taken}/{data[hoveredIdx].total}{' '}
            {t.charts.takenWord} ({data[hoveredIdx].rate}%)
          </div>
        )}
      </div>

      <div
        className="grid grid-cols-7 gap-3 items-end pt-4 border-b border-[#DCE7F2] pb-2"
        style={{ height }}
      >
        {data.map((point, idx) => {
          const total = Math.max(point.total, 1);
          const takenPct = point.total === 0 ? 0 : Math.round((point.taken / total) * 100);
          const missedPct = point.total === 0 ? 0 : Math.round((point.missed / total) * 100);
          const pendingPct = point.total === 0 ? 100 : Math.max(0, 100 - takenPct - missedPct);

          return (
            <div
              key={`${point.day}-${idx}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex flex-col items-center h-full justify-end group cursor-pointer"
            >
              <span className="mb-1.5 text-xs font-semibold tabular-nums text-slate-700">
                {point.rate}%
              </span>
              <div className="w-full max-w-[44px] h-[72%] bg-[#EFF6FB] rounded-lg overflow-hidden flex flex-col-reverse border border-[#DCE7F2] group-hover:border-[#0369A1] transition-colors">
                {takenPct > 0 && (
                  <div
                    style={{ height: `${takenPct}%` }}
                    className="w-full bg-[#16A34A] transition-all duration-200"
                    title={`${point.taken} ${t.charts.takenWord}`}
                  />
                )}
                {missedPct > 0 && (
                  <div
                    style={{ height: `${missedPct}%` }}
                    className="w-full bg-[#DC2626] transition-all duration-200"
                    title={`${point.missed} ${t.charts.missedWord}`}
                  />
                )}
                {pendingPct > 0 && (
                  <div
                    style={{ height: `${pendingPct}%` }}
                    className="w-full bg-[#CBE2F5] transition-all duration-200"
                    title={t.charts.pending}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-3 pt-2.5 text-center">
        {data.map((point, idx) => (
          <div key={`${point.day}-${idx}`} className="text-sm font-medium text-slate-700">
            {translateWeekday(point.day, t)}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdherenceTrendChart: React.FC<{
  data: { label: string; rate: number }[];
}> = ({ data }) => {
  const { t } = useApp();
  const width = 640;
  const height = 190;
  const padX = 36;
  const padY = 24;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * innerW;
    const y = padY + ((100 - d.rate) / 100) * innerH;
    return { ...d, x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath =
    points.length > 1
      ? `M ${points[0].x},${padY + innerH} L ${points.map((p) => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},${padY + innerH} Z`
      : '';

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-w-[440px]"
        role="img"
        aria-label={t.charts.adherenceTrendAria}
      >
        {[100, 75, 50].map((val) => {
          const y = padY + ((100 - val) / 100) * innerH;
          return (
            <g key={val}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={8} y={y + 4} fontSize="11" fill="#64748B" className="font-mono-num">
                {val}%
              </text>
            </g>
          );
        })}

        {areaPath && <path d={areaPath} fill="#E0F2FE" opacity="0.6" />}
        <polyline
          fill="none"
          stroke="#0369A1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polyline}
        />

        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2.5" />
            <text
              x={p.x}
              y={height - 4}
              textAnchor="middle"
              fontSize="11"
              fill="#475569"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
