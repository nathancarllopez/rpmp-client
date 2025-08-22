import {
  Affix,
  Box,
  Button,
  CloseButton,
  Dialog,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import type {
  OrderReportInfo,
  ShopRowsByStore,
  StoreRow,
} from "@/types/rpmp-types";
import { Fragment, useMemo } from "react";
import ShopEditorRow from "./ShopEditorRow";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useToggle } from "@mantine/hooks";
import { storeInfoOptions } from "@/tanstack-query/queries/storeInfo";
import { pullListOptions } from "@/tanstack-query/queries/pullList";
import fetchReportUrl from "@/api/fetchReportUrl";

const headersInfo = [
  { id: "label", label: "Name" },
  { id: "quantity", label: "Quantity" },
  { id: "purchaseLabel", label: "Purchase" },
  { id: "price", label: "Price" },
];

interface ShopEditorProps {
  reviewOrderUrl: string;
  orderReportInfo: OrderReportInfo;
  setOrderReportInfo: React.Dispatch<React.SetStateAction<OrderReportInfo>>;
  setReportUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  setInfoHistory: React.Dispatch<React.SetStateAction<OrderReportInfo[]>>
  toNextStep: () => void;
  backToUpload: () => void;
}

export default function ShopEditor({
  reviewOrderUrl,
  orderReportInfo,
  setOrderReportInfo,
  setReportUrl,
  setInfoHistory,
  toNextStep,
  backToUpload,
}: ShopEditorProps) {
  const [orderViewVisible, toggle] = useToggle();

  const { shopSheetRows } = orderReportInfo;

  const {
    storeError,
    storeNames,
    storeLabels,
    pullTemplateRows,
    pullRowsError,
  } = useQueryData();

  const originalQuantities: Record<string, number[]> = useMemo(
    () =>
      storeNames.reduce(
        (quantities, storeName) => {
          const storeRows = shopSheetRows.get(storeName);
          if (storeRows === undefined) {
            throw new Error(
              `Could not find store rows for this store: ${storeName}`
            );
          }

          quantities[storeName] = storeRows.map(({ quantity }) => quantity);

          return quantities;
        },
        {} as Record<string, number[]>
      ),
    [storeNames]
  );

  const errors = [storeError, pullRowsError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack mt={"md"}>
        <Group grow>
          <Button onClick={backToUpload} variant="default">
            Back to Upload
          </Button>
          <Button disabled variant="default">
            Reset Data
          </Button>
          <Button variant={"default"} disabled>
            Submit Changes
          </Button>
        </Group>

        <Paper>
          <Text>Error fetching store info:</Text>
          {errors.map((error, index) => (
            <Text key={index}>{error.message}</Text>
          ))}
        </Paper>
      </Stack>
    );
  }

  const quantitesHaveChanged: boolean = storeNames.some((storeName) => {
    const storeRows = shopSheetRows.get(storeName);
    if (storeRows === undefined) {
      throw new Error(`Could not find store rows for this store: ${storeName}`);
    }

    const ogStoreQuantities = originalQuantities[storeName];

    return storeRows.some((row, index) => {
      const { quantity } = row;
      const ogQuantity = ogStoreQuantities[index];

      return ogQuantity !== quantity;
    });
  });

  const handleResetClick = () =>
    setOrderReportInfo((curr) => {
      const { shopSheetRows: currShopRows } = curr;
      const newShopRows: ShopRowsByStore = new Map();

      for (const storeName of storeNames) {
        const currRows = currShopRows.get(storeName);
        if (currRows === undefined) {
          console.warn(currShopRows);
          throw new Error(
            `Could not find store rows for this store: ${storeName}`
          );
        }

        const newRows = currRows.map((row, index) => {
          const ogQuantity = originalQuantities[storeName][index];

          return {
            ...row,
            quantity: ogQuantity,
          };
        });

        newShopRows.set(storeName, newRows);
      }

      return {
        ...curr,
        shopSheetRows: newShopRows,
      };
    });

  const handleSubmitClick = async () => {
    const { shopSheetRows } = orderReportInfo;

    const updatedInfo: OrderReportInfo = {
      ...orderReportInfo,
      pullListInfo: {
        ...orderReportInfo.pullListInfo,
        pullRows: pullTemplateRows,
      },
      shopSheetRows,
    };

    const url = await fetchReportUrl(updatedInfo);

    setOrderReportInfo(updatedInfo);
    setInfoHistory((curr) => [ ...curr, { ...orderReportInfo }])
    setReportUrl(url);

    toNextStep();
  };

  const handleQuantityUpdate = (
    newQuantity: number,
    storeName: string,
    index: number
  ) =>
    setOrderReportInfo((curr) => {
      const { shopSheetRows: currShopRows } = curr;

      const currRows = currShopRows.get(storeName);
      if (currRows === undefined) {
        console.warn(currShopRows);
        throw new Error(
          `Could not find store rows for this store: ${storeName}`
        );
      }

      const currRow = currRows[index];
      if (currRow === undefined) {
        console.warn(currRows);
        throw new Error(`Could not find row at this index: ${index}`);
      }

      const newRow: StoreRow = { ...currRow, quantity: newQuantity };

      const newRows: StoreRow[] = [...currRows];
      newRows[index] = newRow;

      const newShopRows: ShopRowsByStore = new Map(currShopRows);
      newShopRows.set(storeName, newRows);

      return {
        ...curr,
        shopSheetRows: newShopRows,
      };
    });

  return (
    <Stack mt={"md"}>
      <Group grow>
        <Button onClick={backToUpload} variant="default">
          Back to Upload
        </Button>
        <Tooltip disabled={quantitesHaveChanged} label="No changes detected">
          <Button
            disabled={!quantitesHaveChanged}
            onClick={handleResetClick}
            variant="default"
          >
            Reset Data
          </Button>
        </Tooltip>
        <Button variant={"default"} onClick={handleSubmitClick}>
          {quantitesHaveChanged ? "Submit Changes" : "Submit without Changes"}
        </Button>
      </Group>

      {orderViewVisible ? (
        <Dialog
          opened={orderViewVisible}
          withBorder
          onClose={toggle}
          size={window.innerWidth * 0.66}
          pt={0}
        >
          <Group>
            <CloseButton
              onClick={() => toggle()}
              ms={"auto"}
              size={"xl"}
              mb={"sm"}
            />
          </Group>
          <Box h={window.innerHeight / 2}>
            <iframe
              src={`${reviewOrderUrl}`}
              title="Order Review PDF"
              width="100%"
              height="100%"
              style={{ border: "1px solid #ccc" }}
            />
          </Box>
        </Dialog>
      ) : (
        <Affix position={{ bottom: 50, right: 50 }}>
          <Button color="blue" variant="filled" onClick={() => toggle()}>
            Click to view orders
          </Button>
        </Affix>
      )}

      <Paper pt={"xs"}>
        <Table
          stickyHeader
          highlightOnHover
          horizontalSpacing={"sm"}
          verticalSpacing={"sm"}
        >
          <Table.Tbody>
            {storeNames.map((storeName, index) => (
              <Fragment key={index}>
                <Table.Tr>
                  <Table.Td colSpan={headersInfo.length}>
                    <Title order={2}>{storeLabels[index]}</Title>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  {headersInfo.map((item) => (
                    <Table.Th key={item.id} style={{ whiteSpace: "nowrap" }}>
                      {item.label}
                    </Table.Th>
                  ))}
                </Table.Tr>
                {(shopSheetRows.get(storeName) ?? []).map((row, index) => (
                  <ShopEditorRow
                    key={index}
                    storeRow={row}
                    headersInfo={headersInfo}
                    onQuantityChange={(newQuantity: number) =>
                      handleQuantityUpdate(newQuantity, storeName, index)
                    }
                  />
                ))}
              </Fragment>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}

function useQueryData() {
  const { data: storeInfo, error: storeError } =
    useSuspenseQuery(storeInfoOptions());
  const { storeNames, storeLabels } = storeInfo.reduce(
    (reduction, info) => {
      reduction.storeNames.push(info.storeName);
      reduction.storeLabels.push(info.storeLabel);

      return reduction;
    },
    { storeNames: [], storeLabels: [] } as {
      storeNames: string[];
      storeLabels: string[];
    }
  );

  const { data: pullTemplateRows, error: pullRowsError } =
    useSuspenseQuery(pullListOptions());


  return {
    storeError,
    storeNames,
    storeLabels,
    pullTemplateRows,
    pullRowsError,
  };
}