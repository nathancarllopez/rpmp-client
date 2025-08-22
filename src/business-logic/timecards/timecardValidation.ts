import type { TimecardValues } from "@/types/rpmp-types";

export function validateTimecards(
  timecardsData: TimecardValues[],
): Record<string, string>[] | null {
  let errorsFound = false;
  const validationErrors = timecardsData.map((timecard) => {
    const errors: Record<string, string> = {};
    const {
      sundayStart,
      sundayEnd,
      mondayStart,
      mondayEnd,
      drivingStart,
      drivingEnd,
      route1,
      route2,
      miscDescription,
      miscAmount,
      miscPayCode,
    } = timecard;

    const timePairs = [
      [sundayStart, sundayEnd, "sunday"],
      [mondayStart, mondayEnd, "monday"],
      [drivingStart, drivingEnd, "driving"],
    ];
    const missingMessage = "Both times need to be entered";
    timePairs.forEach(([start, end, keyPrefix]) => {
      const wrongOrderMessage: string | null = startBeforeEnd(start, end);
      if (wrongOrderMessage !== null) {
        errorsFound = true;
        errors[keyPrefix + "Start"] = wrongOrderMessage;
        errors[keyPrefix + "End"] = wrongOrderMessage;
      }

      if (!!start !== !!end) {
        errorsFound = true;
        if (!start) {
          errors[keyPrefix + "Start"] = missingMessage;
        } else {
          errors[keyPrefix + "End"] = missingMessage;
        }
      }
    });

    const routes = [route1, route2];
    routes.forEach((route, index) => {
      if (route && (!drivingStart || !drivingEnd)) {
        errorsFound = true;
        errors[`route${index + 1}`] = "Enter driving start and end time";
      }
    });

    const misc = [
      {
        value: miscDescription,
        others: [miscAmount, miscPayCode],
        key: "miscDescription",
        message: "Enter payment description",
      },
      {
        value: miscAmount,
        others: [miscDescription, miscPayCode],
        key: "miscAmount",
        message: "Enter payment amount",
      },
      {
        value: miscPayCode,
        others: [miscAmount, miscDescription],
        key: "miscPayCode",
        message: "Enter pay code",
      },
    ];
    misc.forEach(({ value, others, key, message }) => {
      if (!value && others.some((other) => !!other)) {
        errorsFound = true;
        errors[key] = message;
      }
    });

    return errors;
  });

  if (errorsFound) {
    return validationErrors;
  }

  return null;
}

function toSeconds(time: string) {
  if (!/^\d{1,2}:\d{1,2}:\d{1,2}$/.test(time)) {
    return 0;
  }
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

export function getDuration(time1: string, time2: string) {
  if (!time1 || !time2) return 0;

  const seconds1 = toSeconds(time1);
  const seconds2 = toSeconds(time2);
  const diff = seconds2 - seconds1;

  return diff > 0 ? diff / 3600 : 0;
}

export function startBeforeEnd(start: string, end: string) {
  if (!start || !end) return null;

  const startSeconds = toSeconds(start);
  const endSeconds = toSeconds(end);

  if (startSeconds <= endSeconds) return null;

  return "End time must be after start time";
}
