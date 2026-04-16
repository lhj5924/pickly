'use client';

import { useState, useEffect, useId } from 'react';
import { useTheme } from 'styled-components';

export interface ChartSegment {
  name: string;
  value: number;
}

interface AnimatedPieChartProps {
  data: ChartSegment[];
  animate: boolean;
}

const TOTAL_DRAW_DURATION = 1.5;
const LABEL_FADE_DURATION = 0.4;

export const AnimatedPieChart = ({ data, animate }: AnimatedPieChartProps) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const theme = useTheme();
  const chartColors = theme.colors.chart;
  const uid = useId().replace(/:/g, '');

  const size = 220;
  const strokeWidth = 110;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  let accumulatedPercentage = 0;
  let accumulatedDelay = 0;
  const segments = data.map((segment, index) => {
    const percentage = (segment.value / total) * 100;
    const segmentLength = (percentage / 100) * circumference;
    const strokeDasharray = `${segmentLength} ${circumference}`;
    const strokeDashoffset = -(accumulatedPercentage / 100) * circumference;

    const segmentDuration = TOTAL_DRAW_DURATION * (percentage / 100);
    const segmentDelay = accumulatedDelay;

    const segmentMiddle = accumulatedPercentage + percentage / 2;
    const angle = (segmentMiddle / 100) * 2 * Math.PI - Math.PI / 2;
    const labelRadius = radius + strokeWidth / 2 + 30;
    const labelX = center + Math.cos(angle) * labelRadius;
    const labelY = center + Math.sin(angle) * labelRadius;

    const lineStartRadius = radius + strokeWidth / 2;
    const lineStartX = center + Math.cos(angle) * lineStartRadius;
    const lineStartY = center + Math.sin(angle) * lineStartRadius;

    const isLeftSide = labelX < center;
    const textAnchor: 'end' | 'start' = isLeftSide ? 'end' : 'start';
    const labelOffset = isLeftSide ? -10 : 10;

    const color = chartColors[index % chartColors.length];

    accumulatedPercentage += percentage;
    accumulatedDelay += segmentDuration;

    return {
      ...segment,
      percentage: Math.round(percentage),
      color,
      segmentLength,
      strokeDasharray,
      strokeDashoffset,
      segmentDuration,
      segmentDelay,
      labelDelay: segmentDelay + segmentDuration,
      labelX: labelX + labelOffset,
      labelY,
      lineStartX,
      lineStartY,
      lineEndX: labelX,
      lineEndY: labelY,
      textAnchor,
    };
  });

  const totalAnimationTime = TOTAL_DRAW_DURATION + LABEL_FADE_DURATION + 0.5;

  useEffect(() => {
    if (animate && !animationComplete) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, totalAnimationTime * 1000);
      return () => clearTimeout(timer);
    }
  }, [animate, animationComplete, totalAnimationTime]);

  const shouldAnimate = animate && !animationComplete;

  // ── Compute SVG bounding box from actual content positions ──
  const FONT_SIZE = 14;
  const SVG_PAD = 16;

  // Estimate rendered text width per character at font-size 14 weight 500
  const estimateTextWidth = (text: string): number => {
    let w = 0;
    for (const ch of text) {
      const code = ch.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) w += 14; // Korean syllable
      else if (ch === ' ') w += 5;
      else w += 9; // ASCII digit / symbol
    }
    return w;
  };

  let minX = 0, maxX = size, minY = 0, maxY = size; // donut bounds
  segments.forEach(seg => {
    const label = `${seg.name} ${seg.percentage}%`;
    const tw = estimateTextWidth(label);
    const textLeft = seg.textAnchor === 'end' ? seg.labelX - tw : seg.labelX;
    const textRight = seg.textAnchor === 'end' ? seg.labelX : seg.labelX + tw;
    const textTop = seg.labelY - FONT_SIZE / 2;
    const textBottom = seg.labelY + FONT_SIZE / 2;
    minX = Math.min(minX, textLeft, seg.lineStartX, seg.lineEndX);
    maxX = Math.max(maxX, textRight, seg.lineStartX, seg.lineEndX);
    minY = Math.min(minY, textTop, seg.lineStartY, seg.lineEndY);
    maxY = Math.max(maxY, textBottom, seg.lineStartY, seg.lineEndY);
  });

  const svgWidth = maxX - minX + SVG_PAD * 2;
  const svgHeight = maxY - minY + SVG_PAD * 2;
  const tx = -minX + SVG_PAD;
  const ty = -minY + SVG_PAD;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${tx}, ${ty})`}>
        <g style={{ transform: 'rotate(-90deg)', transformOrigin: `${center}px ${center}px` }}>
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              style={
                shouldAnimate
                  ? {
                      strokeDasharray: `0 ${circumference}`,
                      animation: `${uid}seg${index} ${segment.segmentDuration}s linear ${segment.segmentDelay}s forwards`,
                    }
                  : undefined
              }
            />
          ))}
        </g>

        {segments.map((segment, index) => (
          <g key={`label-${index}`}>
            <line
              x1={segment.lineStartX}
              y1={segment.lineStartY}
              x2={segment.lineEndX}
              y2={segment.lineEndY}
              stroke="#999"
              strokeWidth={1}
              style={
                shouldAnimate
                  ? { opacity: 0, animation: `${uid}fadeIn 0.3s ease-out ${segment.labelDelay}s forwards` }
                  : undefined
              }
            />
            <text
              x={segment.labelX}
              y={segment.labelY}
              textAnchor={segment.textAnchor}
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="500"
              fill="#333"
              style={
                shouldAnimate
                  ? {
                      opacity: 0,
                      animation: `${uid}fadeInUp ${LABEL_FADE_DURATION}s ease-out ${segment.labelDelay + 0.1}s forwards`,
                    }
                  : undefined
              }
            >
              {segment.name} {segment.percentage}%
            </text>
          </g>
        ))}
      </g>

      <style>
        {`
          @keyframes ${uid}fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes ${uid}fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          ${segments
            .map(
              (seg, index) => `
            @keyframes ${uid}seg${index} {
              from { stroke-dasharray: 0 ${circumference}; }
              to { stroke-dasharray: ${seg.strokeDasharray}; }
            }
          `,
            )
            .join('')}
        `}
      </style>
    </svg>
  );
};
