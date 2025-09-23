import { Spin, Typography, theme } from 'antd';

const { Text } = Typography;

const Spinner = ({ size="large", tip="Cargando" }) => {
  const { 
    token: { colorSuccess: color },
   } = theme.useToken();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-center">
      <Spin size={size}>
      </Spin>
      <Text className='text-blue-400'>{tip}</Text>
    </div>
  );
};

export default Spinner;
