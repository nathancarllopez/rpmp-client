import { Box, LoadingOverlay } from "@mantine/core";

export default function LoadingScreen() {
  return (
    <Box pos={"relative"}>
      <LoadingOverlay visible overlayProps={{ backgroundOpacity: 0 }} />
      <div style={{ width: "100vw", height: "50vh" }}></div>
    </Box>
  );
}
