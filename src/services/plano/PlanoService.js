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

  createPlano: async ({ plano, modalidades }) => {
    const dataToCreate = {
      nome: plano.nome,
      descricao: plano.descricao,
      // inicioVigencia: "2024-11-12T02:22:53.000Z",
      // fimVigencia: "2025-11-12T02:22:53.000Z",
      precoPadrao: plano.precoPadrao,
    };

    const { data } = await Api.post(`/plano`, dataToCreate);

    return data?.success;
  },

  updatePlano: async ({ aluno, id }) => {
    const dataToUpdate = {
      nome: aluno.nome,
      cpf: aluno.cpf,
      rg: aluno.rg,
      uf: aluno.uf.toUpperCase(),
      cidade: aluno.cidade,
      cep: aluno.cep,
      numero: aluno.numero,
      bairro: aluno.bairro,
      logradouro: aluno.logradouro,
      telefones: [
        {
          tipo: aluno.tipo,
          numero: aluno.numero_telefone,
        },
      ],
    };

    const { data } = await Api.put(`/plano/${id}`, dataToUpdate);

    return data.status;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/plano/${id}`);

    return data?.success;
  },
};