import fetchTimecardsUrl from "@/api/fetchTimecardsUrl";
import { formatTimecardsData } from "@/business-logic/timecards/formatTimecardsData";
import LoadingScreen from "@/components/misc/LoadingScreen";
import { timecardHistoryOptions } from "@/tanstack-query/queries/timecardHistory";
import {
  Box,
  Button,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard/_timecards/timecard-history")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(timecardHistoryOptions());
  },
  pendingComponent: LoadingScreen,
  component: TimecardHistory,
});

function TimecardHistory() {
  const [selected, setSelected] = useState<string>("");
  const [displayedUrl, setDisplayedUrl] = useState<string | null>(null);

  const { data: timecardHistoryRows, error: timecardError } = useSuspenseQuery(
    timecardHistoryOptions()
  );
  const selectData = useMemo(
    () =>
      timecardHistoryRows.map((row) => ({
        value: row.id.toString(),
        label: new Date(row.createdAt).toLocaleString(),
      })),
    [timecardHistoryRows]
  );

  const errors = [timecardError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Title>Timecard History</Title>

        <Paper>
          <Text>Errors fetching timecard info:</Text>
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

    const timecardsMatch = timecardHistoryRows.find(
      (row) => row.id === Number(value)
    );
    if (timecardsMatch === undefined) {
      console.warn("Could not find matching timecard for this row id:");
      console.warn(value);
      console.warn(timecardHistoryRows);

      throw new Error("No timecard history match");
    }

    const timecardsData = formatTimecardsData(timecardsMatch.data);
    const url = await fetchTimecardsUrl(timecardsData);
    setDisplayedUrl(url);
  };

  return (
    <Stack>
      <Title>Timecard History</Title>

      <Tooltip
        disabled={selectData.length > 0}
        label="No timecard history found"
      >
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
        download={`archived-timecards`}
        disabled={displayedUrl === null}
      >
        Download
      </Button>

      {displayedUrl !== null && (
        <Box h={{ sm: 800, base: 700 }}>
          <iframe
            src={`${displayedUrl}#toolbar=0`}
            title="Timecards PDF"
            width="100%"
            height="100%"
            style={{ border: "1px solid #ccc" }}
          />
        </Box>
      )}
    </Stack>
  );
}
