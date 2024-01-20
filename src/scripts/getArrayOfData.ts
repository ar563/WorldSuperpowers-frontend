import axios from "axios";

import { constants } from "misc";

export const getArrayOfData = async <T>(params: { params: string[] }) => {
  const response = params.params.map(async (url) => {
    const requestConfig = {
      url,
      baseURL: constants.BASE_URL,
    };
    const response = await axios.request<T[]>(requestConfig);
    return response.data;
  });

  return Promise.all(response)
    .then((profiles) => profiles.flat().filter((profile): profile is T => true))
    .catch((error) => console.error(error));
};
