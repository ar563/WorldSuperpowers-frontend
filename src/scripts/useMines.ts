import useAxios from "axios-hooks";

import { constants, Mine } from "misc";

export const useMines = (config: { province?: number }) => {
  const [
    { data: goldMines, loading: loadingGoldMines, error: goldMinesError },
    refetchGoldMines,
  ] = useAxios<Mine[]>({
    url: `/buildings_by_province/${config.province}/gold_mines`,
    baseURL: constants.BASE_URL,
  });
  const [
    { data: oilFields, loading: loadingOilFields, error: oilFieldsError },
    refetchOilFields,
  ] = useAxios<Mine[]>({
    url: `/buildings_by_province/${config.province}/oil_fields`,
    baseURL: constants.BASE_URL,
  });
  const [
    { data: gasPlants, loading: loadingGasPlants, error: gasPlantsError },
    refetchGasPlants,
  ] = useAxios<Mine[]>({
    url: `/buildings_by_province/${config.province}/gas_plants`,
    baseURL: constants.BASE_URL,
  });
  const [
    { data: ironMines, loading: loadingIronMines, error: ironMinesError },
    refetchIronMines,
  ] = useAxios<Mine[]>({
    url: `/buildings_by_province/${config.province}/iron_mines`,
    baseURL: constants.BASE_URL,
  });

  return {
    mines: { goldMines, oilFields, gasPlants, ironMines },
    isLoadingMines:
      loadingGoldMines ||
      loadingOilFields ||
      loadingGasPlants ||
      loadingIronMines,
    minesError: {
      goldMines: goldMinesError,
      oilFields: oilFieldsError,
      gasPlants: gasPlantsError,
      ironMines: ironMinesError,
    },
    refetchMines: {
      goldMines: refetchGoldMines,
      oilFields: refetchOilFields,
      gasPlants: refetchGasPlants,
      ironMines: refetchIronMines,
      all: () => {
        refetchGoldMines();
        refetchOilFields();
        refetchGasPlants();
        refetchIronMines();
      },
    },
  };
};
