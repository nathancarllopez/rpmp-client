import type {
  AllBackstockRow,
  AllProteinInfo,
  Meal,
  Order,
  OrderError,
} from "@/types/rpmp-types";
import { chooseBackstockWeights } from "./chooseBackstockWeights";

export function calculateMealRows(
  orders: Order[],
  proteinInfo: AllProteinInfo,
  proteinBackstock: AllBackstockRow[]
): {
  orderErrors: OrderError[];
  usedBackstockIds: Set<number>;
  meals: Meal[];
} {
  const orderErrors: OrderError[] = [];
  const usedBackstockIds: Set<number> = new Set();

  // Aggregate orders into proteinWeights by protein and then flavor
  for (const order of orders) {
    // Extract the order information
    const { quantity, protein, weight, flavor } = order;

    // Skip ingredient calculations for pure veggie/carb meals
    // To do: Revisit this with the client. Where should this data go?
    if (protein === "") continue;

    // Calculate aggregate totals for each protein&flavor combo and add to proteinInfo
    const orderWeight = weight * quantity;
    const { flavorInfo } = proteinInfo[protein];
    const { orderedWeight: weightSoFar } = flavorInfo[flavor];

    const orderedWeight = weightSoFar + orderWeight;
    proteinInfo[protein].flavorInfo[flavor].orderedWeight = orderedWeight;
  }

  // Initialize the meals objects
  const initialMeals: Meal[] = [];
  const sortedProteins = Object.keys(proteinInfo).sort().filter((protein) => protein !== "beef" && protein !== "bison");
  for (const protein of sortedProteins) {
    const { displayColor, shrink, label: proteinLabel } = proteinInfo[protein];
    const shrinkMultiplier = 1 + shrink / 100;
    const sortedFlavors = Object.keys(proteinInfo[protein].flavorInfo).sort();

    for (const flavor of sortedFlavors) {
      const { label: flavorLabel, orderedWeight } =
        proteinInfo[protein].flavorInfo[flavor];

      const weightToCook = orderedWeight * shrinkMultiplier;
      initialMeals.push({
        protein,
        proteinLabel,
        flavor,
        flavorLabel,
        orderedWeight: orderedWeight,
        weightAfterBackstock: orderedWeight,
        weightToCook,
        weightLbOz: getLbOzWeight(weightToCook),
        backstockWeight: 0,
        displayColor,
      });
    }
  }

  // Use backstock to offset the amount needed to cook by matching protein and flavor exactly
  const mealsWithBackstockAdjustments = initialMeals.map((meal) => {
    const { protein, flavor, orderedWeight } = meal;
    const backstockRows = chooseBackstockWeights(
      proteinBackstock,
      protein,
      flavor,
      orderedWeight
    );

    if (backstockRows === null) return meal;

    let weightAfterBackstock = orderedWeight;
    let backstockWeight = 0;
    backstockRows.forEach((row) => {
      usedBackstockIds.add(row.id);
      weightAfterBackstock -= row.weight;
      backstockWeight += row.weight;
    });

    const { shrink } = proteinInfo[protein];
    const shrinkMultiplier = 1 + shrink / 100;
    const weightToCook = weightAfterBackstock * shrinkMultiplier;

    return {
      ...meal,
      weightAfterBackstock,
      weightToCook,
      weightLbOz: getLbOzWeight(weightToCook),
      backstockWeight,
    };
  });

  // Use backstock again to offset the amount as above, except use base flavors (e.g., sriracha chicken is made from s.p. chicken)
  const meals = mealsWithBackstockAdjustments.map((meal) => {
    const { protein, flavor } = meal;
    const { baseName: baseFlavor } = proteinInfo[protein].flavorInfo[flavor];

    if (meal.weightAfterBackstock === 0 || baseFlavor === flavor) return meal;

    const matchingBackstock = proteinBackstock.filter(
      (row) =>
        !usedBackstockIds.has(row.id) &&
        row.name === protein &&
        row.subName === flavor
    );

    const backstockRows = chooseBackstockWeights(
      matchingBackstock,
      protein,
      baseFlavor,
      meal.weightAfterBackstock
    );

    if (backstockRows === null) return meal;

    let weightAfterBackstock = meal.weightAfterBackstock;
    let backstockWeight = meal.backstockWeight;
    backstockRows.forEach((row) => {
      usedBackstockIds.add(row.id);
      weightAfterBackstock -= row.weight;
      backstockWeight += row.weight;
    });

    const { shrink } = proteinInfo[protein];
    const shrinkMultiplier = 1 + shrink / 100;
    const weightToCook = weightAfterBackstock * shrinkMultiplier;

    return {
      ...meal,
      weightAfterBackstock,
      weightToCook,
      weightLbOz: getLbOzWeight(weightToCook),
      backstockWeight,
    };
  });

  return { orderErrors, usedBackstockIds, meals };
}

function getLbOzWeight(oz: number): string {
  const lbs = Math.floor(oz / 16);
  const remainingOz = Math.ceil(oz % 16);

  if (remainingOz === 16) {
    return lbs === 0 ? "1lb 0oz" : `${lbs + 1}lbs 0oz`;
  }

  return lbs === 1 ? `1lb ${remainingOz}oz` : `${lbs}lbs ${remainingOz}oz`;
}