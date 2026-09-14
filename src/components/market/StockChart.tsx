import React, { useState, useRef, useCallback } from 'react';
import { StockPricePoint } from '../../types';

interface StockChartProps {
  chartData: {
    '1D': StockPricePoint[];
    '1W': StockPricePoint[];
    '1M': StockPricePoint[];
    '3M': StockPricePoint[];
    '1Y': StockPricePoint[];
  };
  isPositive: boolean;
  onScrub?: (point: StockPricePoint | null) => void;
}

type IntervalType = '1D' | '1W' | '1M' | '3M' | '1Y';

export const StockChart: React.FC<StockChartProps> = ({
  chartData,
  isPositive,
  onScrub,
}) => {
  const [interval, setInterval] = useState<IntervalType>('1D');
  const [scrubPoint, setScrubPoint] = useState<StockPricePoint | null>(null);
  const [scrubCoord, setScrubCoord] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const points = chartData[interval] || chartData['1D'] || [];

  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  const width = 360;
  const height = 180;
  const paddingX = 8;
  const paddingY = 16;

  // Calculate coordinates for points
  const coords = points.map((p, idx) => {
    const x =
      paddingX + (idx / Math.max(1, points.length - 1)) * (width - paddingX * 2);
    const y =
      height -
      paddingY -
      ((p.price - minPrice) / priceRange) * (height - paddingY * 2);
    return { x, y, point: p };
  });

  // Smooth Bezier path
  const pathD = coords.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1]?.x || width} ${height} L ${
    coords[0]?.x || 0
  } ${height} Z`;

  // Toss Securities colors: +Red (#F04452), -Blue (#3182F6)
  const strokeColor = isPositive ? '#F04452' : '#3182F6';
  const gradientId = `chart-toss-grad-${isPositive ? 'red' : 'blue'}`;

  // Handle interactive scrubbing (Touch & Mouse drag)
  const updateScrubber = useCallback(
    (clientX: number) => {
      if (!containerRef.current || coords.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const ratio = relativeX / rect.width;
      const targetIdx = Math.round(ratio * (coords.length - 1));
      const clampedIdx = Math.max(0, Math.min(coords.length - 1, targetIdx));
      const activeCoord = coords[clampedIdx];

      if (activeCoord) {
        setScrubPoint(activeCoord.point);
        setScrubCoord({ x: activeCoord.x, y: activeCoord.y });
        if (onScrub) onScrub(activeCoord.point);
      }
    },
    [coords, onScrub]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateScrubber(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0 || e.pointerType === 'touch' || scrubPoint !== null) {
      updateScrubber(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setScrubPoint(null);
    setScrubCoord(null);
    if (onScrub) onScrub(null);
  };

  const currentActivePoint = scrubPoint || points[points.length - 1];

  return (
    <div className="w-full bg-[#FFFFFF] rounded-2xl p-4 border border-[#F2F4F6] select-none">
      {/* Dynamic Header Display on Touch/Hover Drag */}
      <div className="flex items-center justify-between h-7 mb-2 px-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[#8B95A1]">
            {scrubPoint ? scrubPoint.time : `기준: ${interval}`}
          </span>
          {scrubPoint && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F2F4F6] text-[#4E5968]">
              탐색 중
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm font-extrabold text-[#191F28] tracking-tight">
            {currentActivePoint?.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* Interactive Chart Area with Scrubber */}
      <div
        ref={containerRef}
        id="interactive-chart-scrubber-area"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[180px] cursor-crosshair touch-none overflow-hidden"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Minimal 1px horizontal guide lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#F2F4F6"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#F2F4F6"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#F2F4F6"
            strokeWidth="1"
          />

          {/* Area gradient under line */}
          <path d={areaD} fill={`url(#${gradientId})`} />

          {/* Primary curve path */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Scrubber Line & Active Point */}
          {scrubCoord && (
            <g>
              <line
                x1={scrubCoord.x}
                y1={0}
                x2={scrubCoord.x}
                y2={height}
                stroke="#8B95A1"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={scrubCoord.x}
                cy={scrubCoord.y}
                r={6}
                fill={strokeColor}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                className="drop-shadow-xs"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between text-[11px] text-[#8B95A1] font-medium mt-1.5 px-1">
        <span>{points[0]?.time}</span>
        <span>{points[Math.floor(points.length / 2)]?.time}</span>
        <span>{points[points.length - 1]?.time}</span>
      </div>

      {/* Timeframe Selector Pills (Toss Securities style) */}
      <div className="flex justify-between items-center bg-[#F9FAFB] p-1 rounded-xl mt-3">
        {(['1D', '1W', '1M', '3M', '1Y'] as IntervalType[]).map((tab) => (
          <button
            key={tab}
            id={`chart-interval-btn-${tab}`}
            onClick={() => {
              setInterval(tab);
              setScrubPoint(null);
              setScrubCoord(null);
              if (onScrub) onScrub(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
              interval === tab
                ? 'bg-[#6C47FF] text-white shadow-xs'
                : 'text-[#8B95A1] hover:text-[#191F28]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
