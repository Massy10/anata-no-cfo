import React from 'react';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';

function IncomeIcon(active: boolean, color: string) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      {active ? (
        <>
          <Circle cx={11} cy={11} r={10} fill={color} />
          <Path
            d="M11 6V16M11 16L7 12M11 16L15 12"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <Circle cx={11} cy={11} r={9.5} stroke={color} strokeWidth={1.5} />
          <Path
            d="M11 6V16M11 16L7 12M11 16L15 12"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
}

function ExpenseIcon(active: boolean, color: string) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      {active ? (
        <>
          <Rect x={2} y={4} width={18} height={14} rx={3} fill={color} />
          <Line
            x1={6}
            y1={10}
            x2={16}
            y2={10}
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <Rect
            x={2.75}
            y={4.75}
            width={16.5}
            height={12.5}
            rx={2.25}
            stroke={color}
            strokeWidth={1.5}
          />
          <Line
            x1={6}
            y1={10}
            x2={16}
            y2={10}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}

function AnalysisIcon(active: boolean, color: string) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      {active ? (
        <>
          <Rect x={3} y={10} width={4} height={9} rx={1} fill={color} />
          <Rect x={9} y={5} width={4} height={14} rx={1} fill={color} />
          <Rect x={15} y={3} width={4} height={16} rx={1} fill={color} />
        </>
      ) : (
        <>
          <Rect
            x={3.5}
            y={10.5}
            width={3}
            height={8}
            rx={0.5}
            stroke={color}
            strokeWidth={1.5}
          />
          <Rect
            x={9.5}
            y={5.5}
            width={3}
            height={13}
            rx={0.5}
            stroke={color}
            strokeWidth={1.5}
          />
          <Rect
            x={15.5}
            y={3.5}
            width={3}
            height={15}
            rx={0.5}
            stroke={color}
            strokeWidth={1.5}
          />
        </>
      )}
    </Svg>
  );
}

function SettingsIcon(active: boolean, color: string) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      {active ? (
        <>
          <Circle cx={11} cy={11} r={4} fill={color} />
          <Line x1={11} y1={1} x2={11} y2={5} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={11} y1={17} x2={11} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={1} y1={11} x2={5} y2={11} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={17} y1={11} x2={21} y2={11} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={3.93} y1={3.93} x2={6.76} y2={6.76} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={15.24} y1={15.24} x2={18.07} y2={18.07} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={3.93} y1={18.07} x2={6.76} y2={15.24} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={15.24} y1={6.76} x2={18.07} y2={3.93} stroke={color} strokeWidth={2} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx={11} cy={11} r={3.25} stroke={color} strokeWidth={1.5} />
          <Line x1={11} y1={1} x2={11} y2={5} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={11} y1={17} x2={11} y2={21} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={1} y1={11} x2={5} y2={11} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={17} y1={11} x2={21} y2={11} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={3.93} y1={3.93} x2={6.76} y2={6.76} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={15.24} y1={15.24} x2={18.07} y2={18.07} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={3.93} y1={18.07} x2={6.76} y2={15.24} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={15.24} y1={6.76} x2={18.07} y2={3.93} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

export const TabIcons = {
  income: IncomeIcon,
  expense: ExpenseIcon,
  analysis: AnalysisIcon,
  settings: SettingsIcon,
};

export default TabIcons;
