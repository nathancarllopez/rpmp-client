import type { TimecardDisplayValues } from "@/types/rpmp-types";

export default async function fetchTimecardsUrl(
  timecards: TimecardDisplayValues[],
): Promise<string> {
  const apiUrl =
    import.meta.env.VITE_BACKEND_URL + "/timecards/generate-timecards";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timecards }),
  });

  if (!response.ok) {
    console.warn("Failed to fetch timecards url");

    const errorData = await response.json();
    if (errorData instanceof Error) {
      console.warn(errorData.message);
    } else {
      console.warn(JSON.stringify(errorData));
    }

    throw errorData;
  }

  const pdfBlob = await response.blob();
  return URL.createObjectURL(pdfBlob);
}
