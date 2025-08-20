import { IconMoon, IconSun } from "@tabler/icons-react";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";

export default function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      size="xl"
      radius="md"
    >
      {computedColorScheme === "dark" && <IconSun stroke={1.5} />}
      {computedColorScheme === "light" && <IconMoon stroke={1.5} />}
    </ActionIcon>
  );
}
