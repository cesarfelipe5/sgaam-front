import { notification } from "antd";

export const errorInterceptor = (error) => {
  if (error.message === "Network Error") {
    return Promise.reject(new Error("Erro de conexão."));
  }

  if (error.response?.status === 401) {
    notification.error({
      message: "Erro de Autenticação",
      description: "Você não está autenticado ou sua sessão expirou.",
    });

    return;
    // Aqui você pode fazer um redirecionamento ou outra ação de logout, se necessário.
  }

  return Promise.reject(error);
};
