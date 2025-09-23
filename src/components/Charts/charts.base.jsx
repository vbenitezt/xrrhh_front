import { Typography } from "antd";
import { ResponsiveContainer } from "recharts";


const { Title } = Typography;


const ChartContainer = ({ title, ...props }) => {
    return (
        <div className="flex flex-col items-center w-full gap-2">
            <Title level={5}>{title}</Title>
            <ResponsiveContainer width={600} height={300}>
                {props.children}
            </ResponsiveContainer>
        </div>
    )
}


export default ChartContainer;