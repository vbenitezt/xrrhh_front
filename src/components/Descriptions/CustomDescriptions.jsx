import { Descriptions } from "antd";


const CustomDescriptions = (fields, h="2/12", w="5/6") => {
    return (
        <Descriptions bordered size="default" className={`w-${w} h-${h}`}>
            {
                fields.map((field, index) => {
                    <Descriptions.Item key={index} label={field.label}>{field.content}</Descriptions.Item>
                })
            }
        </Descriptions>
    )
}


export default CustomDescriptions;