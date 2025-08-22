import type { TimecardDisplayValues, TimecardValues } from "@/types/rpmp-types";

export function formatTimecardsData(
  timecardsData: TimecardValues[],
): TimecardDisplayValues[] {
  const formatAmount = (amount: number | "") => `$${Number(amount).toFixed(2)}`;
  const formatTime = (milTime: string) => {
    if (!milTime) return "";
    const [hourStr, minuteStr] = milTime.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${hour}:${minute}${ampm}`;
  };
  const formatDuration = (duration: number) => {
    if (isNaN(duration) || duration <= 0) return "";
    return `${duration} ${duration === 1 ? "hr" : "hrs"}`;
  };

  return timecardsData.map((timecard) => ({
    ...timecard,
    drivingRate: formatAmount(timecard.drivingRate),
    kitchenRate: formatAmount(timecard.kitchenRate),
    sundayStart: formatTime(timecard.sundayStart),
    sundayEnd: formatTime(timecard.sundayEnd),
    sundayTotalHours: formatDuration(timecard.sundayTotalHours),
    sundayOvertimeHours: formatDuration(timecard.sundayOvertimeHours),
    sundayOvertimePay: formatAmount(timecard.sundayOvertimePay),
    sundayRegularPay: formatAmount(timecard.sundayRegularPay),
    sundayTotalPay: formatAmount(timecard.sundayTotalPay),
    mondayStart: formatTime(timecard.mondayStart),
    mondayEnd: formatTime(timecard.mondayEnd),
    mondayTotalHours: formatDuration(timecard.mondayTotalHours),
    mondayOvertimeHours: formatDuration(timecard.mondayOvertimeHours),
    mondayOvertimePay: formatAmount(timecard.mondayOvertimePay),
    mondayRegularPay: formatAmount(timecard.mondayRegularPay),
    mondayTotalPay: formatAmount(timecard.mondayTotalPay),
    drivingStart: formatTime(timecard.drivingStart),
    drivingEnd: formatTime(timecard.drivingEnd),
    drivingTotalHours: formatDuration(timecard.drivingTotalHours),
    drivingOvertimeHours: formatDuration(timecard.drivingOvertimeHours),
    drivingOvertimePay: formatAmount(timecard.drivingOvertimePay),
    drivingRegularPay: formatAmount(timecard.drivingRegularPay),
    drivingTotalPay: formatAmount(timecard.drivingTotalPay),
    costPerStop: formatAmount(timecard.costPerStop),
    drivingTotalCost: formatAmount(timecard.drivingTotalCost),
    route1: formatAmount(timecard.route1),
    route2: formatAmount(timecard.route2),
    stops: String(timecard.stops),
    miscAmount: formatAmount(timecard.miscAmount),
    grandTotal: formatAmount(timecard.grandTotal),
  }));
}
