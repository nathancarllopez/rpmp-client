import type { ContainerSize, Order, OrderError } from "@/types/rpmp-types";

export function cleanParsedOrderData(
  rows: Record<string, string>[],
  headerMapping: { [name: string]: { label: string; rawLabel: string } },
  flavorMapping: {
    [rawLabel: string]: { flavor: string; flavorLabel: string };
  },
): {
  orders: Order[];
  cleaningErrors: Record<string, string>[];
  orderErrors: OrderError[];
} {
  const orders: Order[] = [];
  const cleaningErrors: Record<string, string>[] = [];
  const orderErrors: OrderError[] = [];

  if (rows.length === 0) {
    cleaningErrors.push({
      noRowsPassed: "",
    });
    return { orders, cleaningErrors, orderErrors };
  }

  const firstRow = rows[0];
  const requiredHeaders = Object.values(headerMapping).map(
    ({ rawLabel }) => rawLabel,
  );

  for (const header of requiredHeaders) {
    if (!Object.hasOwn(firstRow, header)) {
      cleaningErrors.push({
        missingHeader: header,
      });
    }
  }

  if (cleaningErrors.length > 0) {
    return { orders, cleaningErrors, orderErrors };
  }

  // This may be updated at some point to filter out certain rows depending on the client's wishes
  const filtered: Record<string, string>[] = rows.filter(() => true);

  filtered.forEach((row) => {
    const fullName =
      row[headerMapping.firstName.rawLabel] +
      " " +
      row[headerMapping.lastName.rawLabel];

    const itemName = row[headerMapping.itemName.rawLabel];
    const quantity = parseInt(row[headerMapping.quantity.rawLabel]);
    const { container, weight, issue } = getContainerAndWeight(itemName);

    if (container === null || weight === null) {
      cleaningErrors.push({
        containerOrWeight: issue || "",
      });
      return;
    }

    const rawFlavorText = row[headerMapping.flavor.rawLabel];
    const rawFlavorLabel = getRawFlavorLabel(rawFlavorText);
    const { flavor, flavorLabel } = flavorMapping[rawFlavorLabel];

    const proteinLabel = row[headerMapping.protein.rawLabel];
    const protein = getProteinName(proteinLabel);

    const order = {
      fullName,
      itemName,
      container,
      weight,
      flavor,
      flavorLabel,
      protein,
      proteinLabel,
      quantity,
    };

    for (const [key, value] of Object.entries(order)) {
      if (skipEmptyValueCheck(key)) continue;

      if (value === "") {
        orderErrors.push({
          error: null,
          message: `Order missing the following information: ${key}`,
          order,
        });
        return;
      }
    }

    orders.push(order);
  });

  return { orders, cleaningErrors, orderErrors };
}

function getContainerAndWeight(itemName: string): {
  container: ContainerSize | null;
  weight: number | null;
  issue: string | null;
} {
  // Captures, e.g., "2 lbs", "4.5oz", "3lb", and "17 oz"
  const pattern = /\b(\d+(\.\d+)?)\s?(lb|lbs|oz)\b/i;
  const matches = itemName.match(pattern);

  if (!matches) {
    console.log("Could not extract container size from item name");
    return {
      container: null,
      weight: null,
      issue: "Could not extract container size from item name",
    };
  }

  const match = matches[0].replace(" ", "").toLowerCase();
  if (match.includes("lb")) {
    const weightInOz =
      16 * parseFloat(match.replace("lbs", "").replace("lb", ""));
    return {
      container: "bulk",
      weight: weightInOz,
      issue: null,
    };
  } else if (["2.5oz", "4oz", "6oz", "8oz", "10oz"].includes(match)) {
    const weight = parseFloat(match.replace("oz", ""));
    return {
      container: match as ContainerSize,
      weight,
      issue: null,
    };
  }

  console.log(`Unexpected container size: ${match}`);
  return {
    container: null,
    weight: null,
    issue: `Unexpected container size: ${match}`,
  };
}

function getRawFlavorLabel(rawFlavorText: string): string {
  if (rawFlavorText === "" || rawFlavorText === "100% PLAIN-PLAIN") {
    return "COMPETITOR-PREP (100% PLAIN-PLAIN)";
  }
  if (rawFlavorText === "SPICY BISON") {
    return "SPICY BEEF BISON";
  }
  return rawFlavorText;
}

function getProteinName(proteinLabel: string): string {
  switch (proteinLabel) {
    case "Beef Bison":
    case "Egg Whites":
    case "Mahi Mahi": {
      const [first, second] = proteinLabel.split(" ");
      return first.toLowerCase() + second;
    }

    default: {
      return proteinLabel.toLowerCase();
    }
  }
}

function skipEmptyValueCheck(prop: string): boolean {
  return ["protein", "container", "weight", "quantity"].includes(prop);
}
