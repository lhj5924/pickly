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

  return (
    <svg width={size + 100} height={size + 40} style={{ overflow: 'visible' }}>
      <g transform={`translate(50, 20)`}>
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
