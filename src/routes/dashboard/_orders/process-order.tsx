import { useState } from "react";
import { Center, Paper, Stack, Stepper, Text, Title } from "@mantine/core";
import { createFileRoute, useBlocker } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orderHeadersOptions } from "@/tanstack-query/queries/orderHeaders";
import { proteinsOptions } from "@/tanstack-query/queries/proteins";
import { flavorsOptions } from "@/tanstack-query/queries/flavors";
import { backstockOptions } from "@/tanstack-query/queries/backstock";
import { veggieCarbInfoOptions } from "@/tanstack-query/queries/veggieCarbInfo";
import { pullListOptions } from "@/tanstack-query/queries/pullList";
import { storeInfoOptions } from "@/tanstack-query/queries/storeInfo";
import { shopTemplateRowsOptions } from "@/tanstack-query/queries/shopTemplateRows";
import { cookSheetSectionsOptions } from "@/tanstack-query/queries/cookSheetSections";
import LoadingScreen from "@/components/misc/LoadingScreen";
import type { OrderReportInfo } from "@/types/rpmp-types";
import { getBlankOrderReportInfo } from "@/business-logic/orders/getBlankOrderReportInfo";
import NavigationBlockAlert from "@/components/misc/NavigationBlockAlert";
import { OrderDropzone } from "@/components/orders/OrderDropzone";
import OrderReviewer from "@/components/orders/OrderReviewer";
import ShopEditor from "@/components/orders/ShopEditor";
import ReportDisplay from "@/components/orders/ReportDisplay";

export const Route = createFileRoute(
  "/dashboard/_orders/process-order"
)({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(orderHeadersOptions());
    queryClient.ensureQueryData(proteinsOptions());
    queryClient.ensureQueryData(flavorsOptions());
    queryClient.ensureQueryData(backstockOptions());
    queryClient.ensureQueryData(veggieCarbInfoOptions());
    queryClient.ensureQueryData(pullListOptions());
    queryClient.ensureQueryData(storeInfoOptions());
    queryClient.ensureQueryData(shopTemplateRowsOptions());
    queryClient.ensureQueryData(cookSheetSectionsOptions());
  },
  pendingComponent: LoadingScreen,
  component: OrderProcessor,
});

function OrderProcessor() {
  const { data: proteinRows, error: proteinError } = useSuspenseQuery(proteinsOptions())

  const [active, setActive] = useState(0);
  const [orderReportInfo, setOrderReportInfo] = useState<OrderReportInfo>(() =>
    getBlankOrderReportInfo(proteinRows, proteinError)
  );
  const [infoHistory, setInfoHistory] = useState<OrderReportInfo[]>([]);
  const [reviewOrderUrl, setReviewOrderUrl] = useState<string | undefined>(undefined);
  const [reportUrl, setReportUrl] = useState<string | undefined>(undefined);

  const blockerProps = useBlocker({
    shouldBlockFn: () => active === 2 || active === 3,
    withResolver: true,
  });
  const alertText = {
    title: "Leave Without Saving?",
    message: active === 2 ? "Any changes you've made to the shop sheet will not be saved if you leave this page." : "The final report has not been downloaded and the backstock has not been updated. Leave anyway?"
  };

  const errors = [proteinError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Title>Process Order</Title>

        <Paper>
          <Text>Error fetching order data:</Text>
          {errors.map((error, index) => <Text key={index}>{error.message}</Text>)}
        </Paper>
      </Stack>
    );
  }

  const stepProps: Record<string, Record<string, string>> = {
    dropzone: { label: "Step 1", description: "Upload order sheet" },
    review: { label: "Step 2", description: "Review orders" },
    edit: { label: "Step 3", description: "Edit shop sheet" },
    download: { label: "Step 4", description: "Download order report" },
  };
  const numSteps = Object.keys(stepProps).length;

  const toNextStep = () =>
    setActive((curr) => Math.min(curr + 1, numSteps));
  const toPrevStep = () => {
    if (infoHistory.length === 0) {
      setOrderReportInfo(getBlankOrderReportInfo(proteinRows, proteinError));
    } else {
      const prevInfo = infoHistory[infoHistory.length - 1];
      setOrderReportInfo({ ...prevInfo });
      setInfoHistory((curr) => curr.slice(0, -1))
    }

    setActive((curr) => Math.max(0, curr - 1));
  };
  const backToUpload = () => {
    setOrderReportInfo(getBlankOrderReportInfo(proteinRows, proteinError));
    setActive(0);
  }

  return (
    <Stack>
      <NavigationBlockAlert
        blockerProps={blockerProps}
        alertText={alertText}
      />

      <Title>Process Order</Title>

      <Stepper active={active} allowNextStepsSelect={false}>
        <Stepper.Step {...stepProps.dropzone}>
          <OrderDropzone
            orderReportInfo={orderReportInfo}
            setOrderReportInfo={setOrderReportInfo}
            setReviewOrderUrl={setReviewOrderUrl}
            toNextStep={toNextStep}
          />
        </Stepper.Step>
        <Stepper.Step {...stepProps.review}>
          {reviewOrderUrl ? (
            <OrderReviewer
              reviewOrderUrl={reviewOrderUrl}
              setReviewOrderUrl={setReviewOrderUrl}
              orderReportInfo={orderReportInfo}
              setOrderReportInfo={setOrderReportInfo}
              setInfoHistory={setInfoHistory}
              toNextStep={toNextStep}
              toPrevStep={toPrevStep}
            />
          ) : (
            <Text>No review order url provided</Text>
          )}
        </Stepper.Step>
        <Stepper.Step {...stepProps.edit}>
          {reviewOrderUrl ? (
            <ShopEditor
              reviewOrderUrl={reviewOrderUrl}
              orderReportInfo={orderReportInfo}
              setOrderReportInfo={setOrderReportInfo}
              setReportUrl={setReportUrl}
              setInfoHistory={setInfoHistory}
              toNextStep={toNextStep}
              backToUpload={backToUpload}
            />
          ) : (
            <Text>No review order url provided</Text>
          )}
        </Stepper.Step>
        <Stepper.Step {...stepProps.download}>
          {reportUrl ? (
            <ReportDisplay
              orderReportInfo={orderReportInfo}
              reportUrl={reportUrl}
              toNextStep={toNextStep}
              toPrevStep={toPrevStep}
            />
          ) : (
            <Text>No report url provided</Text>
          )}
        </Stepper.Step>
        <Stepper.Completed>
          <Center mt={"md"}>
            <Title order={3}>Order processing complete!</Title>
          </Center>
        </Stepper.Completed>
      </Stepper>
    </Stack>
  );
}