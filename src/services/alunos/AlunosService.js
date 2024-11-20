import { Api } from "../api";

export const AlunosService = {
  getData: async () => {
    const { data } = await Api.get("/aluno");

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/aluno/${id}`);

    return data;
  },

  createAluno: async ({ aluno }) => {
    const dataToCreate = {
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

    const { data } = await Api.post(`/aluno`, dataToCreate);

    return data?.success;
  },

  updateAluno: async ({ aluno, id }) => {
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

    const { data } = await Api.put(`/aluno/${id}`, dataToUpdate);

    return data.status;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/aluno/${id}`);

    return data?.success;
  },
};
