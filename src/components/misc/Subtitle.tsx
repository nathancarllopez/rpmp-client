import { Text } from "@mantine/core";
import type React from "react";

interface SubtitleProps {
  textAlign?: "start" | "center" | "end";
  children: React.ReactNode;
}

export default function Subtitle({ textAlign = "center", children }: SubtitleProps) {
  return (
    <Text c="dimmed" size="sm" ta={textAlign}>
      {children}
    </Text>
  );
}
