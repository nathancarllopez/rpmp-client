import Subtitle from "@/components/misc/Subtitle";
import useCountdown from "@/hooks/useCountdown";
import { Anchor, Box, Center, Container, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/loggedOut")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigateTo = "/";
  const remaining = useCountdown(5, navigateTo);

  return (
    <Container size={460} my={50} ta={"center"}>
      <Title my={5}>Logged out</Title>
      <Subtitle>Redirecting to the login page in {remaining}</Subtitle>

      <Anchor component={Link} c="dimmed" size="sm" to="/">
        <Center inline>
          <IconArrowLeft size={12} stroke={1.5} />
          <Box ml={5}>Back to the login page</Box>
        </Center>
      </Anchor>
    </Container>
  );
}
