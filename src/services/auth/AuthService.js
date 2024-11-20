import { Api } from "../api";

export const AuthService = {
  login: async ({ email, password }) => {
    const { data } = await Api.post("/auth/login", { email, senha: password });

    return data;
  },
};
