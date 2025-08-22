import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Box, Button, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Dropzone, MIME_TYPES, type FileWithPath } from "@mantine/dropzone";
import { IconFileDescription, IconUpload, IconX } from "@tabler/icons-react";
import Papa from "papaparse";
import type { AllBackstockRow, OrderReportInfo, VeggieCarbInfoRow } from "@/types/rpmp-types";
import { orderHeadersOptions } from "@/tanstack-query/queries/orderHeaders";
import { flavorsOptions } from "@/tanstack-query/queries/flavors";
import { backstockOptions } from "@/tanstack-query/queries/backstock";
import { veggieCarbInfoOptions } from "@/tanstack-query/queries/veggieCarbInfo";
import Subtitle from "../misc/Subtitle";
import { cleanParsedOrderData } from "@/business-logic/orders/cleanParsedOrderData";
import { calculateMealRows } from "@/business-logic/orders/calculateMealRows";
import { updateProteinWeights } from "@/business-logic/orders/updateProteinWeights";
import calculateStats from "@/business-logic/orders/calculateStats";
import fetchOrderReviewUrl from "@/api/fetchOrderReviewUrl";
import classes from "./OrderDropzone.module.css";

export interface OrderDropzoneProps {
  orderReportInfo: OrderReportInfo;
  setOrderReportInfo: React.Dispatch<React.SetStateAction<OrderReportInfo>>;
  setReviewOrderUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  toNextStep: () => void;
}

export function OrderDropzone({
  orderReportInfo,
  setOrderReportInfo,
  setReviewOrderUrl,
  toNextStep,
}: OrderDropzoneProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const atSmallBp = useMediaQuery("(min-width: 48em)");

  const {
    headerMapping,
    headerError,
    flavorMapping,
    flavorMappingError,
    backstockError,
    proteinBackstock,
    veggieCarbBackstock,
    veggieCarbInfo,
    veggieCarbError,
  } = useQueryData();

  const errors = [
    headerError,
    flavorMappingError,
    backstockError,
    veggieCarbError,
  ].filter((err) => !!err);
  if (errors.length > 0) {
    return (
      <Stack mt={"md"}>
        {errors.map((err, index) => (
          <Text key={index}>{err.message}</Text>
        ))}
      </Stack>
    );
  }

  const handleDrop = async (files: FileWithPath[]) => {
    setIsParsing(true);

    Papa.parse(files[0], {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
      complete: (results) =>
        handleParseComplete(
          results,
          orderReportInfo,
          setParseError,
          setIsParsing,
          headerMapping,
          flavorMapping,
          proteinBackstock,
          veggieCarbInfo,
          veggieCarbBackstock,
          setOrderReportInfo,
          setReviewOrderUrl,
          toNextStep
        ),
    });
  };

  const handleReject = () => {
    notifications.show({
      withCloseButton: true,
      color: "red",
      title: "Incorrect File Format",
      message: "Please upload a csv",
    });
  };

  return (
    <Stack mt={"md"}>
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        accept={[MIME_TYPES.csv]}
        loading={isParsing}
        disabled={parseError !== null}
        className={parseError !== null ? classes.disabled : undefined}
      >
        <Group justify="center" mih={100} style={{ pointerEvents: "none" }}>
          <Dropzone.Idle>
            <IconFileDescription size={50} />
          </Dropzone.Idle>
          <Dropzone.Accept>
            <IconUpload size={50} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={50} />
          </Dropzone.Reject>

          <Container mx={0}>
            <Title order={atSmallBp ? 3 : 4} ta={"center"}>
              {atSmallBp
                ? "Drag and drop the order sheet here"
                : "Tap here to upload the order sheet"}
            </Title>
            <Box visibleFrom="sm">
              <Subtitle>You can also click to search for the order sheet</Subtitle>
            </Box>
          </Container>
        </Group>
      </Dropzone>

      {parseError && (
        <Paper>
          <Title order={3} mb={"md"}>Issue uploading order: {parseError}</Title>
          <Button fullWidth onClick={() => setParseError(null)}>Reset</Button>
        </Paper>
      )}
    </Stack>
  );
}

