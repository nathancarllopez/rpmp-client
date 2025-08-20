import type {
  AllProteinInfo,
  AllVeggieCarbInfo,
  CarbToCook,
  ShopRowsByStore,
  ShopTemplateRow,
  StoreRow,
} from "@/types/rpmp-types";

export function fillShopSheetRows(
  storesInDisplayOrder: string[],
  templateRows: ShopTemplateRow[],
  veggieCarbs: AllVeggieCarbInfo,
  proteinInfo: AllProteinInfo
): {
  shopSheetRows: ShopRowsByStore;
  carbsToCook: CarbToCook[];
} {
  const shopSheetRows: ShopRowsByStore = new Map();
  const carbsToCook: {
    displayOrder: number;
    name: string;
    label: string;
    amountWithUnits: string;
    water: string | null;
    note: string | null;
  }[] = [];

  for (const storeName of storesInDisplayOrder) {
    const sortedRows: ShopTemplateRow[] = templateRows
      .filter((row) => row.storeName === storeName)
      .sort((a, b) => a.shopDisplayOrder - b.shopDisplayOrder);

    const filledRows: StoreRow[] = sortedRows.map((row) => {
      const { name, purchaseSize } = row;
      const filledRow = {
        ...row,
        label: row.shopLabel ?? row.label,
        quantity: 0,
        editable: purchaseSize === null
      };

      if (purchaseSize === null) {
        return filledRow;
      }

      if (Object.hasOwn(veggieCarbs, name)) {
        const { amount, ingredientType } = veggieCarbs[name];
        const quantityToPurchase = Math.ceil(amount / purchaseSize);
        filledRow.quantity = quantityToPurchase;

        // Client specified change: they want to cook all the non-rice carbs that they purchase
        if (ingredientType === "carbs") {
          const { units, cookDisplayOrder, cookLabel, waterMultiplier } =
            veggieCarbs[name];

          const amountToCook = name.toLowerCase().includes("rice")
            ? amount
            : quantityToPurchase * purchaseSize;
          const amountWithUnits = `${amountToCook} ${units}`;

          if (waterMultiplier === null) {
            carbsToCook.push({
              displayOrder: cookDisplayOrder ?? -1,
              name,
              label: cookLabel ?? "MISSING LABEL",
              amountWithUnits,
              water: null,
              note: null,
            });
          } else {
            const water = `${amountToCook * waterMultiplier} ${units}`;
            const note = `# cups x ${waterMultiplier} = Water`;
            const rowsToPush = [
              {
                displayOrder: cookDisplayOrder ?? -1,
                name,
                label: cookLabel ?? "MISSING LABEL",
                amountWithUnits,
                water,
                note: null,
              },
              {
                displayOrder: cookDisplayOrder ?? -1,
                name,
                label: cookLabel ?? "MISSING LABEL",
                amountWithUnits,
                water: null,
                note,
              },
            ];

            rowsToPush.forEach((row) => carbsToCook.push(row));
          }
        }
      } else if (Object.hasOwn(proteinInfo, name)) {
        const { totalWeightToCook } = proteinInfo[name];
        const roundedUpInLbs = Math.ceil(totalWeightToCook / 16);
        const quantityToPurchase = Math.ceil(roundedUpInLbs / purchaseSize);
        filledRow.quantity = quantityToPurchase;
      } else {
        throw new Error(`Unexpected name in store row: ${name}`);
      }

      return filledRow;
    });

    shopSheetRows.set(storeName, filledRows);
  }

  return { shopSheetRows, carbsToCook };
}

// import type {
//   IngredientAmounts,
//   ShopRowsByStore,
//   ShopTemplateRow,
//   StoreRow,
// } from "../../types/types";

// export function fillShopSheetRows(
//   storesInDisplayOrder: string[],
//   templateRows: ShopTemplateRow[],
//   veggieCarbs: IngredientAmounts,
//   proteins: IngredientAmounts
// ): { shopSheetRows: ShopRowsByStore; carbsToCook: IngredientAmounts } {
//   const shopSheetRows: ShopRowsByStore = new Map();
//   const carbsToCook: IngredientAmounts = {};

//   for (const storeName of storesInDisplayOrder) {
//     const sortedRows: ShopTemplateRow[] = templateRows
//       .filter((row) => row.storeName === storeName)
//       .sort((a, b) => a.shopDisplayOrder - b.shopDisplayOrder);

//     const filledRows: StoreRow[] = sortedRows.map((row) => {
//       const { name, purchaseSize } = row;
//       const filledRow = {
//         ...row,
//         label: row.shopLabel ?? row.label,
//         quantity: 0,
//       };

//       if (purchaseSize === null) {
//         return filledRow;
//       }

//       if (Object.hasOwn(veggieCarbs, name) || Object.hasOwn(proteins, name)) {
//         const infoObj = Object.hasOwn(veggieCarbs, name)
//           ? veggieCarbs[name]
//           : proteins[name];
//         const { amount, ingredientType } = infoObj;

//         const quantityToPurchase = Math.ceil(amount / purchaseSize);
//         filledRow.quantity = quantityToPurchase;

//         // Client specified change: they want to cook all the non-rice carbs that they purchase
//         if (ingredientType === "carbs") {
//           const amountToCook = name.toLowerCase().includes("rice")
//             ? amount
//             : quantityToPurchase * purchaseSize;

//           carbsToCook[name] = {
//             ...veggieCarbs[name],
//             amount: amountToCook,
//           };
//         }
//       }

//       return filledRow;
//     });

//     shopSheetRows.set(storeName, filledRows);
//   }

//   return { shopSheetRows, carbsToCook };
// }
