import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  type XAxisTickContentProps,
  Text,
} from 'recharts';
import type { ReactNode } from 'react';
import { RechartsDevtools } from '@recharts/devtools';

// #region Sample data
const data = [
  {
    name: 'M&C',
    Budgeted: 2400,
    Spent: 2000,
  },
  {
    name: 'Training',
    Budgeted: 1398,
    Spent: 2210,
  },
];

// #endregion
const monthTickFormatter = (tick: string | number | Date): string => {
  // const name = new Date(tick);
  // return String(name.getMonth() + 1);
  return tick.toString();
};

const renderQuarterTick = (tickProps: XAxisTickContentProps): ReactNode => {
  const {
    x: xProp,
    y: yProp,
    payload,
    width: widthProp,
    visibleTicksCount,
  } = tickProps;
  const x = Number(xProp);
  const y = Number(yProp);
  const width = Number(widthProp);
  const { value, offset = 0 } = payload;
  const name = new Date(value);
  const month = name.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;

  if (month % 3 === 1) {
    return (
      <Text
        x={x + width / visibleTicksCount / 2 - offset}
        y={y - 4}
        textAnchor="middle"
      >{`Q${quarterNo}`}</Text>
    );
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX =
      Math.floor(isLast ? x - offset + width / visibleTicksCount : x - offset) +
      0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }
  return null;
};

const BarChartWithMultiXAxis = () => {
  return (
    <BarChart
      style={{
        width: '100%',
        maxWidth: '700px',
        maxHeight: '70vh',
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 25,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid />
      <XAxis
        dataKey="name"
        fontSize={10}
        label={{
          value: 'X-Axis Title',
          position: 'insideBottom',
          fill: 'var(--color-blue-500)',
          offset: -5,
          fontWeight: 'bolder',
        }}
        tickFormatter={monthTickFormatter}
      />
      {/* <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        interval={0}
        tick={renderQuarterTick}
        height={1}
        scale="band"
        xAxisId="quarter"
      /> */}
      <YAxis
        width="auto"
        tickFormatter={(value) => `$${value.toLocaleString()}`}
      />
      <Tooltip />
      <Legend
        wrapperStyle={{ paddingTop: '1em', backgroundColor: 'transparent' }}
      />
      <Bar dataKey="Budgeted" fill="#0088FE" />
      <Bar dataKey="Spent" fill="#00C49F" />
      <RechartsDevtools />
    </BarChart>
  );
};

export default BarChartWithMultiXAxis;
