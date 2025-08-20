import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

const endpoint = '/health';

export default function useWakeUpServer() {
  useEffect(() => {
    if (import.meta.env.MODE !== "production") return;

    const apiUrl = import.meta.env.VITE_BACKEND_URL + endpoint;
    const wakeUpServer = async () => {
      try {
        fetch(apiUrl);
      } catch (error) {
        if (error instanceof Error) {
          console.warn("Error waking up server: ", error.message);
        } else {
          console.warn("Unknown error waking up server: ", JSON.stringify(error));
        }

        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Failed to wake up server",
          message: "Wait a minute and then reload the page"
        });
      }
    };

    wakeUpServer();
  }, []);
}