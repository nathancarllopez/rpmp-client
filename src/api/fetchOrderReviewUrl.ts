import type { OrderReportInfo } from "@/types/rpmp-types";

export default async function fetchOrderReviewUrl(info: OrderReportInfo): Promise<string> {
  const apiUrl = import.meta.env.VITE_BACKEND_URL + "/orders/generate-review";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  if (!response.ok) {
    console.warn("Failed to fetch order review url");

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