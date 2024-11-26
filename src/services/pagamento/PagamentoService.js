import moment from "moment";
import { Api } from "../api";

export const pagamentoService = {
  getData: async ({ perPage = 10, currentPage = 1 }) => {
    const { data } = await Api.get(
      `/pagamento?perPage=${perPage}&currentPage=${currentPage}`
    );

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/pagamento/${id}`);

    return data;
  },

  createPagamento: async ({ pagamento }) => {
    const dataToCreate = {
      valor: pagamento.valor.replace(/[^\d]/g, "") / 100,
      dataPagamento: moment(
        pagamento.dataPagamento.format("DD/MM/YYYY")
      ).toISOString(),
      idPlanoAluno: pagamento.idPlanoAluno,
      idFormaPagamento: pagamento.formaPagamento,
      observacao: pagamento.observacao,
    };

    const { data } = await Api.post(`/pagamento`, dataToCreate);

    return data;
  },

  updatePagamento: async ({ pagamento, id }) => {
    const dataToUpdate = {
      valor: pagamento.valor.replace(/[^\d]/g, "") / 100,
      dataPagamento: moment(
        pagamento.dataPagamento.format("DD/MM/YYYY")
      ).toISOString(),
      idPlanoAluno: pagamento.idPlanoAluno,
      idFormaPagamento: pagamento.formaPagamento,
      observacao: pagamento.observacao,
    };

    const { data } = await Api.put(`/pagamento/${id}`, dataToUpdate);

    return data;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/pagamento/${id}`);

    return data;
  },
};
