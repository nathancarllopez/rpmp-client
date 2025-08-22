import type { ProfileRow, TimecardValues } from "@/types/rpmp-types";

export function getBlankTimecardsData(
  employeeInfo: ProfileRow[],
  employeePics: Record<string, string>
): TimecardValues[] {
  return employeeInfo.map((employee) => {
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
  });
}
