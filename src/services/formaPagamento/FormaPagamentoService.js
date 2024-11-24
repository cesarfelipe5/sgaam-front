import { Api } from "../api";

export const formaPagamentoService = {
  getData: async ({ perPage = 10, currentPage = 1 }) => {
    const { data } = await Api.get(
      `/formaPagamento?perPage=${perPage}&currentPage=${currentPage}`
    );

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/formaPagamento/${id}`);

    return data;
  },

  createFormaPagamento: async ({ formaPagamento }) => {
    const dataToCreate = {
      nome: formaPagamento.nome,
    };

    const { data } = await Api.post(`/formaPagamento`, dataToCreate);

    return data;
  },

  updateFormaPagamento: async ({ formaPagamento, id }) => {
    const dataToUpdate = {
      nome: formaPagamento.nome,
    };

    const { data } = await Api.put(`/formaPagamento/${id}`, dataToUpdate);

    return data;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/formaPagamento/${id}`);

    return data;
  },
};
