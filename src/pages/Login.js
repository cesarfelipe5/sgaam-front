import { Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../imagens/logo_academia.png";
import { AuthService } from "../services/auth/AuthService";

const { Link, Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);

    const { token } = await AuthService.login({
      email: values.email,
      password: values.password,
    });

    if (!token) {
      return;
    }

    localStorage.setItem("token", token);

    setLoading(false);

    navigate("/main");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Cabeçalho */}
      <div
        style={{
          backgroundColor: "#FFD700",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ height: "80px", marginRight: "15px", width: 90 }}
        />
        <Title level={3} style={{ display: "inline-block", color: "#000" }}>
          SISTEMA DE GERENCIAMENTO DE ACADEMIA DE ARTES MARCIAIS
        </Title>
      </div>

      {/* Formulário de Login */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Form
          name="loginForm"
          layout="vertical"
          onFinish={handleLogin}
          style={{ width: "300px" }}
        >
          <Title level={4} style={{ textAlign: "center" }}>
            Login
          </Title>

          {/* Campo de E-mail */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Por favor, insira seu email!" },
            ]}
          >
            <Input type="email" placeholder="Digite seu email" />
          </Form.Item>

          {/* Campo de Senha */}
          <Form.Item
            name="password"
            label="Senha"
            rules={[
              { required: true, message: "Por favor, insira sua senha!" },
            ]}
          >
            <Input.Password placeholder="Digite sua senha" />
          </Form.Item>

          {/* Botão de Entrar */}
          <Form.Item>
            <Button
              style={{ background: "#FFD700", color: "black" }}
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Entrar
            </Button>
          </Form.Item>

          {/* Link de Esqueci minha senha */}
          <Form.Item style={{ textAlign: "center" }}>
            <Link href="#" style={{ fontSize: "14px" }}>
              Esqueci minha senha
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
