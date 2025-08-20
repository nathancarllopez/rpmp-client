import type {
  AllBackstockRow,
  AllProteinInfo,
  AllVeggieCarbInfo,
  Order,
  OrderStatistics,
  VeggieCarbInfoRow,
} from "@/types/rpmp-types";
import { chooseBackstockWeights } from "./chooseBackstockWeights";

export default function calculateStats(
  initialStats: OrderStatistics,
  orders: Order[],
  proteinInfo: AllProteinInfo,
  veggieCarbInfoRows: VeggieCarbInfoRow[],
  veggieCarbBackstock: AllBackstockRow[],
  usedBackstockIds: Set<number>
): { 
  stats: OrderStatistics, 
  extraRoastedVeggies: number 
} {
  const stats: OrderStatistics = { ...initialStats };
  let extraRoastedVeggies = 0;
  const orderCountByName: { [fullName: string]: number } = {};

  // Get counts and containers
  for (const order of orders) {
    const { fullName, quantity, container } = order;

    // Track the orders by name
    if (orderCountByName[fullName]) {
      orderCountByName[fullName] += quantity;
    } else {
      orderCountByName[fullName] = quantity;
    }

    // Update the meal and container count
    stats.numMeals += quantity;
    if (!stats.containers[container]) {
      stats.containers[container] = 0;
    }
    stats.containers[container] += quantity;
  }

  // Number of orders = number of unique names on order sheet
  // Number of thank you bags = 1 per 14 meals for each order
  stats.numOrders = Object.keys(orderCountByName).length;
  stats.numThankYouBags = Object.values(orderCountByName).reduce(
    (count, orderCount) => {
      return count + Math.ceil(orderCount / 14);
    },
    0
  );

  // Calculate ingredient amounts of proteins for stats
  const allProteins = Object.keys(proteinInfo);
  for (const protein of allProteins) {
    // On stats sheet, beefBison is split into beef and bison, so we skip that one
    if (protein === "beefBison") continue;

    const { label, totalWeightToCook, lbsPer } = proteinInfo[protein];
    const amountInLbs = totalWeightToCook / 16;

    stats.proteins[protein] = {
      label,
      amount: amountInLbs,
      lbsPer,
      units: "lbs",
      ingredientType: "proteins"
    }
  }

  // Add two pounds to sirloin to account for trimmed fat
  stats.proteins["sirloin"].amount += 2;
  proteinInfo["sirloin"].totalWeightToCook += 32;

  // Collect total protein weight
  stats.totalProteinWeight = Object.keys(stats.proteins).reduce(
    (total, key) => {
      const { amount } = stats.proteins[key];
      return total + Math.ceil(amount);
    },
    0
  );

  // Add the starting veggie and carb data using stats.mealCount. The amounts column contains how many units of each veggie and carb should be used for each meal count threshold
  stats.veggieCarbs = veggieCarbInfoRows.reduce((result, vcRow) => {
    const maxKey = Object.keys(vcRow.amounts).reduce(
      (max, curr) => Math.max(max, Number(curr)),
      0
    );
    const amountKey = Number(
      Object.keys(vcRow.amounts)
        .sort((a, b) => Number(a) - Number(b))
        .find((key) => Number(key) >= stats.numMeals) || maxKey
    );
    const amount = vcRow.amounts[amountKey];

    const { label, lbsPer, units, cookDisplayOrder, cookLabel, waterMultiplier } = vcRow;
    result[vcRow.name] = {
      label,
      amount,
      lbsPer,
      units,
      ingredientType: vcRow.isVeggie ? "veggies" : "carbs",
      cookDisplayOrder,
      cookLabel,
      waterMultiplier
    };
    return result;
  }, {} as AllVeggieCarbInfo);

  // Adjust the amount of roasted veggies from the amount of beefBison with the fajita flavor: client wants an extra unit of roasted veggies per ten pounds of beefBison fajita (rounded up)
  const { orderedWeight } = proteinInfo["beefBison"].flavorInfo["fajita"];
  if (orderedWeight > 0) {
    const oldRoastedVeggies = stats.veggieCarbs["roastedVeggies"];
    const oldAmount = oldRoastedVeggies.amount;
    extraRoastedVeggies = Math.ceil(orderedWeight / 160);

    stats.veggieCarbs = {
      ...stats.veggieCarbs,
      roastedVeggies: {
        ...oldRoastedVeggies,
        amount: oldAmount + extraRoastedVeggies,
      },
    };
  }

  // Make backstock adjustments for veggies and carbs
  const veggieCarbKeys = Object.keys(stats.veggieCarbs);
  for (const veggieCarb of veggieCarbKeys) {
    const { amount } = stats.veggieCarbs[veggieCarb];

    // Client specified change: if there are more Yams in backstock than ordered this week, then it isn't cost effective to defrost the backstock Yams and not use the extra weight. But, not using backstock means buying 40 more lbs of Yams (they only come in that size) which could be even more costly. So, if there is a way to pull backstock so that the extra weight is at most 5 lbs, then they're willing to absorb that loss.
    const backstockRows =
      veggieCarb === "yams"
        ? chooseBackstockWeights(
            veggieCarbBackstock,
            veggieCarb,
            undefined,
            amount + 5
          )
        : chooseBackstockWeights(
            veggieCarbBackstock,
            veggieCarb,
            undefined,
            amount
          );

    if (backstockRows === null) continue;

    let afterBackstockAmount = amount;
    for (const row of backstockRows) {
      afterBackstockAmount -= row.weight;
      usedBackstockIds.add(row.id);
    }

    stats.veggieCarbs[veggieCarb].amount = afterBackstockAmount;
  }

  return { stats, extraRoastedVeggies };
}
