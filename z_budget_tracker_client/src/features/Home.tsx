import {
  Legend,
  Pie,
  PieChart,
  Tooltip,
  type PieLabelRenderProps,
} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
  const x = cx + radius * Math.cos(-midAngle! * RADIAN);
  const y = cy + radius * Math.sin(-midAngle! * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent! * 100).toFixed(0)}%`}
    </text>
  );
};

const RADIAN = Math.PI / 180;
const Home = () => {
  const data01 = [
    {
      value: 20,
      fill: 'var(--color-red-900)',
      name: 'Cyber Security Assesssment and Development',
    },

    {
      value: 10,
      fill: 'var(--color-orange-900)',
      name: 'Management & Doordination',
    },
    { value: 30, fill: 'var(--color-yellow-900)', name: 'Training' },

    {
      value: 10,
      fill: 'var(--color-green-900)',
      name: 'EE - HIDTA Wide Insurance',
    },
    {
      value: 10,
      fill: 'var(--color-sky-900)',
      name: 'Marijuana Impact Group',
    },
    {
      value: 20,
      fill: 'var(--color-blue-900)',
      name: 'Drug Threat Analysis Group',
    },
  ];


  return (
    <div>
      <PieChart
        className="text-"
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          aspectRatio: 1,
        }}
      >
        <Pie
          data={data01}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={95}
          outerRadius={150}
          paddingAngle={3}
          isAnimationActive={true}
          labelLine={false}
          label={renderCustomizedLabel}
        ></Pie>
        <Tooltip />
        <RechartsDevtools />
        <Legend
          verticalAlign="bottom"
          align="center"
          width="30%"
          layout="horizontal"
          iconSize={15}
          iconType="circle"
          wrapperStyle={{ right: -10, paddingLeft: '15px', width: '100%' }}
        />
      </PieChart>
    </div>
  );
};
export default Home;
