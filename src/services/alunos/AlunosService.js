import { Api } from "../api";

export const AlunosService = {
  getData: async ({ perPage = 10, currentPage = 1, showAll = false }) => {
    const { data } = await Api.get(
      `/aluno?perPage=${perPage}&currentPage=${currentPage}&showAll=${showAll}`
    );

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/aluno/${id}`);

    return data;
  },

  createAluno: async ({ aluno }) => {
    const dataToCreate = {
      idPlano: aluno.plano,
      nome: aluno.nome,
      cpf: aluno.cpf.replace(/\D/g, ""),
      rg: aluno.rg,
      uf: aluno.uf.toUpperCase(),
      cidade: aluno.cidade,
      cep: aluno.cep.replace(/\D/g, ""),
      numero: aluno.numero,
      bairro: aluno.bairro,
      logradouro: aluno.logradouro,
      telefones: [
        {
          tipo: aluno.tipo,
          numero: aluno.numero_telefone.replace(/\D/g, ""),
        },
      ],
    };

    const { data } = await Api.post(`/aluno`, dataToCreate);

    return data;
  },

  updateAluno: async ({ aluno, id }) => {
    const dataToUpdate = {
      idPlano: aluno.plano,
      nome: aluno.nome,
      cpf: aluno.cpf.replace(/\D/g, ""),
      rg: aluno.rg,
      uf: aluno.uf.toUpperCase(),
      cidade: aluno.cidade,
      cep: aluno.cep.replace(/\D/g, ""),
      numero: aluno.numero,
      bairro: aluno.bairro,
      logradouro: aluno.logradouro,
      telefones: [
        {
          tipo: aluno.tipo,
          numero: aluno.numero_telefone.replace(/\D/g, ""),
        },
      ],
    };

    const { data } = await Api.put(`/aluno/${id}`, dataToUpdate);

    return data;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/aluno/${id}`);

    return data;
  },
};
