import { Api } from "../api";

export const ModalidadeService = {
  getData: async () => {
    const { data } = await Api.get("/modalidade");

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/modalidade/${id}`);

    return data;
  },

  createModalidade: async ({ modalidade }) => {
    const dataToCreate = {
      nome: modalidade.nome,
      descricao: modalidade.descricao,
      valor: modalidade.valor,
    };

    const { data } = await Api.post(`/modalidade`, dataToCreate);

    return data?.success;
  },

  updateModalidade: async ({ modalidade, id }) => {
    const dataToUpdate = {
      nome: modalidade.nome,
      descricao: modalidade.descricao,
      valor: modalidade.valor,
      isActive: modalidade.isActive === "Ativo",
    };

    const { data } = await Api.put(`/modalidade/${id}`, dataToUpdate);

    return data.status;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/modalidade/${id}`);

    return data?.success;
  },
};
