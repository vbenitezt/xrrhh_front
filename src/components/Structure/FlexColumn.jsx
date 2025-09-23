import { Typography } from "antd";

const { Title } = Typography;

const FlexColumn = ({ className = "", title = null, titleLevel = 1, extraContent = null, ...props }) => {
    return (
        <div
            className={"flex flex-col w-full h-full gap-2 " + className}
        >
            <div className="flex flex-col md:flex-row justify-between w-full gap-2">
                {title && <Title className="w-full md:w-1/3" level={titleLevel}>{title}</Title>}
                {extraContent && extraContent}
            </div>
            {props.children}
        </div>
    )
}


export default FlexColumn;