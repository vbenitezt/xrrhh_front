import { Radar, RadarChart as RadarCh, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import ChartContainer from './charts.base';


/* const data = [
    {
        subject: 'Math',
        A: 120,
        B: 110,
        fullMark: 150,
    },
    {
        subject: 'Chinese',
        A: 98,
        B: 130,
        fullMark: 150,
    },
    {
        subject: 'English',
        A: 86,
        B: 130,
        fullMark: 150,
    },
    {
        subject: 'Geography',
        A: 99,
        B: 100,
        fullMark: 150,
    },
    {
        subject: 'Physics',
        A: 85,
        B: 90,
        fullMark: 150,
    },
    {
        subject: 'History',
        A: 65,
        B: 85,
        fullMark: 150,
    },
]; */

const RadarChart = ({ title, data, dataKey }) => {
    console.log(data);
    return (
        <ChartContainer title={title}>
            <RadarCh data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Mike" dataKey={dataKey} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
            </RadarCh>
        </ChartContainer>
    );
}


export default RadarChart;
