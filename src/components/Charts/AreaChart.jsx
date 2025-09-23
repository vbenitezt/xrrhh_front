import { AreaChart as AreaCh, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from "recharts";
import ChartContainer from "./charts.base";

const AreaChart = ({ title, stacked = false }) => {

  const data = [
    {
      name: 'Page A',
      Followers: 4000,
      Likes: 2400,
      Dislikes: 2400,
    },
    {
      name: 'Page B',
      Followers: 3000,
      Likes: 1398,
      Dislikes: 2210,
    },
    {
      name: 'Page C',
      Followers: 2000,
      Likes: 9800,
      Dislikes: 2290,
    },
    {
      name: 'Page D',
      Followers: 2780,
      Likes: 3908,
      Dislikes: 2000,
    },
    {
      name: 'Page E',
      Followers: 1890,
      Likes: 4800,
      Dislikes: 2181,
    },
    {
      name: 'Page F',
      Followers: 2390,
      Likes: 3800,
      Dislikes: 2500,
    },
    {
      name: 'Page G',
      Followers: 3490,
      Likes: 4300,
      Dislikes: 2100,
    },
  ];

  return (
    <ChartContainer title={title}>
      <AreaCh data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          dataKey="Followers"
          stroke="#8884d8"
          fill="#8884d8"
          stackId={stacked && "1"}
        />
        <Area
          dataKey="Likes"
          stroke="#82ca9d"
          fill="#82ca9d"
          stackId={stacked && "1"}
        />
        <Area
          dataKey="Dislikes"
          stroke="#b08763"
          fill="#b08763"
          stackId={stacked && "1"}
        />
      </AreaCh>
    </ChartContainer>
  )
};

export default AreaChart;
