import LoadingScreen from "@/components/misc/LoadingScreen";
import TimecardsDisplay from "@/components/timecards/TimecardsDisplay";
import TimecardsForm from "@/components/timecards/TimecardsForm";
import { allProfilePicsOptions } from "@/tanstack-query/queries/allProfilePics";
import { allProfilesOptions } from "@/tanstack-query/queries/allProfiles";
import { timecardHistoryOptions } from "@/tanstack-query/queries/timecardHistory";
import type { TimecardValues } from "@/types/rpmp-types";
import { Center, Paper, Stack, Stepper, Text, Title } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute(
  "/dashboard/_timecards/create-timecards"
)({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(allProfilesOptions());
    queryClient.ensureQueryData(timecardHistoryOptions());
  },
  pendingComponent: LoadingScreen,
  component: CreateTimecards,
});

function CreateTimecards() {
  const { data: employeeInfo, error: employeeError } = useSuspenseQuery({
    ...allProfilesOptions(),
    select: (data) =>
      data.filter(
        (employee) =>
          employee.drivingRate !== null || employee.kitchenRate !== null
      ),
  });

  const { data: employeePics, error: picsError } = useSuspenseQuery(
    allProfilePicsOptions()
  );

  const [active, setActive] = useState(0);
  const [timecardsData, setTimecardsData] = useState<TimecardValues[]>(() =>
    employeeInfo.map((employee) => {
      if (!Object.hasOwn(employeePics, employee.userId)) {
        console.warn("Could not find profile picture for this employee:");
        console.warn(employee);
        throw new Error("Missing profile picture");
      }

      const profilePicUrl = employeePics[employee.userId];
      return {
        ...employee,
        hasChanged: false,
        renderKey: 0,
        profilePicUrl,
        drivingRate: employee.drivingRate || 0,
        kitchenRate: employee.kitchenRate || 0,
        sundayStart: "",
        sundayEnd: "",
        sundayTotalHours: 0,
        sundayOvertimeHours: 0,
        sundayOvertimePay: 0,
        sundayRegularPay: 0,
        sundayTotalPay: 0,
        mondayStart: "",
        mondayEnd: "",
        mondayTotalHours: 0,
        mondayOvertimeHours: 0,
        mondayOvertimePay: 0,
        mondayRegularPay: 0,
        mondayTotalPay: 0,
        drivingStart: "",
        drivingEnd: "",
        drivingTotalHours: 0,
        drivingOvertimeHours: 0,
        drivingOvertimePay: 0,
        drivingRegularPay: 0,
        drivingTotalPay: 0,
        costPerStop: 0,
        drivingTotalCost: 0,
        route1: "",
        route2: "",
        stops: 1,
        miscDescription: "",
        miscAmount: "",
        miscPayCode: "",
        grandTotal: 0,
      };
    })
  );
  const [timecardsUrl, setTimecardsUrl] = useState<string | null>(null);

  const initialTimecardsData = useMemo(() => timecardsData, []);

  const errors = [employeeError, picsError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Title>Create Timecards</Title>

        <Paper>
          <Text>Errors fetching employee info:</Text>
          {errors.map((error, index) => (
            <Text key={index}>{error.message}</Text>
          ))}
        </Paper>
      </Stack>
    );
  }

  const stepProps: Record<string, Record<string, string>> = {
    form: { label: "Step 1", description: "Add employee info" },
    display: { label: "Step 2", description: "Review timecards" },
    submit: { label: "Step 3", description: "Email timecards" },
  };
  const numSteps = Object.keys(stepProps).length;

  const toNextStep = () =>
    setActive((curr) => Math.min(curr + 1, numSteps));
  const toPrevStep = () => setActive((curr) => Math.max(0, curr - 1));

  return (
    <Stack>
      <Title>Create Timecards</Title>

      <Stepper active={active} allowNextStepsSelect={false}>
        <Stepper.Step {...stepProps.form}>
          <TimecardsForm
            timecardsData={timecardsData}
            setTimecardsData={setTimecardsData}
            initialTimecardsData={initialTimecardsData}
            setTimecardsUrl={setTimecardsUrl}
            toNextStep={toNextStep}
          />
        </Stepper.Step>
        <Stepper.Step {...stepProps.display}>
          {timecardsUrl !== null ? (
            <TimecardsDisplay
              timecardsData={timecardsData}
              timecardsUrl={timecardsUrl}
              setTimecardsUrl={setTimecardsUrl}
              toPrevStep={toPrevStep}
              toNextStep={toNextStep}
            />
          ) : (
            <Text>Error: No timecards url provided</Text>
          )}
        </Stepper.Step>
        <Stepper.Step {...stepProps.submit}>
          <Text>
            In this step we can either email the timecard pdfs and payment can
            still be done manually, or (if we are open to moving away from
            CashApp) we can make payments via an API call
          </Text>
        </Stepper.Step>
        <Stepper.Completed>
          <Center mt={"md"}>
            <Title order={3}>Timecards Complete!</Title>
          </Center>
        </Stepper.Completed>
      </Stepper>
    </Stack>
  );
}
