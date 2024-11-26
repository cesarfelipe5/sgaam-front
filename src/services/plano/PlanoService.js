import { Api } from "../api";

export const PlanoService = {
  getData: async ({ perPage = 10, currentPage = 1 }) => {
    const { data } = await Api.get(
      `/plano?perPage=${perPage}&currentPage=${currentPage}`
    );

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/plano/${id}`);

    return data;
  },

  createPlano: async ({ plano }) => {
    const dataToCreate = {
      nome: plano.nome,
      descricao: plano.descricao,
      precoPadrao: plano.precoPadrao.replace(/[^\d]/g, "")/100,
      modalidadeIds: plano.modalidades,
    };

    const { data } = await Api.post(`/plano`, dataToCreate);

    return data;
  },

  updatePlano: async ({ plano, id }) => {
    const dataToUpdate = {
      nome: plano.nome,
      descricao: plano.descricao,
      precoPadrao: plano.precoPadrao.replace(/[^\d]/g, "")/100,
      modalidadeIds: plano.modalidades,
    };

    const { data } = await Api.put(`/plano/${id}`, dataToUpdate);

    return data;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/plano/${id}`);

    return data;
  },
};
