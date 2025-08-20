import type { AllBackstockRow } from "@/types/rpmp-types";

export function chooseBackstockWeights(
  allBackstock: AllBackstockRow[],
  name: string,
  subName: string | undefined,
  weight: number
): AllBackstockRow[] | null {
  const validBackstock = allBackstock.filter((row) => {
    let goodRow = !row.claimed && row.weight <= weight && row.name === name;

    if (subName) {
      goodRow = goodRow && row.subName === subName;
    }

    return goodRow;
  });
  if (validBackstock.length === 0) return null;

  // Iterate over subsets using binary strings
  const validSubsets: { total: number; subset: AllBackstockRow[] }[] = [];
  for (let i = 1; i < 2 ** validBackstock.length; i++) {
    const subsetInstructions = i
      .toString(2)
      .padStart(validBackstock.length, "0");
    const subset: AllBackstockRow[] = [];
    let subsetTotal = 0;

    for (let j = 0; j < subsetInstructions.length; j++) {
      if (subsetInstructions[j] === "1") {
        subsetTotal += validBackstock[j].weight;
        subset.push(validBackstock[j]);
      }
    }

    if (subsetTotal <= weight) {
      validSubsets.push({
        total: subsetTotal,
        subset: subset,
      });
    }
  }
  if (validSubsets.length === 0) return null;

  const largeSubsets: AllBackstockRow[][] = [];
  let currLargestWeight = 0;
  for (const { total, subset } of validSubsets) {
    if (total >= currLargestWeight) {
      if (total > currLargestWeight) {
        currLargestWeight = total;
        largeSubsets.length = 0;
      }
      largeSubsets.push(subset);
    }
  }

  // We may not find a unique subset, so we just make a random choice
  const randomIndex = Math.floor(Math.random() * largeSubsets.length);
  const backstockWeights = largeSubsets[randomIndex];

  return backstockWeights;
}