import type { AllProteinInfo, Meal } from "@/types/rpmp-types";

export function updateProteinWeights(
  initialProteinInfo: AllProteinInfo,
  meals: Meal[]
): {
  proteinInfo: AllProteinInfo,
  bisonCubes: number
} {
  const proteinInfo = { ...initialProteinInfo };

  // Add the weightToCook and weightLbOz to proteinInfo
  meals.forEach((meal) => {
    const { protein, flavor, weightToCook, weightLbOz } = meal;
    proteinInfo[protein].flavorInfo[flavor] = {
      ...proteinInfo[protein].flavorInfo[flavor],
      weightToCook,
      weightLbOz,
    };
  });

  // Calculate total protein weight across flavors
  const allProteins = Object.keys(proteinInfo);
  for (const protein of allProteins) {
    const { flavorInfo } = proteinInfo[protein];
    const allFlavors = Object.keys(flavorInfo);

    const totalWeightToCook = allFlavors.reduce((amt, flavor) => {
      const { weightToCook } = flavorInfo[flavor];
      return amt + weightToCook;
    }, 0);

    proteinInfo[protein].totalWeightToCook = totalWeightToCook;
  }

  // Split beefBison into beef and bison: client wants 1.25 pounds of bison for every 10 pounds of beef because they buy "cubes" of bison which each weight 1.25 pounds
  const beefBisonInLbs = proteinInfo["beefBison"].totalWeightToCook / 16;
  const { bisonCubes, beefWeight, bisonWeight } = splitBeefBison(beefBisonInLbs);

  const fixBeefBisonWeights = (protein: "beef" | "bison", weightInLbs: number) => {
    const totalWeightToCook = weightInLbs * 16;

    proteinInfo[protein] = { ...proteinInfo[protein], totalWeightToCook };
  }
  fixBeefBisonWeights("beef", beefWeight);
  fixBeefBisonWeights("bison", bisonWeight);

  return { proteinInfo, bisonCubes };
}

function splitBeefBison(beefBisonWeight: number): {
  bisonCubes: number,
  beefWeight: number,
  bisonWeight: number
} {
  const roundAtTensPlace = (weight: number) => 10 * Math.round(weight / 10);

  const roundedBeefBison = roundAtTensPlace(beefBisonWeight);
  const firstCubeCount = roundedBeefBison / 10;
  const firstBison = firstCubeCount * 1.25;
  const firstBeef = beefBisonWeight - firstBison;

  if (roundAtTensPlace(firstBeef) === roundedBeefBison) {
    return {
      bisonCubes: firstCubeCount,
      beefWeight: firstBeef,
      bisonWeight: firstBison,
    };
  }

  const bisonCubes = firstCubeCount - 1;
  const beefWeight = bisonCubes * 1.25;
  return {
    bisonCubes,
    beefWeight,
    bisonWeight: beefBisonWeight - beefWeight,
  };
}