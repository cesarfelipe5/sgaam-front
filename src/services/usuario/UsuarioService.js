import { Api } from "../api";

export const UsuarioService = {
  getData: async ({ perPage = 10, currentPage = 1 }) => {
    const { data } = await Api.get(
      `/usuario?perPage=${perPage}&currentPage=${currentPage}`
    );

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/usuario/${id}`);

    return data;
  },

  createUsuario: async ({ usuario }) => {
    const dataToCreate = {
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
    };

    const { data } = await Api.post(`/usuario`, dataToCreate);

    return data;
  },

  updateUsuario: async ({ usuario, id }) => {
    const dataToUpdate = {
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
    };

    const { data } = await Api.put(`/usuario/${id}`, dataToUpdate);

    return data;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/usuario/${id}`);

    return data;
  },
};