async function handleParseComplete(
  results: Papa.ParseResult<unknown>,
  orderReportInfo: OrderReportInfo,
  setParseError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsParsing: React.Dispatch<React.SetStateAction<boolean>>,
  headerMapping: {
    [name: string]: {
      label: string;
      rawLabel: string;
    };
  },
  flavorMapping: {
    [rawLabel: string]: {
      flavor: string;
      flavorLabel: string;
    };
  },
  proteinBackstock: AllBackstockRow[],
  veggieCarbInfo: VeggieCarbInfoRow[],
  veggieCarbBackstock: AllBackstockRow[],
  setOrderReportInfo: React.Dispatch<React.SetStateAction<OrderReportInfo>>,
  setReviewOrderUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
  toNextStep: () => void
) {
  const parseErrors = results.errors;

  if (parseErrors.length > 0) {
    setParseError(parseErrors.map((err) => JSON.stringify(err)).join("\n"));
    setIsParsing(false);
    return;
  }

  try {
    const { orders, cleaningErrors } = cleanParsedOrderData(
      results.data as Record<string, string>[],
      headerMapping,
      flavorMapping
    );

    if (cleaningErrors.length > 0) {
      setParseError(
        cleaningErrors.map((err) => JSON.stringify(err)).join("\n")
      );
      return;
    }

    const { proteinInfo: initialProteinInfo, stats: initialStats } = orderReportInfo;

    const { orderErrors, usedBackstockIds, meals } = calculateMealRows(
      orders,
      initialProteinInfo,
      proteinBackstock
    );

    const { proteinInfo, bisonCubes } = updateProteinWeights(
      initialProteinInfo,
      meals
    )

    const { stats, extraRoastedVeggies } = calculateStats(
      initialStats,
      orders,
      proteinInfo,
      veggieCarbInfo,
      veggieCarbBackstock,
      usedBackstockIds
    );

    const updatedInfo: OrderReportInfo = {
      ...orderReportInfo,
      orders,
      orderErrors,
      usedBackstockIds,
      meals,
      stats,
      pullListInfo: {
        ...orderReportInfo.pullListInfo,
        extraRoastedVeggies
      },
      proteinInfo,
      cookSheetInfo: {
        ...orderReportInfo.cookSheetInfo,
        proteinCubes: { "beefBison": bisonCubes }
      }
    };

    const url = await fetchOrderReviewUrl(updatedInfo);

    setOrderReportInfo(updatedInfo);
    setReviewOrderUrl(url);

    toNextStep();
  } catch (error) {
    console.warn("Error occurred while parsing order upload:");

    if (error instanceof Error) {
      console.warn(error.message);
      setParseError(error.message);
    } else {
      console.warn(JSON.stringify(error));
      setParseError(JSON.stringify(error))
    }
  } finally {
    setIsParsing(false);
  }
}

function useQueryData() {
  const { data: headerMapping, error: headerError } = useSuspenseQuery({
    ...orderHeadersOptions(),
    select: (data) =>
      data.reduce(
        (mapping, headerRow) => {
          if (headerRow.rawLabel) {
            // Some of the headers are only used to display, not parse the raw data
            mapping[headerRow.name] = {
              label: headerRow.label,
              rawLabel: headerRow.rawLabel,
            };
          }
          return mapping;
        },
        {} as { [name: string]: { label: string; rawLabel: string } }
      ),
  });

  const { data: flavorMapping, error: flavorMappingError } = useSuspenseQuery({
    ...flavorsOptions(),
    select: (data) =>
      data.reduce(
        (mapping, flavorRow) => {
          mapping[flavorRow.rawLabel] = {
            flavor: flavorRow.name,
            flavorLabel: flavorRow.label,
          };
          return mapping;
        },
        {} as { [rawLabel: string]: { flavor: string; flavorLabel: string } }
      ),
  });

  const { data: allBackstock, error: backstockError } = useSuspenseQuery({
    ...backstockOptions(),
    select: (data) => data.filter((bRow) => !bRow.claimed),
  });
  const { proteinBackstock, veggieCarbBackstock } = allBackstock.reduce(
    (result, row) => {
      if (row.isProtein) {
        result.proteinBackstock.push(row);
      } else {
        result.veggieCarbBackstock.push(row);
      }
      return result;
    },
    { proteinBackstock: [], veggieCarbBackstock: [] } as {
      proteinBackstock: AllBackstockRow[];
      veggieCarbBackstock: AllBackstockRow[];
    }
  );

  const { data: veggieCarbInfo, error: veggieCarbError } = useSuspenseQuery(
    veggieCarbInfoOptions()
  );

  return {
    headerMapping,
    headerError,
    flavorMapping,
    flavorMappingError,
    backstockError,
    proteinBackstock,
    veggieCarbBackstock,
    veggieCarbInfo,
    veggieCarbError,
  };
}