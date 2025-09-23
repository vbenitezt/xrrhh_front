import { BarChart as BarCh, XAxis, YAxis, Bar, CartesianGrid, Tooltip, Legend } from "recharts";
import ChartContainer from "./charts.base";
import randomColor from "randomcolor";
import { useThemeStore } from "../../common/store/themeStore";

const BarChart = ({ title, data, dataKey, stacked = false, width = 500, height = 250 }) => {
  console.log(data);
  const { theme } = useThemeStore();
  /* const data = [
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
  ]; */

  return (
    <ChartContainer title={title}>
      <BarCh data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data?.[0] || {}).filter(key => key !== "name").map(key => (
          <Bar key={key} dataKey={key} fill={randomColor({
            luminosity: theme === "light" ? "dark" : "light",
            hue: "random"
          })} stackId={stacked && "a"} />
        ))}
      </BarCh>
    </ChartContainer>
  )
};

export default BarChart;
