import { Title } from "@mantine/core";

export default function NavLinkLabel({ label }: { label: React.ReactNode }) {
  return (
    <Title order={4} fw={"normal"} ml={"md"}>
      {label}
    </Title>
  );
}
