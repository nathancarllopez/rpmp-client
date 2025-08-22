import { Box, Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getRouteApi } from "@tanstack/react-router";
import type {
  InsertOrderHistoryRow,
  OrderReportInfo,
} from "@/types/rpmp-types";
import { useMarkBackstockUnavailableMutation } from "@/tanstack-query/mutations/markBackstockUnavailable";
import { useInsertOrderHistoryMutation } from "@/tanstack-query/mutations/insertOrderHistory";

interface OrderDisplayProps {
  orderReportInfo: OrderReportInfo;
  reportUrl: string;
  toNextStep: () => void;
  toPrevStep: () => void;
}

export default function ReportDisplay({
  orderReportInfo,
  reportUrl,
  toNextStep,
  toPrevStep,
}: OrderDisplayProps) {
  const markBackstockMutation = useMarkBackstockUnavailableMutation();
  const insertOrderHistoryMutation = useInsertOrderHistoryMutation();

  const { userId } = getRouteApi(
    "/dashboard/_orders/process-order",
  ).useRouteContext();

  const handleSaveDownloadClick = () => {
    let noBackstockError = true;

    markBackstockMutation.mutate(orderReportInfo.usedBackstockIds, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Backstock Rows Updated!",
          message: "The backstock has been updated",
        });
      },
      onError: (error) => {
        noBackstockError = false;
        console.warn("Error saving changes: ", error.message);
        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Changes not saved",
          message: error.message,
        });
      },
    });

    if (noBackstockError) {
      const insertOrderRow: InsertOrderHistoryRow = {
        added_by: userId,
        data: JSON.parse(JSON.stringify(orderReportInfo)),
      };

      insertOrderHistoryMutation.mutate(insertOrderRow, {
        onSuccess: () => {
          notifications.show({
            withCloseButton: true,
            color: "green",
            title: "Order Saved!",
            message: "The order data has been saved",
          });
          toNextStep();
        },
        onError: (error) => {
          console.warn("Error saving order: ", error.message);
          notifications.show({
            withCloseButton: true,
            color: "red",
            title: "Saving Order Failed",
            message: error.message,
          });
        },
      });
    }
  };

  return (
    <Stack mt={"md"}>
      <Group grow>
        <Button onClick={toPrevStep}>Back to Edit</Button>
        <Button
          component={"a"}
          href={reportUrl}
          download={`order-${new Date().toLocaleDateString()}`}
          onClick={handleSaveDownloadClick}
        >
          Save and Download
        </Button>
      </Group>

      <Box h={{ sm: 800, base: 700 }}>
        <iframe
          src={`${reportUrl}#toolbar=0`}
          title="Order Report PDF"
          width="100%"
          height="100%"
          style={{ border: "1px solid #ccc" }}
        />
      </Box>
    </Stack>
  );
}
