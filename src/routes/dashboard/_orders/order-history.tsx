import fetchReportUrl from "@/api/fetchReportUrl";
import LoadingScreen from "@/components/misc/LoadingScreen";
import { orderHistoryOptions } from "@/tanstack-query/queries/orderHistory";
import { Box, Button, Paper, Select, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard/_orders/order-history")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(orderHistoryOptions());
  },
  pendingComponent: LoadingScreen,
  component: OrderHistory,
});

function OrderHistory() {
  const [selected, setSelected] = useState<string>("");
  const [displayedUrl, setDisplayedUrl] = useState<string | null>(null);

  const { data: orderHistoryRows, error: orderError } = useSuspenseQuery(
    orderHistoryOptions(),
  );
  const selectData = useMemo(
    () =>
      orderHistoryRows.map((row) => ({
        value: row.id.toString(),
        label: new Date(row.createdAt).toLocaleString(),
      })),
    [orderHistoryRows],
  );

  const errors = [orderError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Title>Order History</Title>

        <Paper>
          <Text>Errors fetching order history info:</Text>
          {errors.map((error, index) => (
            <Text key={index}>{error.message}</Text>
          ))}
        </Paper>
      </Stack>
    );
  }

  const handleSelectChange = async (value: string | null) => {
    setSelected(value ?? "");

    if (value === null) {
      setDisplayedUrl(null);
    }

    const ordersMatch = orderHistoryRows.find(
      (row) => row.id === Number(value),
    );
    if (ordersMatch === undefined) {
      console.warn("Could not find matching order for this row id:");
      console.warn(value);
      console.warn(orderHistoryRows);

      throw new Error("No order history match");
    }

    const orderReportInfo = ordersMatch.data;
    const url = await fetchReportUrl(orderReportInfo);
    setDisplayedUrl(url);
  };

  return (
    <Stack>
      <Title>Order History</Title>

      <Tooltip disabled={selectData.length > 0} label="No previous orders found">
        <Select
          allowDeselect={false}
          checkIconPosition="right"
          placeholder="Select Date"
          data={selectData}
          value={selected}
          onChange={handleSelectChange}
        />
      </Tooltip>

      <Button
        component="a"
        href={displayedUrl ?? undefined}
        download={`archived-order`}
        disabled={displayedUrl === null}
      >
        Download
      </Button>

      {displayedUrl !== null && (
        <Box h={{ sm: 800, base: 700 }}>
          <iframe
            src={`${displayedUrl}#toolbar=0`}
            title="Orders PDF"
            width="100%"
            height="100%"
            style={{ border: "1px solid #ccc" }}
          />
        </Box>
      )}
    </Stack>
  );
}
