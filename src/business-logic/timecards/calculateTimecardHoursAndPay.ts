import type { TimecardValues } from "@/types/rpmp-types";
import { getDuration } from "./timecardValidation";

export function calculateTimecardHoursAndPay(
  formValues: TimecardValues,
): Record<string, number> {
  const {
    sundayStart,
    sundayEnd,
    mondayStart,
    mondayEnd,
    drivingStart,
    drivingEnd,
    kitchenRate,
    drivingRate,
    route1,
    route2,
    stops,
    miscAmount,
  } = formValues;

  let hoursAndPay: Record<string, number> = {
    sundayTotalHours: 0,
    sundayOvertimeHours: 0,
    sundayRegularPay: 0,
    sundayOvertimePay: 0,
    sundayTotalPay: 0,
    mondayTotalHours: 0,
    mondayOvertimeHours: 0,
    mondayRegularPay: 0,
    mondayOvertimePay: 0,
    mondayTotalPay: 0,
    drivingTotalHours: 0,
    drivingOvertimeHours: 0,
    drivingRegularPay: 0,
    drivingOvertimePay: 0,
    drivingTotalPay: 0,
    route1: Number(route1),
    route2: Number(route2),
    stops,
    costPerStop: 0,
    drivingTotalCost: 0,
    grandTotal: 0,
  };

  const [sundayDuration, mondayDuration, drivingDuration] = [
    [sundayStart, sundayEnd],
    [mondayStart, mondayEnd],
    [drivingStart, drivingEnd],
  ].map(([start, end]) => parseFloat(getDuration(start, end).toFixed(2)));

  if (sundayDuration > 0) {
    const overtime = Math.max(0, sundayDuration - 8);

    hoursAndPay = {
      ...hoursAndPay,
      sundayTotalHours: sundayDuration,
      sundayOvertimeHours: overtime,
      sundayRegularPay: sundayDuration * kitchenRate,
      sundayOvertimePay: overtime * 0.5 * kitchenRate,
      sundayTotalPay:
        sundayDuration * kitchenRate + overtime * 0.5 * kitchenRate,
    };
  }

  if (mondayDuration > 0 || drivingDuration > 0) {
    const mondayOvertime = Math.max(0, mondayDuration - 8);
    const drivingOvertime =
      mondayOvertime > 0
        ? drivingDuration
        : Math.max(0, mondayDuration + drivingDuration - 8);

    hoursAndPay = {
      ...hoursAndPay,
      mondayTotalHours: mondayDuration,
      mondayOvertimeHours: mondayOvertime,
      mondayRegularPay: mondayDuration * kitchenRate,
      mondayOvertimePay: mondayOvertime * 0.5 * kitchenRate,
      // Sum of the previous two
      mondayTotalPay:
        mondayDuration * kitchenRate + mondayOvertime * 0.5 * kitchenRate,
      drivingTotalHours: drivingDuration,
      drivingOvertimeHours: drivingOvertime,
      drivingRegularPay: drivingDuration * drivingRate,
      drivingOvertimePay: drivingOvertime * 0.5 * drivingRate,
      // Sum of the previous two and routes 1 and 2
      drivingTotalPay:
        drivingDuration * drivingRate +
        drivingOvertime * 0.5 * drivingRate +
        Number(route1) +
        Number(route2),
      // All driving pay divided by number of stops
      costPerStop:
        (drivingDuration * drivingRate +
          drivingOvertime * 0.5 * drivingRate +
          Number(route1) +
          Number(route2)) /
        stops,
    };
  }

  hoursAndPay.drivingTotalCost =
    stops * Math.max(0, hoursAndPay.costPerStop - 8);
  hoursAndPay.grandTotal =
    hoursAndPay.mondayTotalPay +
    hoursAndPay.sundayTotalPay +
    hoursAndPay.drivingTotalPay +
    Number(miscAmount);

  return hoursAndPay;
}
