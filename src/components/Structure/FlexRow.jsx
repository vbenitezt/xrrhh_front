import { Typography } from "antd";

const { Title } = Typography;

const FlexRow = ({className="", title=null, ...props}) => {
  return (
    <div 
        className={"flex flex-row w-full gap-2 " + className}
    >
        {title && <Title>{title}</Title>}
        {props.children}
    </div>
    )
}


export default FlexRow;