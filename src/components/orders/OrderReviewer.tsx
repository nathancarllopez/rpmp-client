import { fillShopSheetRows } from "@/business-logic/orders/fillShopSheetRows";
import { shopTemplateRowsOptions } from "@/tanstack-query/queries/shopTemplateRows";
import { storeInfoOptions } from "@/tanstack-query/queries/storeInfo";
import type { OrderReportInfo, StoreInfoRow } from "@/types/rpmp-types";
import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";

interface OrderReviewerProps {
  reviewOrderUrl: string;
  setReviewOrderUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  orderReportInfo: OrderReportInfo;
  setOrderReportInfo: React.Dispatch<React.SetStateAction<OrderReportInfo>>;
  setInfoHistory: React.Dispatch<React.SetStateAction<OrderReportInfo[]>>;
  toNextStep: () => void;
  toPrevStep: () => void;
}

export default function OrderReviewer({
  reviewOrderUrl,
  setReviewOrderUrl,
  orderReportInfo,
  setOrderReportInfo,
  setInfoHistory,
  toNextStep,
  toPrevStep,
}: OrderReviewerProps) {
  console.log(orderReportInfo);

  const { data: storesInDisplayOrder, error: storeError } = useSuspenseQuery({
    ...storeInfoOptions(),
    select: (data: StoreInfoRow[]) =>
      data
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(({ storeName }) => storeName),
  });

  const { data: templateStoreRows, error: templateError } = useSuspenseQuery(
    shopTemplateRowsOptions(),
  );

  const errors = [storeError, templateError].filter((err) => !!err);
  if (errors.length > 0) {
    return (
      <Stack mt={"md"}>
        {errors.map((err, index) => (
          <Text key={index}>{err.message}</Text>
        ))}
      </Stack>
    );
  }

  const handleBackClick = () => {
    setReviewOrderUrl(undefined);
    toPrevStep();
  };

  const handleEditShopClick = () => {
    const {
      stats: { veggieCarbs },
      proteinInfo,
    } = orderReportInfo;

    const { shopSheetRows, carbsToCook } = fillShopSheetRows(
      storesInDisplayOrder,
      templateStoreRows,
      veggieCarbs,
      proteinInfo,
    );

    setOrderReportInfo((curr) => ({
      ...curr,
      shopSheetRows,
      cookSheetInfo: {
        ...curr.cookSheetInfo,
        carbsToCook,
      },
    }));
    setInfoHistory((curr) => [...curr, { ...orderReportInfo }]);
    toNextStep();
  };

  return (
    <Stack mt={"md"}>
      <Group grow>
        <Button onClick={handleBackClick}>Back to Upload</Button>
        <Button onClick={handleEditShopClick}>Edit Shop Sheet</Button>
      </Group>

      <Box h={{ sm: 800, base: 700 }}>
        <iframe
          src={`${reviewOrderUrl}#toolbar=0`}
          title="Order Review PDF"
          width="100%"
          height="100%"
          style={{ border: "1px solid #ccc" }}
        />
      </Box>
    </Stack>
  );
}
