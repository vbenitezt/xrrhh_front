import React, { useEffect } from "react";
import { Typography, Card, Avatar, Form, Checkbox, Input, Button } from "antd";
import { useLoginMutate } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../common/store/authStore";
import Spinner from "../components/Loading/Spinner";
import { LockOutlined, UserOutlined } from '@ant-design/icons';


const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();

  const { mutate: login, isPending: isLogin, isError: isLoginError } = useLoginMutate();

  useEffect(() => {
    if (isAuth) {
      navigate("/home");
    }
  }, [isAuth]);

  const onFinish = (values) => {
    login(values);
  }


  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      {isLogin && !isLoginError ? (
        <Spinner tip="Iniciando Sesión" />
      ) : (
        <div className="flex flex-col justify-center w-screen h-screen lg:flex-row items-around">
          <div className="hidden flex-col gap-5 justify-center items-center w-full h-full lg:flex bg-loginImage" />
          <div className="flex flex-col justify-center items-center w-full h-full bg-slate-100">
            <Card className="w-10/12 md:w-3/5">
              <div className="flex flex-col gap-1 items-center p-4 w-full">
                <Avatar
                  shape="square"
                  className="mx-auto w-auto h-24"
                  src="logo.jpg"
                  alt="XRRHH"
                />
                <Title
                  level={2}
                  className="mt-4 mb-6 tracking-tight text-center"
                >
                  Inicia Sesión
                </Title>
                <Form
                  className="flex flex-col gap-3 justify-start w-2/3 sm:w-3/5 lg:w-2/5"
                  noStyle
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    noStyle
                    name="login_user"
                    rules={[
                      {
                        required: true,
                        message: 'El campo Usuario es requerido!',
                      },
                    ]}
                  >
                    <Input autoFocus prefix={<UserOutlined />} placeholder="Usuario" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'El campo contraseña es requerido!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder="Contraseña"
                    />
                  </Form.Item>
                  <Form.Item className="items-start px-4 w-full" noStyle>
                    <Form.Item name="remember" noStyle>
                      <Checkbox defaultChecked={false}>Recuérdame</Checkbox>
                    </Form.Item>
                  </Form.Item>
                  <Form.Item noStyle>
                    <Button type="primary" htmlType="submit">
                      Ingresar
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
