import api from "./api";

export const getStatement = async (
  module,

  type,

  financialYear,

  month,

  year,

  from,

  to,
) => {
  return await api.get(
    "/statement",

    {
      params: {
        module,

        type,

        financialYear,

        month,

        year,

        from,

        to,
      },
    },
  );
};
