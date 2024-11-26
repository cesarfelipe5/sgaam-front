import { Api } from "../api";

export const RelatorioService = {
  getData: async ({
    periodo = undefined,
    startDate = undefined,
    endDate = undefined,
  }) => {
    let params = ""; //`periodo=${periodo}&startDate=${startDate}&endDate=${endDate}`

    if (periodo) {
      params = params + `periodo=${periodo}`;
    } else {
      params = params + `startDate=${startDate}&endDate=${endDate}`;
    }

    const { data } = await Api.get(`/relatorios?${params}`);

    return data;
  },
};
