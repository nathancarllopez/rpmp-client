import { useInsertTimecardHistoryMutation } from "@/tanstack-query/mutations/insertTimecardHistory";
import { timecardHistoryOptions } from "@/tanstack-query/queries/timecardHistory";
import type { InsertTimecardHistoryRow, TimecardValues } from "@/types/rpmp-types";
import { Box, Button, Group, Paper, Stack, Table, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

interface TimecardsDisplayProps {
  timecardsData: TimecardValues[];
  timecardsUrl: string;
  setTimecardsUrl: React.Dispatch<React.SetStateAction<string | null>>;
  toPrevStep: () => void;
  toNextStep: () => void;
}

export default function TimecardsDisplay({
  timecardsData,
  timecardsUrl,
  setTimecardsUrl,
  toPrevStep,
  toNextStep,
}: TimecardsDisplayProps) {
  const { data: latestTimecardHistory, error: timecardError } =
    useSuspenseQuery({
      ...timecardHistoryOptions(),
      select: (data) => {
        if (data.length === 0) return null;

        const latestTimecardHistory = data.reduce((latest, row) => {
          const [latestTimestamp, rowTimestamp] = [latest, row].map((x) =>
            new Date(x.createdAt).getTime()
          );
          return rowTimestamp >= latestTimestamp ? row : latest;
        });

        return latestTimecardHistory;
      },
    });
  const summaryTableData: {
    date: string;
    regPay: string;
    overtimePay: string;
    total: string;
  }[] = [
    getSummaryData(timecardsData, "Today"),
    getSummaryData(
      latestTimecardHistory ? latestTimecardHistory.data : null,
      latestTimecardHistory ? new Date(latestTimecardHistory.createdAt).toLocaleDateString() : ""
    ),
  ];

  const insertTimecardHistoryMutation = useInsertTimecardHistoryMutation();

  const { userId } = getRouteApi(
    "/dashboard/_timecards/create-timecards"
  ).useRouteContext();

  const errors = [timecardError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Paper>
          <Text>Errors fetching timecards history</Text>
          {errors.map((error, index) => (
            <Text key={index}>{error.message}</Text>
          ))}
        </Paper>
      </Stack>
    );
  }

  const handleBackClick = () => {
    setTimecardsUrl(null);
    toPrevStep();
  };

  const handleSubmitClick = () => {
    const insertTimecard: InsertTimecardHistoryRow = {
      added_by: userId,
      data: JSON.parse(JSON.stringify(timecardsData)),
    };

    insertTimecardHistoryMutation.mutate(insertTimecard, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Timecards Saved",
          message: "The latest timecards data has been saved",
        });

        toNextStep();
      },
      onError: (error) => {
        console.warn("Error saving latest timecard data: ", error.message);
        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Saving Timecards Failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <Stack>
      <Group grow>
        <Button onClick={handleBackClick}>Go Back</Button>
        <Button
          component={"a"}
          href={timecardsUrl}
          download={`timecards-${new Date().toLocaleDateString()}`}
          onClick={handleSubmitClick}
        >
          Download and Submit
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Regular Pay</Table.Th>
            <Table.Th>Overtime Pay</Table.Th>
            <Table.Th>Grand Total</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {summaryTableData.map((data, index) => (
            <Table.Tr key={index}>
              <Table.Th>{data.date}</Table.Th>
              <Table.Td>{data.regPay}</Table.Td>
              <Table.Td>{data.overtimePay}</Table.Td>
              <Table.Td>{data.total}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Box h={{ sm: 800, base: 700 }}>
        <iframe
          src={`${timecardsUrl}#toolbar=0`}
          title="Timecards PDF"
          width="100%"
          height="100%"
          style={{ border: "1px solid #ccc" }}
        />
      </Box>
    </Stack>
  );
}

function getSummaryData(
  timecardsData: TimecardValues[] | null,
  date: string
): { date: string; regPay: string; overtimePay: string; total: string } {
  if (timecardsData === null) {
    return {
      date: "-",
      regPay: "-",
      overtimePay: "-",
      total: "-",
    };
  }

  const regPay = timecardsData.reduce(
    (total, row) =>
      total +
      row.sundayRegularPay +
      row.mondayRegularPay +
      row.drivingRegularPay +
      Number(row.route1) + 
      Number(row.route2) +
      Number(row.miscAmount),
    0
  );

  const overtimePay = timecardsData.reduce(
    (total, row) =>
      total +
      row.sundayOvertimePay +
      row.mondayOvertimePay +
      row.drivingOvertimePay,
    0
  );

  return {
    date,
    regPay: `$${regPay.toFixed(2)}`,
    overtimePay: `$${overtimePay.toFixed(2)}`,
    total: `$${(regPay + overtimePay).toFixed(2)}`,
  };
}
