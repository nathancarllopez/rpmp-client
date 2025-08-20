import type { AllProteinInfo, FlavorInfoWithCalcs, OrderReportInfo, ProteinRow, StoreRow } from "@/types/rpmp-types";

export function getBlankOrderReportInfo(
  proteinRows: ProteinRow[],
  proteinError: Error | null,
): OrderReportInfo {
  if (proteinError) throw proteinError;

  const proteinInfo: AllProteinInfo = proteinRows.reduce((info, row) => {
    const { name, flavors } = row;

    const flavorInfo = flavors.reduce((fInfo, fRow) => {
      const { name: flavor } = fRow;

      fInfo[flavor] = {
        ...fRow,
        orderedWeight: 0,
        weightToCook: 0,
        weightLbOz: "",
        cookedTeriyaki: null,
        sauce: null
      };

      return fInfo;
    }, {} as Record<string, FlavorInfoWithCalcs>)

    info[name] = {
      ...row,
      flavorInfo,
      totalWeightToCook: 0
    };

    return info;
  }, {} as AllProteinInfo);

  const initialInfo = {
    orders: [],
    orderErrors: [],
    usedBackstockIds: new Set<number>(),
    meals: [],
    stats: {
      numOrders: 0,
      numMeals: 0,
      numVeggieMeals: 0,
      numThankYouBags: 0,
      totalProteinWeight: 0,
      containers: {},
      proteins: {},
      veggieCarbs: {}
    },
    pullListInfo: {
      extraRoastedVeggies: 0,
      pullRows: []
    },
    shopSheetRows: new Map<string, StoreRow[]>(),
    cookSheetInfo: {
      numTeriyakiCuppies: 0,
      proteinCubes: {},
      carbsToCook: [],
    },
    proteinInfo,
  }

  return initialInfo;
}