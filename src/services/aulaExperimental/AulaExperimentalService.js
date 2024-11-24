import moment from "moment";
import { Api } from "../api";

export const AulaExperimentalService = {
  getData: async ({ perPage = 10, currentPage = 1 }) => {
    const { data } = await Api.get(
      `/aulaExperimental?perPage=${perPage}&currentPage=${currentPage}`
    );

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/aulaExperimental/${id}`);

    return data;
  },

  createAulaExperimental: async ({ aulaExperimental }) => {
    const dataToCreate = {
      nome: aulaExperimental.nome,
      cpf: aulaExperimental.cpf.replace(/\D/g, ""),
      date: moment(aulaExperimental.date).toISOString(),
      hour: aulaExperimental.hour,
      idModalidade: aulaExperimental.modalidade,
    };

    const { data } = await Api.post(`/aulaExperimental`, dataToCreate);

    return data;
  },

  updateAulaExperimental: async ({ aulaExperimental, id }) => {
    const dataToUpdate = {
      nome: aulaExperimental.nome,
      cpf: aulaExperimental.cpf,
      date: moment(aulaExperimental.date).toISOString(),
      hour: aulaExperimental.hour,
      idModalidade: aulaExperimental.modalidade,
    };

    const { data } = await Api.put(`/aulaExperimental/${id}`, dataToUpdate);

    return data;
  },

  removeById: async ({ id }) => {
    const { data } = await Api.delete(`/aulaExperimental/${id}`);

    return data;
  },
};
